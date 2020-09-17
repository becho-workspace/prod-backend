const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const statuses = Object.freeze({
  0: 'rejected',
  1: 'accepted',
  2: 'pending'
})

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      lowercase:true
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true
    },
    category: {
      type: ObjectId,
      ref:"Category",
      required:true
    },
    subCategoryName: {
      type: String,
      required: true,
      lowercase:true,
      trim:true
    },
    stock: {
      type: Number
    },
    sold: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    userId: {
      type: String,
      required: true,
      default: "Not assigned yet"
    },
    bid: [
      {
        price: Number,
        userBidding: String,
        status: {
          type: String,
          lowercase:true,
          enum: Object.values(statuses)
        }
      }
    ],
    address: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      required: true,
      lowercase:true,
      trim:true
    },
    ans1: {
      type: String,
      default: "Null"
    },
    ans2: {
      type: String,
      default: "Null"
    },
    ans3: {
      type: String,
      default: "Null"
    },
    ans4: {
      type: String,
      default: "Null"
    },
    ans5: {
      type: String,
      default: "Null"
    },
    ans6: {
      type: String,
      default: "Null"
    },
    ans7: {
      type: String,
      default: "Null"
    },
    ans8: {
      type: String,
      default: "Null"
    },
    ans9: {
      type: String,
      default: "Null"
    },
    ans10: {
      type: String,
      default: "Null"
    },
    ans11: {
      type: String,
      default: "Null"
    }
  },
  { timestamps: true }
);

Object.assign(productSchema.statics, {
  statuses
});

productSchema.methods={
  assureBid:function(userId){
    if(this.userId==userId)
    {
      return true;
    }
    return false
}
}


module.exports = mongoose.model("Product", productSchema);
