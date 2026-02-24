import TokenRepository from "../repositories/tokenRepository.js";
import Token from "../models/token.js";

class TokenService {
  constructor() {
    this.tokenRepository = new TokenRepository();
  }
  createToken(user) {
    const token = new Token();
    token.setUserId(user.id);
    this.tokenRepository.save(token);
    return token;
  }
  deleteToken(token) {
    this.tokenRepository.delete(token);
  }
  getToken(token) {
    return this.tokenRepository.findByToken(token);
  }
  getAllTokens() {
    return this.tokenRepository.getAll();
  }
  updateToken(token) {
    this.tokenRepository.update(token);
  }

  isValidToken(t) {
    const token = this.tokenRepository.findByToken(t);
    return token && token.expiresAt > new Date();
  }
  getCurrentToken() {
    return this.tokenRepository.getCurrentToken();
  }
  clearCurrentToken() {
    this.tokenRepository.clearCurrentToken();
  }
  setCurrentToken(token) {
    this.tokenRepository.setCurrentToken(token);
  }
}

export default TokenService;
