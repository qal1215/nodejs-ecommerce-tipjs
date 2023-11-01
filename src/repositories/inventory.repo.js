"use struct";

const inventory = require("../models/inventory.model");

class InventoryRepository {
  static async insertInventory({
    productId,
    shopId,
    location = "unknown",
    stock,
  }) {
    return await inventory.create({
      inventory_productId: productId,
      inventory_shopId: shopId,
      inventory_location: location,
      inventory_stock: stock,
    });
  }
}

module.exports = InventoryRepository;
