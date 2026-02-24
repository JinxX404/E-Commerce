import ApiClient from "./apiclient.js";

class FakeStoreAPI {
  constructor() {
    this.apiClient = new ApiClient();
    this.productsBaseURL = "https://developerapis.vercel.app/api/products";
    // this.productsBaseURL = "https://api.escuelajs.co/api/v1/products";
    // this.categoriesBaseURL = "https://api.escuelajs.co/api/v1/categories";
  }

  async getAllProducts() {
    return await this.apiClient.get(this.productsBaseURL);
  }

  async getProductById(id) {
    return await this.apiClient.get(this.productsBaseURL + "/" + id);
  }
}

export default FakeStoreAPI;
