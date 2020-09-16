const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory,
  removeSubCategory,
  getSubCategory,
  getSubCategoryById
} = require("../controllers/category");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);
router.param("subCategoryId", getSubCategoryById);

//actual routers goes here

//create
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//read
router.get("/category/:categoryId",isSignedIn, getCategory);
router.get("/categories",isSignedIn, getAllCategory);
router.get("/subcategory/:subCategoryId",isSignedIn,getSubCategory);

//update
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//delete

router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

router.delete(
  "/subcategory/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeSubCategory
);

module.exports = router;
