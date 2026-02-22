import AuthService from "../services/authService.js";
import ProductService from "../services/productService.js";
import createProductDetails from "../components/productDetails.js";

class ProductDetailsController {
  constructor() {
    this.authService = new AuthService();
    this.productService = new ProductService();
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

  getProductIDFromParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  async getProductById() {
    const id = this.getProductIDFromParams();
    if (!id) return null;
    return await this.productService.getProductById(id);
  }

  renderProduct(product) {
    const productContainer = document.querySelector(".product-container");
    if (!productContainer) return;

    if (!product) {
      productContainer.innerHTML = `<div class="text-center py-20"><h2 class="text-3xl font-bold text-gray-500">Product not found.</h2><a href="home.html" class="text-primary hover:underline mt-4 inline-block">Return to Home</a></div>`;
      return;
    }

    createProductDetails(product);
    this.setupVariantListeners(product);
  }

  setupVariantListeners(product) {
    const colorBtns = document.querySelectorAll(".color-btn");
    const sizeContainer = document.querySelector(".size-container");
    const stockDisplay = document.getElementById("stock-display");

    if (!colorBtns.length || !sizeContainer || !stockDisplay) return;

    colorBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update active color button
        colorBtns.forEach((b) => {
          b.classList.remove(
            "ring-2",
            "ring-primary",
            "border-primary",
            "text-primary",
          );
        });
        btn.classList.add(
          "ring-2",
          "ring-primary",
          "border-primary",
          "text-primary",
        );

        // Re-render sizes for the selected variant
        const variantIndex = btn.dataset.index;
        const variant = product.meta.variants[variantIndex];

        sizeContainer.innerHTML = variant.sizes
          .map(
            (size, idx) => `
          <button class="size-btn flex flex-col items-center justify-center min-w-[3.5rem] px-3 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-all bg-surface-light dark:bg-surface-dark ${idx === 0 && size.stock > 0 ? "ring-2 ring-primary border-primary text-primary" : ""}" data-stock="${size.stock}" data-sku="${size.sku}" ${size.stock === 0 ? 'disabled title="Out of stock"' : ""}>
            <span>${size.size}</span>
          </button>
        `,
          )
          .join("");

        this.setupSizeListeners(stockDisplay);

        // Update stock display for first available size
        const firstAvailable = variant.sizes.find((s) => s.stock > 0);
        if (firstAvailable) {
          stockDisplay.textContent = `In Stock (${firstAvailable.stock} available)`;
        } else {
          stockDisplay.textContent = "Out of Stock";
        }
      });
    });

    this.setupSizeListeners(stockDisplay);

    // Set initial stock display based on first size of first variant
    if (product.meta.variants[0]?.sizes[0]) {
      const initialStock = product.meta.variants[0].sizes[0].stock;
      stockDisplay.textContent =
        initialStock > 0
          ? `In Stock (${initialStock} available)`
          : "Out of Stock";
    }
  }

  setupSizeListeners(stockDisplay) {
    const sizeBtns = document.querySelectorAll(".size-btn");
    sizeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;

        sizeBtns.forEach((b) => {
          b.classList.remove(
            "ring-2",
            "ring-primary",
            "border-primary",
            "text-primary",
          );
        });
        btn.classList.add(
          "ring-2",
          "ring-primary",
          "border-primary",
          "text-primary",
        );

        const stock = btn.dataset.stock;
        stockDisplay.textContent =
          stock > 0 ? `In Stock (${stock} available)` : "Out of Stock";
      });
    });
  }

  async init() {
    this.userWelcome();
    this.logout();
    const product = await this.getProductById();
    this.renderProduct(product);
  }
}

const productDetailsController = new ProductDetailsController();
productDetailsController.init();
