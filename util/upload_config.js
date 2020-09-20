require("dotenv").config();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// image config
aws.config.update(
    {
      secretAccessKey:process.env.SECRET_ACCESS_KEY,
      accessKeyId:process.env.ACCESS_KEY_ID,
      region:"us-east-2"
    }
  )

  const s3=new aws.S3();

  const fileFilter=(req,file,cb)=>
  {
    if(file.mimetype==="image/jpg" || file.mimetype==="image/jpeg" || file.mimetype==="image/png" )
    {
      cb(null,true);
    }
    else
    {
      cb(new Error("Invalid mimetype,only JPEG,PNG and JPG"),false);
    }
  }

const upload=multer({
  fileFilter:fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'bechho-image',
    acl:'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "bechho-image-upload"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
 });

 module.exports=upload;