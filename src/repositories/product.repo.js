"use strict";

const { Types } = require("mongoose");
const {
  product,
  electronic,
  clothing,
} = require("../models/products/product.model");

class ProductRepository {
  static async queryProduct({
    query,
    limit = 50,
    offset = 0,
    sort = { updateAt: -1 },
    select = null,
  }) {
    return await product
      .find(query)
      .populate("product_shop", "name email -_id")
      .select(select)
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();
  }

  static async findAllDraftsForShop({ query, limit, offset }) {
    return await this.queryProduct({
      query: { ...query, isDaft: true },
      limit,
      offset,
    });
  }

  static async findAllPublishedForShop({ query, limit, offset }) {
    return await this.queryProduct({
      query: { ...query, isPublished: true },
      limit,
      offset,
    });
  }

  static async publishProduct({ product_shop, product_id }) {
    return await product
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(product_id),
          product_shop: new Types.ObjectId(product_shop),
        },
        { isDaft: false, isPublished: true },
        { new: false, upsert: true }
      )
      .populate("product_shop", "name email -_id")
      .lean()
      .exec();
  }

  static async unpublishProduct({ product_shop, product_id }) {
    return await product
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(product_id),
          product_shop: new Types.ObjectId(product_shop),
        },
        { isDaft: true, isPublished: false },
        { new: false, upsert: true }
      )
      .populate("product_shop", "name email -_id")
      .lean()
      .exec();
  }
}

module.exports = ProductRepository;
