"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

// authentication
router.use(authentication);

// logout
router.post("/", asyncHandler(productController.createProduct));
router.patch(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);

/**
 * @description: Get all draft products for shop
 * @method: GET
 * @path: /api/v1/product/drafts
 * @access: private
 * @returns: {object} status: 200, message: All draft products fetched successfully, metaData: {products: []}
 * @returns: {object} status: 400, message: Bad request, metaData: null
 */
router.get("/drafts", asyncHandler(productController.findAllDraftsForShop));

router.get(
  "/published",
  asyncHandler(productController.findAllPublishedForShop)
);

module.exports = router;
