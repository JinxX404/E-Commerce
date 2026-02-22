function createProductCard(product) {
  const cardDiv = document.createElement("div");

  // cardDiv.innerHTML = `
  //    <div
  //           class="group bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
  //           <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
  //             <img alt="${product.name}"
  //               class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  //               src="${"https://developerapis.vercel.app/" + product.image}" />
  //           </div>
  //           <div class="p-4 flex flex-col flex-1">
  //             <div class="flex justify-between items-start mb-2">
  //               <div>
  //                 <h3 class="font-bold text-gray-900 dark:text-white truncate pr-2">${product.name}</h3>
  //                 <p class="text-xs text-gray-500 dark:text-gray-400">${product.category}</p>
  //               </div>
  //               <span class="font-bold text-primary">$${product.price}</span>
  //             </div>
  //             <div class="mt-auto flex items-center justify-between pt-4">
  //               <div class="flex items-center gap-1">
  //               </div>
  //               <button
  //                 class="bg-primary hover:bg-indigo-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md">
  //                 <span class="material-icons-outlined text-sm">add</span>
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  // `;

  const baseUrl = "https://developerapis.vercel.app/";
  const firstVariant = product.meta.variants[0];
  const firstSizes = firstVariant.sizes;

  //   cardDiv.innerHTML = `
  // <div class="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">

  //   <!-- Image -->
  //   <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
  //     <img
  //       src="${baseUrl + product.image}"
  //       alt="${product.name}"
  //       class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  //     />
  //     <span class="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
  //       ${product.meta.brand}
  //     </span>
  //   </div>

  //   <!-- Content -->
  //   <div class="p-4 flex flex-col flex-1 space-y-3">

  //     <!-- Title + Price -->
  //     <div class="flex justify-between items-start">
  //       <div>
  //         <h3 class="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
  //           ${product.name}
  //         </h3>
  //         <p class="text-xs text-gray-500">${product.category}</p>
  //       </div>
  //       <span class="font-bold text-indigo-600 text-sm">
  //         $${parseFloat(product.price).toFixed(2)}
  //       </span>
  //     </div>

  //     <!-- Rating -->
  //     <div class="flex items-center gap-1 text-yellow-400 text-sm">
  //       ${"★".repeat(Math.floor(product.meta.rating))}
  //       <span class="text-gray-400 text-xs ml-1">
  //         (${product.meta.rating})
  //       </span>
  //     </div>

  //     <!-- Description -->
  //     <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
  //       ${product.description}
  //     </p>

  //     <!-- Color Selector -->
  //     <div>
  //       <p class="text-xs font-semibold mb-1">Color</p>
  //       <div class="flex flex-wrap gap-2">
  //         ${product.meta.variants
  //           .map(
  //             (v, index) => `
  //           <button
  //             class="color-btn px-2 py-1 text-xs rounded-full border border-gray-300 hover:bg-indigo-100 transition"
  //             data-index="${index}"
  //           >
  //             ${v.color}
  //           </button>
  //         `,
  //           )
  //           .join("")}
  //       </div>
  //     </div>

  //     <!-- Size Selector -->
  //     <div>
  //       <p class="text-xs font-semibold mb-1">Size</p>
  //       <div class="flex flex-wrap gap-2 size-container">
  //         ${firstSizes
  //           .map(
  //             (size) => `
  //           <button
  //             class="size-btn px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-indigo-100 transition"
  //             data-stock="${size.stock}"
  //             data-sku="${size.sku}"
  //           >
  //             ${size.size}
  //           </button>
  //         `,
  //           )
  //           .join("")}
  //       </div>
  //     </div>

  //     <!-- Stock -->
  //     <p class="text-xs text-gray-500">
  //       Total Stock: ${product.meta.total_stock}
  //     </p>

  //     <!-- Add to Cart -->
  //     <button
  //       class="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300"
  //     >
  //       Add to Cart
  //     </button>

  //   </div>
  // </div>
  // `;

  // const baseUrl = "https://developerapis.vercel.app/";

  cardDiv.innerHTML = `
<div class="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

  <!-- Image -->
  <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
    <img 
      src="${baseUrl + product.image}" 
      alt="${product.name}"
      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />

    <!-- Category Badge -->
    <span class="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
      ${product.category}
    </span>

    <!-- Stock Badge -->
    ${
      product.meta.total_stock < 10
        ? `<span class="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
            Low Stock
          </span>`
        : ""
    }
  </div>

  <!-- Content -->
  <div class="p-4 flex flex-col flex-1 space-y-3">

    <!-- Brand -->
    <p class="text-xs text-gray-500 uppercase tracking-wide">
      ${product.meta.brand}
    </p>

    <!-- Title + Price -->
    <div class="flex justify-between items-start">
      <h3 class="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 pr-2">
        ${product.name}
      </h3>
      <span class="font-bold text-indigo-600 text-sm">
        $${parseFloat(product.price).toFixed(2)}
      </span>
    </div>

    <!-- Rating -->
    <div class="flex items-center gap-1 text-yellow-400 text-sm">
      ${"★".repeat(Math.floor(product.meta.rating))}
      <span class="text-gray-400 text-xs ml-1">
        (${product.meta.rating})
      </span>
    </div>

    <!-- Description -->
    <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
      ${product.description}
    </p>

    <!-- Buttons -->
    <div class="mt-auto flex gap-2 pt-3">

      <!-- View Product -->
      <button 
        data-id="${product.id}"
        class="view-product-btn flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all duration-300"
      >
        View Product
      </button>

      <!-- Quick Add -->
      <button 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300"
      >
        Add
      </button>

    </div>

  </div>
</div>
`;

  return cardDiv;
}

export default createProductCard;
