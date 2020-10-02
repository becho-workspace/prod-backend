const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const statuses = Object.freeze({
  0: "Rejected",
  1: "Accepted",
  2: "Pending",
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategoryName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      path: {
        type: String,
      },
    },
    userId: {
      type: String,
      required: true,
      default: "Not assigned yet",
    },
    bid: [
      {
        askedprice: Number,
        offeredprice: Number,
        userBidding: String,
        name: String,
        status: {
          type: String,
          enum: Object.values(statuses),
        },
      },
    ],
    address: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ans1: {
      type: String,
    },
    ans2: {
      type: String,
    },
    ans3: {
      type: String,
    },
    ans4: {
      type: String,
    },
    ans5: {
      type: String,
    },
    ans6: {
      type: String,
    },
    ans7: {
      type: String,
    },
    ans8: {
      type: String,
    ans10: {
    },
    ans11: {
      type: String,
    },
  },
  { timestamps: true }
);

Object.assign(productSchema.statics, {
  statuses,
});

productSchema.methods = {
  assureBid: function (userId) {
    if (this.userId == userId) {
      return true;
    }
    return false;
  },
  verifyThatBidIsAlreadyAccpeted: function(bid)
  {
     for (const b of bid) {
       if(b.status=="Accepted")
       {
         return true
       }
     }
     
  }
};

module.exports = mongoose.model("Product", productSchema);
