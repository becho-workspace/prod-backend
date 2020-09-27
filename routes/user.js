const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
  getOTP,
  numberVerify,
  addBidDetailsToUser
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

const { getProductById } = require("../controllers/product")
router.param("userId", getUserById);
router.param("productId", getProductById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);


router.get("/verify/:userId",isSignedIn,isAuthenticated,getOTP)
router.post("/verify/:userId",isSignedIn,isAuthenticated,numberVerify);

router.patch("/user/bid/:productId/:userId",isSignedIn,isAuthenticated, addBidDetailsToUser);
module.exports = router;
