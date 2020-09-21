  
const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const statuses = Object.freeze({
  0: 'Rejected',
  1: 'Accepted',
  2: 'Pending'
})

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    city:
    {
      type:String,
      required:true,
      lowercase:true
    },
    contact:
	  {
		  type:String,
      required:true
	  },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    userinfo: {
      type: String,
      trim: true
    },
    encry_password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Array,
      default: []
    },
    mybids:[
      {
          productId:String,
          bidOffer: Number,
          status: {
              type: String,
              enum: Object.values(statuses)
          }
      }
  ],
    OTP:
  	{
		  type:Number
	  },
	  otpExpired:
	  {
      type:Date,
      default:Date.now()
	  },
 	verifiedUser:
    {
      type:Boolean,
      default:false
    },
    userProducts:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
      }
    ]

  },
  { timestamps: true }
);

Object.assign(userSchema.statics,{
  statuses
});

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  autheticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  addBid: function (productId, price, res) {
    this.mybids.push({
      bidOffer: price,
      productId,
    });
    this.save()
      .then((data) => {
        if (!!data) {
          const msg = "Bidding Done";
          return res.status(200).json(msg);
        }
      })
      .catch((err) => res.status(500).json({ msg: "error in saving bid" }));
  },
};
userSchema.statics.updateStatus = function (biderId, productId, status, res) {

  this.findOneAndUpdate(
   {_id: biderId, "mybids.productId": productId },
   {
     $set: {
       "mybids.$.status": status,
     },
   },
   { new: true, useFindAndModify: false }
 )
 .exec()
 .then((data) => {
     if (!!data) {
       return res.json({ msg: "Status changed" });
     }
     return res.json({ msg: "Failed to changed status" })
   })
   .catch((err) => {
     console.log(err)
     return res.status(500).json({ msg: "Failed to changed status" });
   });
};

module.exports = mongoose.model("User", userSchema);
