function createProductDetails(product) {
  const baseUrl = "https://developerapis.vercel.app/";

  const productDetailsContainer = document.querySelector(".product-container");
  productDetailsContainer.innerHTML = `
      <div class="text-sm breadcrumbs text-gray-500 mb-8">
        <ul class="flex items-center space-x-2">
          <li><a class="hover:underline transition-colors hover:text-primary" href="../pages/home.html">Home</a></li>
          <li><span class="material-icons-outlined text-base">chevron_right</span></li>
          <li><a class="hover:underline transition-colors hover:text-primary cursor-pointer">${product.category}</a></li>
          <li><span class="material-icons-outlined text-base">chevron_right</span></li>
          <li class="font-medium text-gray-900 dark:text-gray-100">${product.name}</li>
        </ul>
      </div>
      <div class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl overflow-hidden border border-border-light dark:border-border-dark">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
          <div class="relative w-full h-[500px] lg:h-auto bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-8 group overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-tr from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 opacity-50 z-0"></div>
            <img alt="${product.name}" class="relative z-10 w-auto h-full max-h-[450px] object-contain transform transition-transform duration-500 group-hover:scale-105 drop-shadow-2xl rounded-lg" src="${baseUrl + product.image}" />
          </div>
          <div class="p-8 lg:p-12 flex flex-col justify-center">
            <div class="mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                ${product.meta?.brand || "Brand"}
              </span>
              <span class="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Category: ${product.category}
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
              ${product.name}
            </h1>
            <div class="flex items-baseline space-x-4 mb-6">
              <p class="text-3xl font-bold text-primary">$${parseFloat(product.price).toFixed(2)}</p>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              ${product.description}
            </p>
            <div class="space-y-4 mb-8 border-t border-b border-border-light dark:border-border-dark py-6">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400 font-medium">Availability</span>
                <span class="text-green-600 dark:text-green-400 font-semibold flex items-center">
                  <span class="material-icons-outlined text-sm mr-1">check_circle</span> <span id="stock-display">In Stock (${product.meta?.total_stock || 0} available)</span>
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400 font-medium">Rating</span>
                <span class="text-yellow-500 font-semibold flex items-center gap-1">
                  ${"★".repeat(Math.max(1, Math.floor(product.meta?.rating || 0)))} <span class="text-gray-900 dark:text-white">(${product.meta?.rating || 0})</span>
                </span>
              </div>

              ${
                product.meta?.variants && product.meta.variants.length > 0
                  ? `
              <div class="pt-4 border-t border-border-light dark:border-border-dark">
                <p class="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Color</p>
                <div class="flex flex-wrap gap-2">
                  ${product.meta.variants
                    .map(
                      (v, index) => `
                    <button class="color-btn px-4 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary transition-all bg-surface-light dark:bg-surface-dark ${index === 0 ? "ring-2 ring-primary border-primary text-primary" : ""}" data-index="${index}">
                      ${v.color}
                    </button>
                  `,
                    )
                    .join("")}
                </div>
              </div>

              <div class="pt-4">
                <div class="flex justify-between items-center mb-3">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">Size</p>
                </div>
                <div class="flex flex-wrap gap-3 size-container">
                  ${(product.meta.variants[0].sizes || [])
                    .map(
                      (size, idx) => `
                    <button class="size-btn flex flex-col items-center justify-center min-w-[3.5rem] px-3 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-all bg-surface-light dark:bg-surface-dark ${idx === 0 && size.stock > 0 ? "ring-2 ring-primary border-primary text-primary" : ""}" data-stock="${size.stock}" data-sku="${size.sku}" ${size.stock === 0 ? 'disabled title="Out of stock"' : ""}>
                      <span>${size.size}</span>
                    </button>
                  `,
                    )
                    .join("")}
                </div>
              </div>
              `
                  : ""
              }
            </div>
            <div class="flex flex-col sm:flex-row gap-4 mt-auto">
              <div class="flex items-center border border-border-light dark:border-border-dark rounded-lg overflow-hidden w-full sm:w-32 bg-surface-light dark:bg-surface-dark">
                <button id="qty-decrease" class="px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition w-full h-full flex items-center justify-center"><span class="material-icons-outlined text-sm">remove</span></button>
                <input id="qty-input" class="w-full text-center border-none focus:ring-0 bg-transparent text-gray-900 dark:text-white font-medium p-0" readonly type="text" value="1" />
                <button id="qty-increase" class="px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition w-full h-full flex items-center justify-center"><span class="material-icons-outlined text-sm">add</span></button>
              </div>
              <button id="add-to-cart-btn" class="flex-1 bg-primary hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center text-lg uppercase tracking-wider">
                <span class="material-icons-outlined mr-2">shopping_bag</span> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  return productDetailsContainer;
}
export default createProductDetails;
