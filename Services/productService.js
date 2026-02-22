import ProductRepository from "../repositories/productRepository.js";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.productsCache = null;
  }

  async getAllProducts() {
    if (!this.productsCache) {
      this.productsCache = await this.productRepository.getAll();
    }
    return this.productsCache || [];
  }

  async getProductById(id) {
    return await this.productRepository.getProductByID(id);
  }

  async getProductsByPage(page, limit, category = null) {
    let products = await this.getAllProducts();
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);
    return {
      products: paginatedProducts,
      totalCount: products.length,
    };
  }

  async getCategories() {
    const products = await this.getAllProducts();
    const categories = new Set(products.map((p) => p.category));
    return Array.from(categories);
  }

  // async getProductsByCategoryName(name) {
  //   return await this.productRepository.findByCategoryName(name);
  // }
  // async getProductsByCategoryID(id) {
  //   return await this.productRepository.findByCategoryID(id);
  // }

  // async getCategories() {
  //   return await this.productRepository.getCategories();
  // }
}

export default ProductService;
