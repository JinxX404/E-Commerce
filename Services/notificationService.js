class NotificationService {
  constructor() {
    this.toastContainer = null;
    this.loaderContainer = null;
    this.initContainers();
  }

  initContainers() {
    // Toast Container
    this.toastContainer = document.getElementById("toast-container");
    if (!this.toastContainer) {
      this.toastContainer = document.createElement("div");
      this.toastContainer.id = "toast-container";
      this.toastContainer.className =
        "fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none";
      document.body.appendChild(this.toastContainer);
    }

    // Loader Container
    this.loaderContainer = document.getElementById("loader-container");
    if (!this.loaderContainer) {
      this.loaderContainer = document.createElement("div");
      this.loaderContainer.id = "loader-container";
      this.loaderContainer.className =
        "fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hidden";
      this.loaderContainer.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary border-r-primary shadow-lg"></div>
          <p id="loader-message" class="mt-4 text-gray-700 dark:text-gray-200 font-medium tracking-wide">Loading...</p>
        </div>
      `;
      document.body.appendChild(this.loaderContainer);
    }
  }

  showToast(message, type = "info", duration = 0) {
    const toast = document.createElement("div");

    // Base styles
    let baseClass =
      "min-w-[300px] flex items-center p-4 rounded-lg shadow-lg border transform transition-all duration-300 translate-y-full opacity-0 pointer-events-auto";

    let iconSvg = `<svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    // Type specific styles
    if (type === "success") {
      baseClass +=
        " bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200";
      iconSvg = `<svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === "error") {
      baseClass +=
        " bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
      iconSvg = `<svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === "warning") {
      baseClass +=
        " bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200";
      iconSvg = `<svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    } else {
      baseClass +=
        " bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
    }

    toast.className = baseClass;
    toast.innerHTML = `
      ${iconSvg}
      <p class="font-medium text-sm flex-1">${message}</p>
      <button class="ml-4 opacity-70 hover:opacity-100 transition-opacity focus:outline-none" onclick="this.parentElement.remove()">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;

    this.toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-full", "opacity-0");
    });

    // Calculate dynamic duration based on message length (min 3000ms, max 8000ms)
    // Roughly 50ms per character
    const readDuration =
      duration || Math.min(Math.max(message.length * 60, 3000), 8000);

    // Auto remove
    if (readDuration > 0) {
      setTimeout(() => {
        toast.classList.add("translate-y-full", "opacity-0");
        setTimeout(() => toast.remove(), 300); // Wait for transition out
      }, readDuration);
    }
  }

  showLoader(message = "Processing...") {
    const msgElement = document.getElementById("loader-message");
    if (msgElement) msgElement.textContent = message;

    if (this.loaderContainer) {
      this.loaderContainer.classList.remove("hidden");
    }
  }

  hideLoader() {
    if (this.loaderContainer) {
      this.loaderContainer.classList.add("hidden");
    }
  }
}

export default NotificationService;
