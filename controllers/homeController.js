import AuthService from "../services/authService.js";
import ProductService from "../services/productService.js";
import createProductCard from "../components/productCard.js";

class HomeController {
  constructor() {
    this.authService = new AuthService();
    this.productService = new ProductService();
    this.currentPage = 1;
    this.limit = 6;
    this.currentCategory = null;
  }

  userWelcome() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      window.location.href = "../pages/login.html";
      return;
    }
    const userWelcome = document.getElementById("user-welcome");
    if (userWelcome) {
      userWelcome.textContent = `Welcome, ${user.name}`;
    }
  }

  logout() {
    const logout = document.getElementById("logout");
    if (logout) {
      logout.addEventListener("click", () => {
        this.authService.signOut();
        window.location.href = "../pages/login.html";
      });
    }
  }

  async loadHomeProducts() {
    const response = await this.productService.getProductsByPage(
      this.currentPage,
      this.limit,
      this.currentCategory,
    );

    // Fallback in case ProductService returns the old array format instead of {products, totalCount}
    const products = response.products || response;
    const totalCount = response.totalCount || products.length;

    const productsContainer = document.querySelector(".products");

    if (!productsContainer) return;
    productsContainer.innerHTML = "";

    products.forEach((element) => {
      const productCard = createProductCard(element);
      productsContainer.appendChild(productCard);
    });

    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    const pageDisplay = document.getElementById("current-page");

    if (prevBtn) prevBtn.disabled = this.currentPage === 1;
    if (nextBtn) nextBtn.disabled = this.currentPage * this.limit >= totalCount;
    if (pageDisplay) pageDisplay.textContent = this.currentPage;

    // Attach listener to newly rendered product cards
    this.viewProduct();
  }

  setupPagination() {
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.loadHomeProducts();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.currentPage++;
        this.loadHomeProducts();
      });
    }
  }

  viewProduct() {
    const viewProductBtns = document.querySelectorAll(".view-product-btn");
    console.log(viewProductBtns);
    if (!viewProductBtns) return;
    viewProductBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const productId = btn.dataset.id;
        window.location.href = `../pages/product.html?id=${productId}`;
      });
    });
  }

  setupCategories() {
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    if (!categoryRadios.length) return;

    categoryRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const val = e.target.value;
        this.currentCategory = val === "all" ? null : val;
        this.currentPage = 1;
        this.loadHomeProducts();
      });
    });
  }

  async loadCategories() {
    const categoriesContainer = document.getElementById("categories-container");
    if (!categoriesContainer) return;

    const categories = await this.productService.getCategories();

    // The 'All Products' option is already in the HTML.
    // We just append the dynamic ones.
    const categoriesHTML = categories
      .map(
        (category) => `
      <label class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
        <input class="sr-only" name="category" type="radio" value="${category}" />
        <span class="material-icons-outlined mr-3 text-lg">category</span>
        ${category}
      </label>
    `,
      )
      .join("");

    categoriesContainer.insertAdjacentHTML("beforeend", categoriesHTML);
    this.setupCategories();
  }

  async init() {
    this.userWelcome();
    this.logout();
    this.setupPagination();
    await this.loadCategories();
    await this.loadHomeProducts();
    this.viewProduct();
  }
}

const homeController = new HomeController();
homeController.init();
