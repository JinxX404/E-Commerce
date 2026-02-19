import AuthService from "../services/authService.js";
import ProductService from "../services/productService.js";
import createProductCard from "../components/productCard.js";

class HomeController {
  constructor() {
    this.authService = new AuthService();
    this.productService = new ProductService();
  }

  userWelcome() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      window.location.href = "../pages/login.html";
    }
    const userWelcome = document.getElementById("user-welcome");
    userWelcome.textContent = `Welcome, ${user.name}`;
  }

  logout() {
    const logout = document.getElementById("logout");
    logout.addEventListener("click", () => {
      this.authService.SignOut();
      window.location.href = "../pages/login.html";
    });
  }

  async loadHomeProducts() {
    const products = await this.productService.getProductsByPage(1, 10);

    products.forEach((element) => {
      const productCard = createProductCard(element);
      document.querySelector(".products").appendChild(productCard);
    });
    console.log(products);
  }

  async init() {
    this.userWelcome();
    this.logout();
    this.loadHomeProducts();
  }
}

const homeController = new HomeController();
homeController.init();
