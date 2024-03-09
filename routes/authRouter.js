"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

const { body, getErrorMessage } = require("../controllers/validator.js");
const passport = require("passport");

router.get("/login", controller.showLogin);
router.post(
  "/login",
  body("email").trim().notEmpty().withMessage("Account is required!"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("signin", { loginMessage: message });
    }
    next();
  },
  controller.login
);

router.get("/register", controller.showSignup);

router.post(
  "/register",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Yêu cầu nhập email!")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  body("password").trim().notEmpty().withMessage("Yêu cầu nhập mật khẩu"),
  body("password")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    .withMessage(
      "Mật khẩu phải gồm ít nhất 1 chữ cái thường, 1 in hoa, 1 chữ số, 1 kí tự đặc biệc và 8 kí tự."
    ),
  body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword != req.body.password) {
      throw new Error("Mật khẩu nhập lại không khớp");
    }
    return true;
  }),
  body("name").trim().notEmpty().withMessage("Your name is required!"),

  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("signup", { registerMessage: message });
    }
    next();
  },
  controller.signup
);

router.get('/facebook-login', controller.assertUnauth, controller.facebookLogin)

router.get("/logout", controller.logout);

module.exports = router;
