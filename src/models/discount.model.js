"use strict";
const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_code: {
      type: String,
      required: true,
    },
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      default: "percentage",
      enum: ["percentage", "fixed"],
    },
    discount_value: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_startDate: {
      type: Date,
      required: true,
    },
    discount_endDate: {
      type: Date,
      required: true,
    },
    discount_max_usage: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_current_usage: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_max_usage_per_user: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },

    discount_is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      default: "all",
      enum: ["all", "products", "categories"],
    },
    discount_applies_to_products: {
      type: Array,
      default: [],
    },
    discount_applies_to_categories: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
