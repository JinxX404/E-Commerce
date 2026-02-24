import AuthService from "../services/authService.js";

class ConfirmationController {
  constructor() {
    this.authService = new AuthService();
  }

  userWelcome() {
    const user = this.authService.getCurrentUser();
    const userAvatar = document.getElementById("user-avatar");
    const userNameDisplay = document.getElementById("user-name-display");

    if (!user) {
      if (userNameDisplay) userNameDisplay.textContent = "Guest";
      if (userAvatar) userAvatar.textContent = "G";
      return;
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

  setupContinueShopping() {
    const continueBtn = document.querySelector("a.bg-primary");
    if (continueBtn) {
      continueBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../pages/home.html";
      });
    }
  }

  setupOrderDetails() {
    const orderNumberEl = document.getElementById("order-number");
    const deliveryEl = document.getElementById("estimated-delivery");
    const totalEl = document.getElementById("total-amount");

    if (orderNumberEl) {
      const randomOrderNumber = Math.floor(100000 + Math.random() * 900000);
      orderNumberEl.textContent = `#ORD-${randomOrderNumber}`;
    }

    if (deliveryEl) {
      const today = new Date();
      // Estimate delivery in 3 days
      today.setDate(today.getDate() + 3);
      const options = { month: "short", day: "numeric", year: "numeric" };
      deliveryEl.textContent = today.toLocaleDateString("en-US", options);
    }

    if (totalEl) {
      const storedTotal = sessionStorage.getItem("lastOrderTotal");
      if (storedTotal) {
        totalEl.textContent = `$${storedTotal}`;
        // Clear after displaying
        sessionStorage.removeItem("lastOrderTotal");
      } else {
        totalEl.textContent = "Processing...";
      }
    }
  }

  init() {
    this.userWelcome();
    this.logout();
    this.setupContinueShopping();
    this.setupOrderDetails();
  }
}

const confirmationController = new ConfirmationController();
confirmationController.init();
export default confirmationController;
