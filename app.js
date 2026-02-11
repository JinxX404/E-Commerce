import {
  validateEmail,
  validatePassword,
  hashPassword,
} from "./Utils/utils.js";
import StorageService from "./Infrastructure/StorageService.js";
import User from "./Models/User.js";

const storageService = new StorageService();
const user = new User("Moataz", "moatazmuhammedmuhammed@gmail.com", "1234");
