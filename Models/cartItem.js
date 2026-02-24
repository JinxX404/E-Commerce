export default class CartItem {
  constructor(id, productId, name, price, quantity, color, size, image) {
    this.id = id;
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.color = color;
    this.size = size;
    this.image = image;
  }
}
