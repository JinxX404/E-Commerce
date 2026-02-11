import TokenRepository from "../Repositories/TokenRepository.js";
import Token from "../Models/Token.js";

class TokenService {
  constructor() {
    this.tokenRepository = new TokenRepository();
  }
  async createToken(user) {
    const token = new Token();
    token.setUserId(user.id);
    await this.tokenRepository.save(token);
    return token;
  }
  async deleteToken(token) {
    await this.tokenRepository.delete(token);
  }
  async getToken(token) {
    return await this.tokenRepository.findByToken(token);
  }
  async getAllTokens() {
    return await this.tokenRepository.getAll();
  }
  async updateToken(token) {
    await this.tokenRepository.update(token);
  }

  async isValidToken(token) {
    const token = await this.tokenRepository.findByToken(token);
    return token && token.expiresAt > new Date();
  }
}

export default TokenService;
