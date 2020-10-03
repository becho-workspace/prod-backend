const Product = require("../models/product");
const _ = require("lodash");
const fs = require("fs");
const User = require("../models/user");
const { queryCheck } = require("../util/util");
const aws = require('aws-sdk');
const s3 = new aws.S3({
  secretAccessKey:process.env.SECRET_ACCESS_KEY,
   accessKeyId:process.env.ACCESS_KEY_ID
}); 

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    req.product = product;
    next();
  });
};

exports.createProduct = (req, res) => {
  //destructure the fields
  const {
    name,
    description,
    price,
    category,
    subCategoryName,
    stock,
    userId,
    address,
    city,
    ans1,
    ans2,
    ans3,
    ans4,
    ans5,
    ans6,
    ans7,
    ans8,
    ans9,
    ans10,
    ans11,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !address ||
    !city ||
    !subCategoryName||
    !ans1||
    !ans2||
    !ans3||
    !ans4||
    !ans5||
    !ans6||
    !ans7||
    !ans8||
    !ans9||
    !ans10||
    !ans11
  ) {
    return res.status(400).json({
      error: "Please include all fields",
    });
  }

  let product = new Product(req.body);
  product.userId = req.params.userId;

  if (!req.file) {
    return res.status(400).json({
      error: "Image is not uploaded, type of image is incorrect",
    });
  }

  if (req.file.size > 3000000) {
    return res.status(400).json({
      error: "File size too big!",
    });
  }

  product.photo.path = req.file.location;
  // save to the DB
  product.save((err, product) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    req.profile.userProducts.push(product);
    req.profile.save((err, user) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          error: "Server error 1",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  Product.findOne({ _id: req.query.id }).exec((err, product) => {
    if (!product || err) {
      return res.status(400).json({
        error: "Product was not found in DB",
      });
    }
    res.json(product);
  });
};

//middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// delete controllers
exports.deleteProduct = (req, res) => {
  const key=req.product.photo.path.split("/")[3];
  console.log(key)
  var params=
    {  
      Bucket: "bechho-image", 
      Key: key
    }
  s3.deleteObject(params,(err,data)=>{
     if(err)
     {
      return  res.status(500).json(
         {
           error:"Server error"
         }
       )
     }
     let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    const user = req.profile;
    user.userProducts.pull({ _id: deletedProduct._id });
    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to save the product",
        });
      }
       deletedProduct.photo = undefined;
         res.json({
           message: "Deletion was a success",
           deleteProduct: deletedProduct
         });
    });
  });
   })
};

// delete controllers
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed",
        });
      }
      res.json(product);
    });
  });
};

// Total product
exports.countProducts = (req, res) => {
  Product.countDocuments({
    $or: [{ "bid.status": { $ne: "Accepted" } }, { bid: { $size: 0 } }],
  })
    .then((data) => {
      if (data == 0) {
        return res.json({ msg: "NO products in DB" });
      }
      return res.json({ count: data });
    })
    .catch((err) => res.status(501).json({ err }));
};
//product listing

exports.getAllProducts = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let start = Number(req.query.start);
  let end = Number(req.query.end);
  let total = Number(req.query.total);
  let limit = 0;
  let skip = 0;
  if (queryCheck(start, end, total)) {
    if (start && !end) {
      limit = start;
      skip = 0;
    } else if (!start && end) {
      limit = 0;
      skip = total - end;
    } else if (start && end) {
      limit = end - start + 1;
      skip = start - 1;
    }
  }

  Product.find({
    $or: [{ "bid.status": { $ne: "Accepted" } }, { bid: { $size: 0 } }],
  })
    // .populate("name _id")
    .sort([[sortBy, "asc"]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err || products.length === 0) {
        return res.status(400).json({
          error: "NO product FOUND",
        });
      }

      res.json(products);
    });
};

exports.getAllProductsByCity = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let start = Number(req.query.start);
  let end = Number(req.query.end);
  let total = Number(req.query.total);
  let limit = 0;
  let skip = 0;
  if (queryCheck(start, end, total)) {
    if (start && !end) {
      limit = start;
      skip = 0;
    } else if (!start && end) {
      limit = 0;
      skip = total - end;
    } else if (start && end) {
      limit = end - start + 1;
      skip = start - 1;
    }
  }

  // { "bid.status":{$ne:"Accepted"}
  Product.find({
    $and: [
      { city: req.params.cityName },
      {
        $or: [{ "bid.status": { $ne: "Accepted" } }, { bid: { $size: 0 } }],
      },
    ],
  })
    .sort([[sortBy, "asc"]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err || products.length === 0) {
        return res.status(400).json({
          error: "NO product FOUND",
        });
      }
      res.json(products);
    });
};

exports.getAllProductsByCityAndSubCategoryName = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let start = Number(req.query.start);
  let end = Number(req.query.end);
  let total = Number(req.query.total);
  let limit = 0;
  let skip = 0;
  if (queryCheck(start, end, total)) {
    if (start && !end) {
      limit = start;
      skip = 0;
    } else if (!start && end) {
      limit = 0;
      skip = total - end;
    } else if (start && end) {
      limit = end - start + 1;
      skip = start - 1;
    }
  }

  Product.find({
    city: req.params.cityName,
    subCategoryName: req.params.subCategoryName,
    $and: [
      { city: req.params.cityName },
      { subCategoryName: req.params.subCategoryName },
      {
        $or: [{ "bid.status": { $ne: "Accepted" } }, { bid: { $size: 0 } }],
      },
    ],
  })
    .sort([[sortBy, "asc"]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err || products.length === 0) {
        return res.status(400).json({
          error: "NO product FOUND",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};

//get bids done user
// it can done by user scehma easily
exports.getbids = (req, res) => {
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  var cc = checkForHexRegExp.test(req.params.userId);
  if (!cc) {
    return res.json("Product not found");
  }
  return res.json({
    bid: req.profile.mybids,
    name: req.profile.name,
  });
};

//bid a product

exports.bidding = (req, res) => {
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  var cc = checkForHexRegExp.test(req.params.productId);
  if (!cc) {
    return res.json("Product not Found");
  }
  // user itself can't bid on its on product
  const a = req.product.assureBid(req.params.userId);
  if (a) {
    return res.status(400).json({ error: "You cant bid your own product" });
  }


  Product.findOneAndUpdate(
    { _id: req.params.productId },
    {
      $push: {
        bid: {
          askedprice: req.body.askedprice,
          offeredprice: req.body.offeredprice,
          userBidding: req.params.userId,
          status: req.body.status,
          name: req.profile.name,
        },
      },
    },
    { new: true, useFindAndModify: false },
    (err, result) => {
      if (err) return res.status(500).json({ msg: "error in saving bid" });
      if (!result) return res.status(404).json("Not found");
      req.profile.addBid(
        req.params.productId,
        req.body.offeredprice,
        req.body.askedprice,
        res
      );
    }
  );
};

exports.changependingstatus = (req, res) => {
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  var cc = checkForHexRegExp.test(req.params.productId);
  if (!cc) {
    return res.json("Product not found");
  }
  const b=req.product.verifyThatBidIsAlreadyAccpeted(req.product.bid)
  if(b) return res.status(400).json({error:"Product bid is already accpeted"})
  Product.findOneAndUpdate(
    {
      $and: [
        { _id: req.params.productId },
        { bid: { $elemMatch: { userBidding: req.params.biduserId } } },
      ],
    },
    {
      $set: {
        "bid.$.status": req.body.status,
      },
    },
    { new: true, useFindAndModify: false },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if (!result) return res.status(404).json("Not found");
      User.updateStatus(
        req.params.biduserId,
        req.params.productId,
        req.body.status,
        res
      );
    }
  );
};

exports.checkStatus = (req, res) => {
  Product.find(
    {
      _id: req.params.productId,
      "bid.userBidding": req.params.biduserId,
    },
    {
      "bid.$.status": 1,
    },
    { new: true, useFindAndModify: false },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if (!result) return res.status(404).json("No product found");
      return res.status(200).json(result);
      // console.log(bid.status);
    }
  );
};

//get all user's products
exports.getUserProducts = (req, res) => {
  var userBid = [],flag=true;
  if(req.profile.userProducts.length==0)
  {
    return res.status(404).json({error:"No Products Uploaded"})
  }
  req.profile.userProducts.forEach((product) => {
    
    if (product.bid.length == 0) {
      product.bid.push({status:"No bids"})
      
    }
    else 
    {
      // looping in product bids to check accept status
      for(const b of product.bid)
      {
        if(b.status=="Accepted")
        {
          product.bid.length=0
          product.bid.push({status:"Accepted"})
          flag=false
        }
      }
    // filtring bid of pending status
    if(flag)
    {
      userBid = product.bid.filter((bid) => {
        return bid.status == "Pending";
      });
      
          product.bid = userBid
    }
    }
  })
  return res.json({
    products: req.profile.userProducts,
  });
};
