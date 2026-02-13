import {
  validateEmail,
  validatePassword,
  hashPassword,
} from "./utils/utils.js";
import StorageService from "./infrastructure/storageService.js";
import User from "./models/user.js";
import AuthService from "./services/authService.js";
import createProductCard from "./components/productCard.js";

// const storageService = new StorageService();
// const user = new User("Moataz", "moatazmuhammedmuhammed@gmail.com", "1234");
const authService = new AuthService();

// authService.isAuthenticated().then((isAuthenticated) => {
//   console.log(isAuthenticated);
// });

// console.log(storageService.getFromLocalStorage("authToken"));

// const productCard = createProductCard();
// const productCard2 = createProductCard();
// const productCard3 = createProductCard();
// document.querySelector(".products").appendChild(productCard);
// document.querySelector(".products").appendChild(productCard2);
// document.querySelector(".products").appendChild(productCard3);
console.log(authService.getCurrentUser());
