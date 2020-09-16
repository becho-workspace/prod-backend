var express = require("express");
const { transList } = require("../controllers/transaction");
var router = express.Router();

router.post("/addTrans/:userId/:biduserId/:productId",transList);

module.exports = router;