const mongoose = require("mongoose");

const transSchema = new mongoose.Schema(
    {
        sellerId: String,
        buyerId: String,
        priceAccepted: String,
        productId: String
    },
    { timestamps: true }
)

module.exports = mongoose.model("Transaction", transSchema);
