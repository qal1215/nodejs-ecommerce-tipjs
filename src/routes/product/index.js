"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

/**
 * @description: Search products
 * @method: GET
 * @path: /api/v1/product/search?q=keyword
 * @access: public
 * @returns: {object} status: 200, message: All products fetched successfully, metaData: {products: []}
 * @returns: {object} status: 400, message: Bad request, metaData: null
 *
 */
router.get("/search", asyncHandler(productController.searchPublishedProducts));

// authentication
router.use(authentication);

//#region GET
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
//#endregion

//#region CREATE - UPDATE - DELETE
/**
 * @description: Create a product
 * @method: POST
 * @path: /api/v1/product
 */
router.post("/", asyncHandler(productController.createProduct));

/**
 * @description: Publish a product
 * @method: PATCH
 * @path: /api/v1/product/publish/:id
 */
router.patch(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);

/**
 * @description: Unpublish a product
 * @method: PATCH
 * @path: /api/v1/product/unpublish/:id
 */
router.patch(
  "/unpublish/:id",
  asyncHandler(productController.unpublishProductByShop)
);
//#endregion

module.exports = router;
