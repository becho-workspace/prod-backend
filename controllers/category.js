const Category = require("../models/category");
const { RegulatoryComplianceList } = require("twilio/lib/rest/numbers/v2/regulatoryCompliance");
const { json } = require("body-parser");
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err || !cate) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = cate;
    next();
  });
};


exports.getSubCategoryById = (req,res,next,id)=>
{ 
  Category.findOne({"subCategory._id":id},{"subCategory.$.mcq":1,_id:0})
  .exec((err, subc) => 
  { if (err || !subc) 
    { return res.status(400).json(
      { 
        error: "SubCategory not found in DB"
      }); 
    }
    req.subCategory = subc; 
    next(); 
  }); 
}


exports.createCategory = (req, res) => {
  Category.findOne({name:req.body.catName})
  .exec((err,category)=>
  {
    if(err || !category)
    {
      Category.create(
        {
          name:req.body.catName
        },(err, cat) => {
        if (err) {
          return res.status(400).json({
            error: "NOT able to save category in DB",
          });
        }
            Category.findById(cat._id)
            .exec((err,category)=>
            {
              if(err)
              {
                return res.status(500).json(
                  {
                    error:"Server error"
                  }
                )
              }
              if(!category)
              {
                return res.status(400).json(
                  {
                    error:"Category not found"
                  }
                )
              }
              category.subCategory.push(
                {
                name:req.body.subName,
                mcq:req.body.mcq
              })
              category.save((err,category)=>
              {
                if (err) {
                  return res.status(400).json({
                    error: "NOT able to save category in DB",
                  });
                }
                return res.json({ category });
              })
            })
      });
        }
    else
  {
        Category.findOne({"subCategory.name":req.body.subName})
        .exec((err,cate)=>
        {
          if(err)
          {
            return res.status(500).json(
              {
                error:"Server error"
              }
            )
          }

          if(cate)
          {
            return res.status(400).json(
              {
                error:"Subcategory already existed"
              }
            )
          }
          category.subCategory.push(
            {
            name:req.body.subName,
            mcq:req.body.mcq
            })
                category.save((err,category)=>
                {
                  if (err) {
                    return res.status(400).json({
                      error: "NOT able to save category in DB",
                    });
                  }
                  return res.json({ category });
                })
        })
      }
  })
}
 

exports.getCategory = (req, res) => {
  return res.json(req.category);
};


exports.getSubCategory = (req,res)=>
  {
   return res.json(req.subCategory.subCategory[0]) 
  }


exports.getAllCategory = (req, res) => {
  Category.find().select("-subCategory").exec((err, categories) => {
    if (err || categories.length==0) {
      return res.status(400).json({
        error: "NO categories found",
      });
    }
    res.json(categories);
  });
};


exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};


exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this category",
      });
    }
    res.json({
      message: `${category.name} Successfully deleted`,
    });
  });
};


exports.removeSubCategory=(req,res)=>
{
   Category.findOneAndUpdate({
     "subCategory.name":req.body.subName
   },
   {
     $pull:{
      subCategory:{
        name:req.body.subName
      }
     }
   },{new:true,useFindAndModify:false},
   (err,cate)=>
   {
     if(err || cate.length==0)
     {
      return res.status(400).json({
        error: `Failed to delete  sub-category`,
      });
     }
    return  res.json({
      message: `${req.body.subName} sub-category Successfully deleted`,
    });
   })
    }

