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
}

export default ProductRepository;
