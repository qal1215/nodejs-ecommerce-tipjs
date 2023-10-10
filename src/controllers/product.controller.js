"use strict";

const { SuccessResponse, OK } = require("../core/success.response");
const ProductFactory = require("../services/product/productFactory");

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

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product published successfully",
      metaData: {
        product: await ProductFactory.publishProductByShop({
          product_shop: req.user.userId,
          product_id: req.params.id,
        }),
      },
    }).send(res);
  };

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product unpublished successfully",
      metaData: {
        product: await ProductFactory.unpublishProductByShop({
          product_shop: req.user.userId,
          product_id: req.params.id,
        }),
      },
    }).send(res);
  };

  findAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "All draft products fetched successfully",
      metaData: {
        products: await ProductFactory.findAllDraftsForShop({
          product_shop: req.user.userId,
        }),
      },
    }).send(res);
  };

  findAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "All published products fetched successfully",
      metaData: {
        products: await ProductFactory.findAllPublishedForShop({
          product_shop: req.user.userId,
        }),
      },
    }).send(res);
  };

  searchPublishedProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "All published products fetched successfully",
      metaData: {
        products: await ProductFactory.searchPublishedProducts({
          query: req.query.q,
        }),
      },
    }).send(res);
  };

  getAllProductsPublic = async (req, res, next) => {
    new SuccessResponse({
      message: "All published products fetched successfully",
      metaData: {
        products: await ProductFactory.findAllProducts(req.query),
      },
    }).send(res);
  };
}

module.exports = new ProductController();
