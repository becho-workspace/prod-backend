const Transaction = require("../models/transaction")


exports.transList = (req, res) => {
    const trans = Transaction({
        sellerId: req.params.userId,
        buyerId: req.params.biduserId,
        priceAccepted: req.body.price,
        productId: req.params.productId
    });
    trans.save().then(() => {
        console.log("Transaction Succesfull")
        return res.status(200).json({ msg: "Succesfull" });
    })
        .catch((err) => {
            res.status(403).json({ msg: err })
        })
}

