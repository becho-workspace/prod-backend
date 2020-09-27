const mongoose = require("mongoose");

const transSchema = new mongoose.Schema(
    {
        buyerId: String,
        buyerName: String,
        buyerCity: String,
        buyerAddress: String,
        buyerContact: String,
        sellerId: String,
        sellerName: String,
        sellerAddress: String,
        sellerCity: String,
        sellerContact:String,
        itemName:String,
        bidAcceptedDate: String,
        bidAmount: Number,
        payToCustomer: Number,
        commission:Number,
        productId: String
    },
    { timestamps: true }
)

module.exports = mongoose.model("Transaction", transSchema);
