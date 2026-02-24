import CartService from "../services/cartService.js";
import AuthService from "../services/authService.js";
import NotificationService from "../services/notificationService.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
    this.authService = new AuthService();
    this.notificationService = new NotificationService();
    this.cartListContainer = document.getElementById("cart-items-container");
    this.cartHeaderCount = document.getElementById("cart-header-count");
    this.cartIconCount = document.getElementById("cart-icon-count");

    this.subtotalEl = document.getElementById("summary-subtotal");
    this.totalEl = document.getElementById("summary-total");
    this.includesEl = document.getElementById("summary-includes");
    this.checkoutBtn = document.getElementById("checkout-btn");
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
      logout.addEventListener("click", (e) => {
        e.preventDefault();
        this.authService.signOut();
        window.location.href = "../pages/login.html";
      });
    }
  }

  renderCart() {
    const items = this.cartService.getCartItems();
    this.updateHeaderAndIconCounters();

    // If we're not on the cart page, don't try to render the cart list
    if (!this.cartListContainer) return;

    this.updateOrderSummary();

    if (items.length === 0) {
      this.cartListContainer.innerHTML = `
        <li class="flex py-10 justify-center">
            <div class="text-center">
                <span class="material-icons text-6xl text-gray-300">shopping_cart</span>
                <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Your cart is empty</h3>
                <p class="mt-2 text-sm text-gray-500">Looks like you haven't added anything to your cart yet.</p>
                <a href="../pages/home.html" class="mt-6 inline-flex p-3 w-full justify-center bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">Start Shopping</a>
            </div>
        </li>
      `;
      if (this.checkoutBtn) {
        this.checkoutBtn.disabled = true;
        this.checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
      return;
    }

    if (this.checkoutBtn) {
      this.checkoutBtn.disabled = false;
      this.checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }

    const baseUrl = "https://developerapis.vercel.app/";

    this.cartListContainer.innerHTML = items
      .map(
        (item) => `
      <li class="flex py-6 px-6 sm:py-8 border-b border-border-light dark:border-border-dark last:border-0">
        <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border-light dark:border-border-dark flex items-center justify-center p-2 bg-white">
          <img src="${item.image ? baseUrl + item.image : ""}" alt="${item.name}" class="h-full w-full object-contain object-center" />
        </div>
        <div class="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div>
              <div class="flex justify-between">
                <h3 class="text-sm">
                  <a class="font-medium text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors" href="product.html?id=${item.productId}">${item.name}</a>
                </h3>
              </div>
              <p class="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">${item.color !== "Default" ? item.color : ""} ${item.size !== "Default" ? " | " + item.size : ""}</p>
              <p class="mt-1 text-sm font-medium text-text-main-light dark:text-text-main-dark">$${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div class="mt-4 sm:mt-0 sm:pr-9">
              <label class="sr-only" for="quantity-${item.id}">Quantity</label>
              <div class="flex items-center border border-border-light dark:border-border-dark rounded-md w-max">
                <button data-id="${item.id}" class="qty-btn decrease p-2 text-text-sub-light dark:text-text-sub-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md transition-colors" type="button">
                  <span class="material-icons text-sm">remove</span>
                </button>
                <span class="px-4 text-text-main-light dark:text-text-main-dark font-medium">${item.quantity}</span>
                <button data-id="${item.id}" class="qty-btn increase p-2 text-text-sub-light dark:text-text-sub-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md transition-colors" type="button">
                  <span class="material-icons text-sm">add</span>
                </button>
              </div>
              <div class="absolute top-0 right-0">
                <button data-id="${item.id}" class="remove-btn -m-2 inline-flex p-2 text-gray-400 hover:text-red-500 transition-colors" type="button">
                  <span class="sr-only">Remove</span>
                  <span class="material-icons text-xl">close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    `,
      )
      .join("");

    this.attachEventListeners();
  }

  attachEventListeners() {
    const decreaseBtns = document.querySelectorAll(".qty-btn.decrease");
    const increaseBtns = document.querySelectorAll(".qty-btn.increase");
    const removeBtns = document.querySelectorAll(".remove-btn");

    decreaseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.cartService.getCartItems().find((i) => i.id === id);
        if (item) {
          this.cartService.updateQuantity(id, item.quantity - 1);
          this.renderCart();
        }
      });
    });

    increaseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.cartService.getCartItems().find((i) => i.id === id);
        if (item) {
          this.cartService.updateQuantity(id, item.quantity + 1);
          this.renderCart();
        }
      });
    });

    removeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        this.cartService.removeFromCart(id);
        this.renderCart();
      });
    });
  }

  updateHeaderAndIconCounters() {
    const count = this.cartService.getCartItemCount();

    if (this.cartHeaderCount) {
      this.cartHeaderCount.textContent = `You have ${count} item${count !== 1 ? "s" : ""} in your cart ready for checkout.`;
    }
    if (this.cartIconCount) {
      this.cartIconCount.textContent = count;
    }
  }

  updateOrderSummary() {
    const totals = this.cartService.getCartTotal();

    if (this.subtotalEl)
      this.subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (this.totalEl) this.totalEl.textContent = `$${totals.total.toFixed(2)}`;

    if (this.includesEl) {
      this.includesEl.textContent = `Includes $${totals.subtotal.toFixed(2)} item total`;
    }
  }

  setupCheckout() {
    if (!this.checkoutBtn) return;
    this.checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const items = this.cartService.getCartItems();
      if (items.length > 0) {
        this.notificationService.showLoader("Processing Order...");
        setTimeout(() => {
          const totalAmount = this.cartService.getCartTotal().total;
          sessionStorage.setItem("lastOrderTotal", totalAmount.toFixed(2));
          this.cartService.clearCart();
          window.location.href = "../pages/confirmation.html";
        }, 800);
      } else {
        this.notificationService.showToast("Your cart is empty", "warning");
      }
    });
  }

  init() {
    this.notificationService.showLoader("Loading cart...");
    try {
      this.userWelcome();
      this.logout();
      this.renderCart();
      this.setupCheckout();
    } catch (error) {
      console.error(error);
      this.notificationService.showToast("Failed to load cart data", "error");
    } finally {
      this.notificationService.hideLoader();
    }
  }
}

const cartController = new CartController();
cartController.init();
export default cartController;
