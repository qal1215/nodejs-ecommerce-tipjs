"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully",
      metaData: {
        product: await ProductFactory.createProduct(
          req.body,
          req.body.product_type
        ),
      },
    }).send(res);
  };
}

module.exports = new ProductController();
