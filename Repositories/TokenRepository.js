import StorageService from "../Infrastructure/StorageService.js";

class TokenRepository {
  constructor() {
    this.storageService = new StorageService();
  }
  save(token) {
    const tokens = this.storageService.getFromLocalStorage("tokens") || [];
    tokens.push(token);
    this.storageService.saveToLocalStorage("tokens", tokens);
  }
  findByToken(token) {
    const tokens = this.storageService.getFromLocalStorage("tokens") || [];
    return tokens.find((t) => t.token === token);
  }
  delete(token) {
    const tokens = this.storageService.getFromLocalStorage("tokens") || [];
    const updatedTokens = tokens.filter((t) => t.token !== token);
    this.storageService.saveToLocalStorage("tokens", updatedTokens);
  }
  getAll() {
    return this.storageService.getFromLocalStorage("tokens") || [];
  }
  update(token) {
    const tokens = this.storageService.getFromLocalStorage("tokens") || [];
    const updatedTokens = tokens.map((t) =>
      t.token === token.token ? token : t,
    );
    this.storageService.saveToLocalStorage("tokens", updatedTokens);
  }
}

export default TokenRepository;
