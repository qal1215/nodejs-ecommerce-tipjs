"use strict";

const { Types } = require("mongoose");
const { product, electronic, clothing } = require("../models/product.model");
const { get } = require("lodash");
const { getSelectData } = require("../utils");

class ProductRepository {
  static async queryProduct({
    query,
    projection = {},
    limit = 50,
    offset = 0,
    sort = { updateAt: -1 },
    select = null,
  }) {
    return await product
      .find(query, projection)
      .populate("product_shop", "name email -_id")
      .select(select)
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();
  }

  static async searchProducts(keyword) {
    const regexSearch = new RegExp(keyword);

    const query = {
      $text: { $search: regexSearch },
    };

    const projection = {
      score: { $meta: "textScore" },
    };

    const sort = { score: { $meta: "textScore" } };

    return await this.queryProduct({ query, projection, sort });
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

  static async findAllProducts({ limit, sort, page, filter, select }) {
    const offset = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const query = { ...filter };

    return await this.queryProduct({
      query,
      limit,
      offset,
      sort: sortBy,
      select: getSelectData(select),
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

  static async updateProductById({
    productId,
    dataUpdated,
    model,
    isNew = true,
  }) {
    return model.findByIdAndUpdate(productId, dataUpdated, {
      new: isNew,
    });
  }
}

module.exports = ProductRepository;
