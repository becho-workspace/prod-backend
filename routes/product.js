const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
  getAllProductsByCity,
  getAllProductsByCityAndSubCategoryName,
  bidding,
  getbids,
  getUserProducts,
  changependingstatus,
} = require("../controllers/product");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
  isUserVerified,
} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("productId", getProductById);

//all of actual routes
//create route
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  createProduct
);

// read routes
router.get("/product/:productId",isSignedIn, getProduct);
router.get("/product/photo/:productId",isSignedIn,photo);

//delete route
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteProduct
);

//update route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  updateProduct
);

//listing route
router.get("/products",isSignedIn,getAllProducts);
router.get("/products/:cityName",isSignedIn, getAllProductsByCity);
router.get(
  "/products/:cityName/:subCategoryName",
  isSignedIn,
  getAllProductsByCityAndSubCategoryName
);

router.get("/products/categories",isSignedIn,getAllUniqueCategories);

//bidding routes

//bid a product
router.patch("/product/bid/:productId/:userId",isSignedIn,isAuthenticated, bidding);

// get biddings done by user
router.get("/product/getbids/:userId",isSignedIn,isAuthenticated, getbids);

//get User's products
router.get("/product/getuserproducts/:userId",isSignedIn,isAuthenticated, getUserProducts);

router.patch(
  "/product/changestatus/:productId/:biduserId",
  isSignedIn,
  changependingstatus
);

module.exports = router;
