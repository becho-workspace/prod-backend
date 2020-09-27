const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
} = require("../controllers/order");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual routes
//create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
//read
router.post(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  getAllOrders
);

//Status of order
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  getOrderStatus
);
router.put(
  "order/:orderId/status/:userId",
  isSignedIn,
  updateStatus
);

module.exports = router;
