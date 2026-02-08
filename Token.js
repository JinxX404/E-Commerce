import StorageService from "./StorageService.js";

class Token {
  constructor() {
    this.storageService = new StorageService();
    this.token = this.generateToken();
    this.issuedAt = new Date();
    this.expiresAt = new Date(this.issuedAt.getTime() + 60 * 60 * 1000);
    this.userId = null;
  }

  getUserId() {
    return this.userId;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  generateToken() {
    return crypto.randomUUID();
  }
  isValidToken() {
    return this.expiresAt > new Date();
  }
  getToken() {
    return this.token;
  }
}
