function createProductCard(product) {
  const cardDiv = document.createElement("div");
  //   cardDiv.innerHTML = `
  //    <div
  //           class="group bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
  //           <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
  //             <img alt="Headphones"
  //               class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  //               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBByyIDiTdg9uN5OnlZdm8IC9k3SpP0Rej7MntkjVZJpUh0JT8aU1vr0mBG7y16R_g9lzyw7DmQAsjbf0hJlSoglea3s8n9Gtdi_1shAn9gQsgXpd369GsLkpFg8xt8PSIaJIA2_ekVQjSoydSlONGdzR2cnry2Vaqf-r9nfHlsAnT62cI04U0ovBionCShcVYJOtQpYtT7qKKamIpA9K1siFfEBSBohfg6zhWJZbUgD4Bodr6QjE8zT-_n0L3gIiMl2GGINA_Yqpo" />
  //           </div>
  //           <div class="p-4 flex flex-col flex-1">
  //             <div class="flex justify-between items-start mb-2">
  //               <div>
  //                 <h3 class="font-bold text-gray-900 dark:text-white truncate pr-2">Pro Headphones</h3>
  //                 <p class="text-xs text-gray-500 dark:text-gray-400">Electronics</p>
  //               </div>
  //               <span class="font-bold text-primary">$120.00</span>
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
  // console.log("https://developerapis.vercel.app" + product.images);
  cardDiv.innerHTML = `
     <div
            class="group bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img alt="${product.name}"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src="${"https://developerapis.vercel.app/" + product.image}" />
            </div>
            <div class="p-4 flex flex-col flex-1">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white truncate pr-2">${product.name}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">${product.category}</p>
                </div>
                <span class="font-bold text-primary">$${product.price}</span>
              </div>
              <div class="mt-auto flex items-center justify-between pt-4">
                <div class="flex items-center gap-1">
                </div>
                <button
                  class="bg-primary hover:bg-indigo-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md">
                  <span class="material-icons-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </div>
  `;

  return cardDiv;
}

export default createProductCard;
