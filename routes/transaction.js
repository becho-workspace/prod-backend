var express = require("express");
const { transList } = require("../controllers/transaction");
var router = express.Router();
const {getProductById} = require("../controllers/product");
const { getUserById, getBidderUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");


//all of params
router.param("userId", getUserById);
router.param("productId", getProductById);
router.param("biduserId", getBidderUserById);

router.post("/addtrans/:userId/:biduserId/:productId",isSignedIn,isAuthenticated,transList);

module.exports = router;
