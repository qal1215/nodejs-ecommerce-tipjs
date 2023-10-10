"use strict";

const ProductRepository = require("../../repositories/product.repo");

class ProductFactory {
  static productRegistry = {};

  static async createProduct(product_type, product) {
    const productClass = this.productRegistry[product_type];

    if (!productClass)
      throw new BadRequestError(
        `Product type ${product_type} is not supported`
      );

    return new productClass(product).createProduct();
  }

  //#region UPDATE - DELETE
  static async publishProductByShop({ product_shop, product_id }) {
    return await ProductRepository.publishProduct({
      product_shop,
      product_id,
    });
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await ProductRepository.unpublishProduct({
      product_shop,
      product_id,
    });
  }
  //#endregion

  //#region GET
  static async findAllDraftsForShop({ product_shop, limit = 60, offset = 0 }) {
    const query = { product_shop };
    return await ProductRepository.findAllDraftsForShop({
      query,
      limit,
      offset,
    });
  }

  static async findAllPublishedForShop({
    product_shop,
    limit = 60,
    offset = 0,
  }) {
    const query = { product_shop };
    return await ProductRepository.findAllPublishedForShop({
      query,
      limit,
      offset,
    });
  }

  static async searchPublishedProducts({ query, limit = 60, offset = 0 }) {
    return await ProductRepository.searchProducts(query);
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await ProductRepository.findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_price",
        "product_thumb",
        "product_shop",
      ],
    });
  }
  //#endregion
}

ProductFactory.productRegistry = require("./product.config");
module.exports = ProductFactory;
