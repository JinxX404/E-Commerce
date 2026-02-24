import AuthService from "../services/authService.js";
import ProductService from "../services/productService.js";
import CartService from "../services/cartService.js";
import NotificationService from "../services/notificationService.js";
import createProductCard from "../components/productCard.js";

class HomeController {
  constructor() {
    this.authService = new AuthService();
    this.productService = new ProductService();
    this.cartService = new CartService();
    this.notificationService = new NotificationService();
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

  async loadHomeProducts() {
    const response = await this.productService.getProductsByPage(
      this.currentPage,
      this.limit,
      this.currentCategory,
    );

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
    this.quickAdd();
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
    if (!viewProductBtns) return;
    viewProductBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const productId = btn.dataset.id;
        window.location.href = `../pages/product.html?id=${productId}`;
      });
    });
  }

  quickAdd() {
    const quickAddBtns = document.querySelectorAll(".quick-add-btn");
    if (!quickAddBtns) return;
    quickAddBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        // Prevent event from bubbling if the card itself was ever clickable
        e.stopPropagation();

        const productId = btn.dataset.id;
        try {
          // Temporarily disable the button to prevent spam
          const originalText = btn.innerHTML;
          btn.innerHTML = `<span class="material-icons-outlined text-sm animate-spin">sync</span>`;
          btn.disabled = true;

          // Fetch the full product to get accurate variants
          const product = await this.productService.getProductById(productId);

          if (
            !product ||
            !product.meta ||
            !product.meta.variants ||
            product.meta.variants.length === 0
          ) {
            this.notificationService.showToast(
              "Product variants not available",
              "error",
            );
            return;
          }

          const firstVariant = product.meta.variants[0];
          const firstSize =
            firstVariant.sizes && firstVariant.sizes.length > 0
              ? firstVariant.sizes[0].size
              : "N/A";

          // Pass individual arguments expected by CartService.addToCart
          this.cartService.addToCart(
            product.id,
            product.name,
            product.price,
            1, // quantity
            firstVariant.color,
            firstSize,
            product.image,
          );
          this.updateCartIcon();
          this.notificationService.showToast(
            `${product.name} added to cart`,
            "success",
          );
        } catch (error) {
          console.error("Quick Add error:", error);
          this.notificationService.showToast(
            "Failed to add item to cart",
            "error",
          );
        } finally {
          // Restore the button visually
          btn.innerHTML = `Add`;
          btn.disabled = false;
        }
      });
    });
  }

  setupCategories() {
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    if (!categoryRadios.length) return;

    categoryRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        // Update visual states
        categoryRadios.forEach((r) => {
          const label = r.closest("label");
          if (r.checked) {
            label.classList.add("bg-primary/10", "text-primary", "font-medium");
            label.classList.remove(
              "hover:bg-gray-100",
              "dark:hover:bg-gray-800",
              "text-gray-600",
              "dark:text-gray-400",
            );
          } else {
            label.classList.remove(
              "bg-primary/10",
              "text-primary",
              "font-medium",
            );
            label.classList.add(
              "hover:bg-gray-100",
              "dark:hover:bg-gray-800",
              "text-gray-600",
              "dark:text-gray-400",
            );
          }
        });

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

  updateCartIcon() {
    const cartIconCount = document.getElementById("cart-icon-count");
    if (cartIconCount) {
      cartIconCount.textContent = this.cartService.getCartItemCount();
    }
  }

  async init() {
    this.notificationService.showLoader("Loading store...");
    try {
      this.userWelcome();
      this.logout();
      this.updateCartIcon();
      this.setupPagination();
      await this.loadCategories();
      await this.loadHomeProducts();
      this.viewProduct();
      this.quickAdd();
    } catch (error) {
      console.error("Home initialization error:", error);
      this.notificationService.showToast("Failed to load store data", "error");
    } finally {
      this.notificationService.hideLoader();
    }
  }
}

const homeController = new HomeController();
homeController.init();
