import ProductRepository from "../repositories/productRepository.js";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts() {
    return await this.productRepository.getAll();
  }

  async getProductById(id) {
    return await this.productRepository.getProductByID(id);
  }

  async getProductsByPage(page, limit) {
    const products = await this.getAllProducts();
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);
    return paginatedProducts;
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
