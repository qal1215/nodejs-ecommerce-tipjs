"use strict";

const { BadRequestError } = require("../../core/error.response");
const { product, clothing, electronic } = require("../../models/product.model");

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_variations,
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
    this.product_variations = product_variations;
  }

  // create product
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// define the subclass for clothing, electronics,...
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing)
      throw new BadRequestError("Clothing could not be created");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Product could not be created");

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Electronic could not be created");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Product could not be created");

    return newProduct;
  }
}

module.exports = { Product, Clothing, Electronic };
