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
}

ProductFactory.productRegistry = require("./product.config");

module.exports = ProductFactory;
