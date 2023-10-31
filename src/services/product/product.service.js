"use strict";

const { BadRequestError } = require("../../core/error.response");
const { product, clothing, electronic } = require("../../models/product.model");
const ProductRepository = require("../../repositories/product.repo");
const {
  removeUndefinedFields,
  updateNestedObjectParse,
} = require("../../utils");

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
  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
  }

  async updateProduct(productId, dataUpdated) {
    const isProductExist = await product.findOne({
      _id: productId,
      product_shop: this.product_shop,
    });

    if (!isProductExist) throw new BadRequestError("Product not found");

    return await ProductRepository.updateProductById({
      productId,
      dataUpdated,
      model: product,
    });
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

  async updateProduct(productId) {
    /**
     * 1. Remove attributes with null or undefined value
     *
     */
    const objectParams = removeUndefinedFields(this);

    if (objectParams.product_attributes) {
      const { product_attributes } = objectParams;

      // Update child data
      await ProductRepository.updateProductById({
        productId,
        dataUpdated: updateNestedObjectParse(product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParse(objectParams)
    );
    return updateProduct;
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

  async updateProduct(productId) {
    /**
     * 1. Remove attributes with null or undefined value
     *
     */
    console.log("[1]::", this);
    const objectParams = updateNestedObjectParse(this);
    console.log("[2]::", objectParams);

    if (objectParams.product_attributes) {
      // Update child data
      await ProductRepository.updateProductById({
        productId,
        dataUpdated: objectParams.product_attributes,
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

module.exports = { Product, Clothing, Electronic };
