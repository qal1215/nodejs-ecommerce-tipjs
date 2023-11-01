"use strict";
const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    inventory_productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    inventory_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    inventory_location: {
      type: String,
      default: "unknown",
    },
    inventory_stock: {
      type: Number,
      required: true,
      default: 0,
    },
    inventory_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
