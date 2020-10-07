const express = require("express");
const router = express.Router();
const upload = require("../util/upload_config");
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
  countProducts,
  checkStatus,
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
  upload.single("photo"),
  isSignedIn,
  isAuthenticated,
  createProduct
);

// get total product number
router.get("/products/count", countProducts);

// read routes
router.get("/product", isSignedIn, getProduct);
router.get("/product/photo/:productId", isSignedIn, photo);

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
router.get("/products", getAllProducts);
router.get("/products/:cityName", getAllProductsByCity);
router.get(
  "/products/:cityName/:subCategoryName",
  isSignedIn,
  getAllProductsByCityAndSubCategoryName
);

router.get("/products/categories", isSignedIn, getAllUniqueCategories);

router.get(
  "/product/stopmbid/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  noMultipleBidding,
);


//bidding routes

//bid a product
router.patch(
  "/product/bid/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  bidding
);

// get biddings done by user
router.get("/product/getbids/:userId", isSignedIn, isAuthenticated, getbids);

//get User's products
router.get(
  "/product/getuserproducts/:userId",
  isSignedIn,
  isAuthenticated,
  getUserProducts
);

router.patch(
  "/product/changestatus/:productId/:biduserId",
  isSignedIn,
  changependingstatus
);

router.get("/product/checkstatus/:biduserId/:productId", checkStatus);

module.exports = router;
