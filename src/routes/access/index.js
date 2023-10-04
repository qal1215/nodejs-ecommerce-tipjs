"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//signup
router.post("/shop/signup", asyncHandler(accessController.signUp));

//login
router.post("/shop/login", asyncHandler(accessController.logIn));

// authentication
router.use(authentication);

// logout
router.post("/shop/logout", asyncHandler(accessController.logOut));
router.post("/shop/refresh-token", asyncHandler(accessController.refreshToken));

module.exports = router;
