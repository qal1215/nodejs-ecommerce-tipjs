"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully",
      metaData: {
        product: await ProductFactory.createProduct(req.body.product_type, {
          ...req.body,
          product_shop: req.user.userId,
        }),
      },
    }).send(res);
  };
}

module.exports = new ProductController();
