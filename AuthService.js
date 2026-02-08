import StorageService from "./StorageService.js";
import Token from "./Token.js";
// users
class AuthService {
  constructor() {
    this.storageService = new StorageService();
    this.token = new Token();
  }
}
