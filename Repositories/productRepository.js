import FakeStoreAPI from "../infrastructure/fakeStoreAPI.js";

class ProductRepository {
  constructor() {
    this.fakeStoreApi = new FakeStoreAPI();
  }
  async getAll() {
    return await this.fakeStoreApi.getAllProducts();
  }

  async getProductByID(id) {
    return await this.fakeStoreApi.getProductById(id);
  }

  // async getCategories() {
  //   return await this.fakeStoreApi.getCategories();
  // }

  // async findByCategoryName(name) {
  //   return await this.fakeStoreApi.getProductsByCategoryName(name);
  // }
  // async findByCategoryID(id) {
  //   return await this.fakeStoreApi.getProductsByCategoryID(id);
  // }
}

export default ProductRepository;
