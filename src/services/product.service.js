"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
} = require("../models/products/product.model");

class ProductFactory {
  static async createProduct(product, product_type) {
    switch (product_type) {
      case "Clothing":
        return await new Clothing(product).createProduct();
      case "Electronic":
        return await new Electronic(product).createProduct();
      default:
        throw new BadRequestError("Product type is not supported");
    }
  }
}

// define base product type

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create product
  async createProduct() {
    return await product.create(this);
  }
}

// define the subclass for clothing, electronics,...
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing)
      throw new BadRequestError("Clothing could not be created");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Product could not be created");

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Electronic could not be created");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Product could not be created");

    return newProduct;
  }
}

module.exports = ProductFactory;
