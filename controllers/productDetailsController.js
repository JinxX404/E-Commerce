import AuthService from "../services/authService.js";
import ProductService from "../services/productService.js";
import CartService from "../services/cartService.js";
import NotificationService from "../services/notificationService.js";
import createProductDetails from "../components/productDetails.js";

class ProductDetailsController {
  constructor() {
    this.authService = new AuthService();
    this.productService = new ProductService();
    this.cartService = new CartService();
    this.notificationService = new NotificationService();
  }

  userWelcome() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      window.location.href = "../pages/login.html";
      return;
    }

    const userAvatar = document.getElementById("user-avatar");
    if (userAvatar) {
      userAvatar.textContent = user.name.charAt(0).toUpperCase();
    }

    const userMenuBtn = document.getElementById("user-menu-btn");
    const userDropdown = document.getElementById("user-dropdown");
    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("hidden");
      });
      document.addEventListener("click", (e) => {
        if (
          !userMenuBtn.contains(e.target) &&
          !userDropdown.contains(e.target)
        ) {
          userDropdown.classList.add("hidden");
        }
      });
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
    this.setupQuantityListeners();
    this.setupAddToCartListener(product);
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

        sizeContainer.innerHTML = (variant.sizes || [])
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
        const firstAvailable = (variant.sizes || []).find((s) => s.stock > 0);
        if (firstAvailable) {
          stockDisplay.textContent = `In Stock (${firstAvailable.stock} available)`;
        } else {
          stockDisplay.textContent = "Out of Stock";
        }
      });
    });

    this.setupSizeListeners(stockDisplay);

    // Set initial stock display based on first size of first variant
    if (product.meta?.variants?.[0]?.sizes?.[0]) {
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

  setupQuantityListeners() {
    const minQty = 1;
    const qtyInput = document.getElementById("qty-input");
    const decreaseBtn = document.getElementById("qty-decrease");
    const increaseBtn = document.getElementById("qty-increase");

    if (!qtyInput || !decreaseBtn || !increaseBtn) return;

    decreaseBtn.addEventListener("click", () => {
      let currentQty = parseInt(qtyInput.value) || 1;
      if (currentQty > minQty) {
        qtyInput.value = currentQty - 1;
      }
    });

    increaseBtn.addEventListener("click", () => {
      let currentQty = parseInt(qtyInput.value) || 1;
      // We could add a check against max stock here if we want
      qtyInput.value = currentQty + 1;
    });
  }

  setupAddToCartListener(product) {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const qtyInput = document.getElementById("qty-input");
    if (!addToCartBtn || !qtyInput) return;

    addToCartBtn.addEventListener("click", () => {
      const quantity = parseInt(qtyInput.value) || 1;
      let color = "Default";
      let size = "Default";

      // Determine selected color
      const activeColorBtn = document.querySelector(".color-btn.ring-primary");
      if (activeColorBtn) {
        color = activeColorBtn.textContent.trim();
      } else if (product.meta?.variants && product.meta.variants.length > 0) {
        color = product.meta.variants[0].color;
      }

      // Determine selected size
      const activeSizeBtn = document.querySelector(".size-btn.ring-primary");
      if (activeSizeBtn) {
        size = activeSizeBtn.querySelector("span").textContent.trim();
      } else if (product.meta?.variants?.[0]?.sizes?.[0]) {
        size = product.meta.variants[0].sizes[0].size;
      }

      this.cartService.addToCart(
        product.id,
        product.name,
        product.price,
        quantity,
        color,
        size,
        product.image,
      );

      // Optional: Show some feedback to user
      const originalText = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML =
        '<span class="material-icons-outlined mr-2">check</span> Added!';
      addToCartBtn.classList.remove("bg-primary", "hover:bg-indigo-700");
      addToCartBtn.classList.add("bg-green-600", "hover:bg-green-700");

      setTimeout(() => {
        addToCartBtn.innerHTML = originalText;
        addToCartBtn.classList.add("bg-primary", "hover:bg-indigo-700");
        addToCartBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      }, 2000);

      // Update cart icon counter if there's one on the page
      this.updateCartIcon();
    });
  }

  updateCartIcon() {
    const cartIconCount = document.getElementById("cart-icon-count");
    if (cartIconCount) {
      cartIconCount.textContent = this.cartService.getCartItemCount();
    }
  }

  async init() {
    this.notificationService.showLoader("Loading product details...");
    try {
      this.userWelcome();
      this.logout();
      this.updateCartIcon();
      const product = await this.getProductById();
      this.renderProduct(product);
    } catch (error) {
      console.error("Product loading error:", error);
      this.notificationService.showToast(
        "Failed to load product details",
        "error",
      );
    } finally {
      this.notificationService.hideLoader();
    }
  }
}

const productDetailsController = new ProductDetailsController();
productDetailsController.init();
