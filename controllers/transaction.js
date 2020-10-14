const Transaction = require("../models/transaction")

exports.transList = (req, res) => {
    const b=req.product.verifyThatBidIsAlreadyAccpeted(req.product.bid)
    if(b) return res.status(400).json({error:"Product bid is already accpeted"})
    const trans = Transaction({
        buyerId: req.params.biduserId,
        buyerName: req.bidprofile.name,
        buyerCity: req.bidprofile.city,
        buyerAddress: req.bidprofile.address,
        buyerContact: req.bidprofile.contact,
        sellerId: req.params.userId,
        sellerName: req.profile.name,
        sellerAddress: req.product.address,
        sellerCity: req.product.city,
        sellerContact: req.profile.contact,
        itemName: req.product.name,
        bidAcceptedDate: req.body.date,
        bidAmount: req.body.bidAmount,
        payToCustomer: req.body.payToCustomer,
        commission: req.body.commission,
        productId: req.params.productId
    });
    trans.save().then(() => {
        console.log("Transaction Succesfull")
        return res.status(200).json({ msg: "Succesfull" });
    })
        .catch((err) => {
            res.status(403).json({ error: "Not able to save current transction" })
        })
}

