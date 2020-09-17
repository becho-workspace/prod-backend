var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "name should be at least 3 char")
      .trim()
      .not().isEmpty()
      .isLength({ min: 3 }),
    check("email", "email is required")
      .trim()
      .not().isEmpty()
      .normalizeEmail()
      .isEmail(),
    check("password", "password should be at least 3 char")
    .trim()
    .not().isEmpty()
    .isLength({min: 3}),
    check("contact")
    .trim()
    .not().isEmpty()
    .isNumeric().withMessage("it should contains only numeric character")
    .isLength({min:10 , max:10}),
    check("city")
    .trim()
    .not().isEmpty()

  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", isSignedIn, signout);

module.exports = router;
