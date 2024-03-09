"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/usersController");
const authController = require("../controllers/authController");
const { body, getErrorMessage } = require("../controllers/validator");

router.use(authController.isLoggedIn);
router.get("/profile", controller.showProfile);
router.post("/update-info", controller.updateInfo);

module.exports = router;
