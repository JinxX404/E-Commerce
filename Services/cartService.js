import CartRepository from "../repositories/cartRepository.js";
import CartItem from "../models/cartItem.js";

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  getCartItems() {
    return this.cartRepository.getCart();
  }

  getCartItemCount() {
    const items = this.getCartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(productId, name, price, quantity, color, size, image) {
    const cart = this.getCartItems();
    // Create a unique ID for the cart item based on product ID, color, and size
    const cartItemId = `${productId}-${color}-${size}`;

    const existingItemIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingItemIndex > -1) {
      // If item with same features exists, increment quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem = new CartItem(
        cartItemId,
        productId,
        name,
        price,
        quantity,
        color,
        size,
        image,
      );
      cart.push(newItem);
    }

    this.cartRepository.saveCart(cart);
  }

  updateQuantity(cartItemId, newQuantity) {
    const cart = this.getCartItems();
    const itemIndex = cart.findIndex((item) => item.id === cartItemId);

    if (itemIndex > -1) {
      if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = newQuantity;
      }
      this.cartRepository.saveCart(cart);
    }
  }

  removeFromCart(cartItemId) {
    const cart = this.getCartItems();
    const updatedCart = cart.filter((item) => item.id !== cartItemId);
    this.cartRepository.saveCart(updatedCart);
  }

  clearCart() {
    this.cartRepository.clearCart();
  }

  getCartTotal() {
    const items = this.getCartItems();
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const total = subtotal;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: 0,
      tax: 0,
      total: parseFloat(total.toFixed(2)),
    };
  }
}

export default CartService;
