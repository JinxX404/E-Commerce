import StorageService from "../infrastructure/storageService.js";

class CartRepository {
  constructor() {
    this.storageService = new StorageService();
    this.cartKey = "cart";
  }

  getCart() {
    return this.storageService.getFromLocalStorage(this.cartKey) || [];
  }

  saveCart(cart) {
    this.storageService.saveToLocalStorage(this.cartKey, cart);
  }

  clearCart() {
    this.storageService.removeFromLocalStorage(this.cartKey);
  }
}

export default CartRepository;
