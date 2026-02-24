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
    this.currentPriceRange = "all";
    this.currentSize = "all";
    this.currentSort = "default";

    // Hero Slider Properties
    this.sliderCurrentIndex = 0;
    this.sliderInterval = null;
    this.sliderProducts = [];
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
      this.currentPriceRange,
      this.currentSize,
      this.currentSort,
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

  async loadFilters() {
    const sizeFilter = document.getElementById("size-filter");
    if (!sizeFilter) return;

    const sizes = await this.productService.getAvailableSizes();
    const sizeHtml = sizes
      .map((size) => `<option value="${size}">${size}</option>`)
      .join("");
    sizeFilter.innerHTML = '<option value="all">Any Size</option>' + sizeHtml;
  }

  setupFilters() {
    const priceFilter = document.getElementById("price-filter");
    const sizeFilter = document.getElementById("size-filter");
    const sortFilter = document.getElementById("sort-filter");

    const updateProducts = () => {
      if (priceFilter) this.currentPriceRange = priceFilter.value;
      if (sizeFilter) this.currentSize = sizeFilter.value;
      if (sortFilter) this.currentSort = sortFilter.value;
      this.currentPage = 1;
      this.loadHomeProducts();
    };

    if (priceFilter) priceFilter.addEventListener("change", updateProducts);
    if (sizeFilter) sizeFilter.addEventListener("change", updateProducts);
    if (sortFilter) sortFilter.addEventListener("change", updateProducts);
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

  async loadHeroSlider() {
    try {
      // Fetch a larger pool of products to feature.
      const response = await this.productService.getProductsByPage(1, 20);
      let products = response.products || response;

      // Ensure we have products
      if (!products || products.length === 0) return;

      // Randomize the products and select up to 5
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      this.sliderProducts = shuffled.slice(0, 5);

      this.renderSlider();
      this.setupSliderControls();
      this.startAutoSlide();
    } catch (error) {
      console.error("Failed to load hero slider products:", error);
    }
  }

  renderSlider() {
    const track = document.getElementById("hero-slider-track");
    const dotsContainer = document.getElementById("slider-dots");
    if (!track || !dotsContainer) return;

    track.innerHTML = "";
    dotsContainer.innerHTML = "";

    const baseUrl = "https://developerapis.vercel.app/";

    this.sliderProducts.forEach((product, index) => {
      // Determine background style. We use a dark gradient overlay.
      const bgImage = `url('${baseUrl + product.image}')`;

      // Create slide
      const slide = document.createElement("div");
      slide.className = "min-w-full h-full relative flex-shrink-0";
      slide.innerHTML = `
        <div class="absolute inset-0 bg-cover bg-center" style="background-image: ${bgImage};"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/30 dark:from-gray-900/90 dark:to-gray-900/50 z-10"></div>
        <div class="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-20 text-white">
          <span class="text-indigo-300 font-semibold tracking-wider uppercase mb-2">Featured</span>
          <h1 class="text-3xl md:text-5xl font-bold mb-4 line-clamp-2 max-w-2xl">${product.name}</h1>
          <p class="text-gray-200 mb-6 max-w-md line-clamp-2">${product.description}</p>
          <div class="flex items-center gap-4">
             <span class="text-2xl font-bold text-white">$${parseFloat(product.price).toFixed(2)}</span>
             <button data-id="${product.id}" class="view-product-btn w-fit bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-indigo-500/30">
               Shop Now
             </button>
          </div>
        </div>
      `;
      track.appendChild(slide);

      // Create dot
      const dot = document.createElement("button");
      dot.className = `w-3 h-3 rounded-full transition-colors ${index === 0 ? "bg-white" : "bg-white/50 hover:bg-white"}`;
      dot.dataset.index = index;
      dotsContainer.appendChild(dot);
    });
  }

  setupSliderControls() {
    const track = document.getElementById("hero-slider-track");
    const prevBtn = document.getElementById("slider-prev");
    const nextBtn = document.getElementById("slider-next");
    const dots = document.querySelectorAll("#slider-dots button");
    const sliderContainer =
      document.getElementById("hero-slider-track").parentElement;

    if (!track) return;

    const updateSlider = () => {
      // Move track
      track.style.transform = `translateX(-${this.sliderCurrentIndex * 100}%)`;

      // Update dots
      dots.forEach((dot, index) => {
        if (index === this.sliderCurrentIndex) {
          dot.className = "w-3 h-3 rounded-full transition-colors bg-white";
        } else {
          dot.className =
            "w-3 h-3 rounded-full transition-colors bg-white/50 hover:bg-white";
        }
      });
    };

    const nextSlide = () => {
      this.sliderCurrentIndex =
        (this.sliderCurrentIndex + 1) % this.sliderProducts.length;
      updateSlider();
    };

    const prevSlide = () => {
      this.sliderCurrentIndex =
        (this.sliderCurrentIndex - 1 + this.sliderProducts.length) %
        this.sliderProducts.length;
      updateSlider();
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        this.resetAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        this.resetAutoSlide();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        this.sliderCurrentIndex = parseInt(e.target.dataset.index);
        updateSlider();
        this.resetAutoSlide();
      });
    });

    // Pause auto-slide on hover
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () =>
        this.stopAutoSlide(),
      );
      sliderContainer.addEventListener("mouseleave", () =>
        this.startAutoSlide(),
      );
    }
  }

  startAutoSlide() {
    if (this.sliderProducts.length > 1) {
      this.sliderInterval = setInterval(() => {
        const nextBtn = document.getElementById("slider-next");
        if (nextBtn) nextBtn.click();
      }, 5000); // 5 seconds
    }
  }

  stopAutoSlide() {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
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
      await this.loadFilters();
      this.setupFilters();

      // Load hero slider before products to ensure viewProduct btn listeners attach
      await this.loadHeroSlider();

      await this.loadHomeProducts();

      // View product attachments need to run again after slider renders
      // because loadHomeProducts() also calls viewProduct() but slider might render after.
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
