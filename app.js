import { validateEmail, validatePassword, hashPassword } from "./utils.js";
import StorageService from "./StorageService.js";
import User from "./User.js";

const storageService = new StorageService();
const user = new User("Moataz", "moatazmuhammedmuhammed@gmail.com", "1234");

// storageService.saveUserToLocalStorage(user);
