import ProductRepository from "../repositories/productRepository.js";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.productsCache = null;
  }

  async getAllProducts() {
    if (!this.productsCache) {
      this.productsCache = await this.productRepository.getAll();
    }
    return this.productsCache || [];
  }

  async getProductById(id) {
    return await this.productRepository.getProductByID(id);
  }

  async getProductsByPage(
    page,
    limit,
    category = null,
    priceRange = "all",
    size = "all",
    sortBy = "default",
  ) {
    let products = await this.getAllProducts();
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    if (priceRange && priceRange !== "all") {
      products = products.filter((p) => {
        const price = parseFloat(p.price);
        if (priceRange === "0-1000") return price <= 1000;
        if (priceRange === "1000-3000") return price > 1000 && price <= 3000;
        if (priceRange === "3000-5000") return price > 3000 && price <= 5000;
        if (priceRange === "5000-plus") return price > 5000;
        return true;
      });
    }

    if (size && size !== "all") {
      products = products.filter((p) => {
        if (!p.meta || !p.meta.variants) return false;
        return p.meta.variants.some(
          (variant) =>
            variant.sizes &&
            variant.sizes.some((s) => s.size === size && s.stock > 0),
        );
      });
    }

    if (sortBy && sortBy !== "default") {
      if (sortBy === "price-asc") {
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortBy === "price-desc") {
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortBy === "rating-desc") {
        products.sort((a, b) => {
          const ratingA =
            a.meta && a.meta.rating ? parseFloat(a.meta.rating) : 0;
          const ratingB =
            b.meta && b.meta.rating ? parseFloat(b.meta.rating) : 0;
          return ratingB - ratingA;
        });
      }
    }

    const paginatedProducts = products.slice((page - 1) * limit, page * limit);
    return {
      products: paginatedProducts,
      totalCount: products.length,
    };
  }

  async getAvailableSizes() {
    const products = await this.getAllProducts();
    const sizes = new Set();
    products.forEach((p) => {
      if (p.meta && p.meta.variants) {
        p.meta.variants.forEach((variant) => {
          if (variant.sizes) {
            variant.sizes.forEach((s) => sizes.add(s.size));
          }
        });
      }
    });

    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
    return Array.from(sizes).sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }

  async getCategories() {
    const products = await this.getAllProducts();
    const categories = new Set(products.map((p) => p.category));
    return Array.from(categories);
  }
}

export default ProductService;
