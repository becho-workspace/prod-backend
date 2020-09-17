const dotenv = require("dotenv");
const User = require("../models/user");
const Order = require("../models/order");
const client = require('twilio')(process.env.accountSid, process.env.authToken);
exports.getUserById = (req, res, next, id) => {
  User.findById(id).populate("userProducts").exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No such user exists "
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.otpExpired=undefined
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update your profile"
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this account"
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  //store thi in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list"
        });
      }
      next();
    }
  );
};

// Number verification

module.exports.getOTP=(req,res)=>
{
  User.findById(req.profile._id)
  .exec((err,user)=>
  {
    if (err || !user) {
      return res.status(400).json({
        error: "No such user existes "
      });
    }
    const OTP=Math.floor((Math.random()*100000)+100000);
    user.OTP=OTP;
    user.otpExpired=Date.now()+(3*60*1000);
    // console.log(OTP)
    user.save((err,user)=>
    {
      if(err)
      {
       return res.status(500).json(
        {
          error:"User not saved"
        }
      )
      }

      // Message
      client.messages
      .create({
          body: `Your OTP for Reseting password is ${OTP}`,
          from: '+12025176035',
          to: '+91'+user.contact
      },(err,info)=>
      {
         if(err)
         {
           return res.status(500).json(
             {
               error:"Internet not connected"
             }
           )
         }
         return res.json({
           msg:"Message succesfully sent"
         });
      })
    })
  })
}

module.exports.numberVerify=(req,res)=>
{
  User.findOne(
    {
      _id:req.profile._id,
      otpExpired:{$gt:Date.now()}
    })
    .exec((err,user)=>
    {
      if(err || !user)
      {
        return res.status(400).json(
          {
            error:"OTP is expired,try again"
          });
      }
      if(user.OTP==req.body.OTP)
      {
       user.OTP=undefined;
       user.otpExpired=undefined
       user.verifiedUser=true;
       user.save((err,user)=>
       {
         if(err)
         {
           return res.status(500).json(
             {
               error:"User not save"
             }
           )
         }
         return res.status(300).json(
           {
             msg:"User is succesfully verified"
           }
         )
       })
      }
      else
      {
        return res.status(400).json(
          {
            error:"OTP not matched"
          }
        )
      }

    })
}

exports.addBidDetailsToUser = (req, res) => {
  User.findOneAndUpdate(
    { userId: req.params.userId },
    {
      $push: {
        mybids: {
          productId: req.params.productId,
          bidOffer: req.body.price,
          status: req.body.status,
        },
      },
    },{new: true, useFindAndModify: false},

    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if (!result) return res.status(404).json("Not found");
      const msg = "Done";
      return res.status(200).json(msg);
    }
  );
}