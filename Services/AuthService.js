import UserRepository from "../repositories/userRepository.js";
import TokenService from "../services/tokenService.js";
import TokenRepository from "../repositories/tokenRepository.js";
import {
  validateEmail,
  validatePassword,
  hashPassword,
  verifyPassword,
} from "../utils/utils.js";
import User from "../models/user.js";

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
    this.tokenRepository = new TokenRepository();
  }
  async register(user) {
    const userExists = this.userRepository.findByEmail(user.email);
    if (userExists) {
      throw new Error("User already exists");
    }

    const isValidEmail = await validateEmail(user.email);
    if (!isValidEmail) {
      throw new Error("Please enter a valid email address.");
    }

    const isValidPassword = await validatePassword(user.password);
    if (!isValidPassword) {
      throw new Error(
        "Password must be at least 8 characters long, and include an uppercase letter, lowercase letter, number, and special character.",
      );
    }

    const hashedPassword = await hashPassword(user.password);
    const newUser = new User(user.name, user.email, hashedPassword);
    this.userRepository.save(newUser);
    console.log(
      "Register Function on AuthService: User registered successfully",
    );
  }

  async signIn(user) {
    const userExists = this.userRepository.findByEmail(user.email);
    if (!userExists) {
      throw new Error("User not found");
    }
    if (await verifyPassword(user.password, userExists.hashedPassword)) {
      const token = this.tokenService.createToken(userExists);
      this.tokenService.setCurrentToken(token.token);
    } else {
      throw new Error("Invalid password");
    }
  }
  async signOut() {
    this.tokenService.deleteToken(this.tokenService.getCurrentToken());
    this.tokenService.clearCurrentToken();
  }
  async getAuthenticatedUser() {
    console.log(
      "getAuthenticatedUser Function on AuthService: User is authenticated",
    );
  }

  getCurrentUser() {
    const raw = this.tokenService.getCurrentToken();
    if (!raw) return null;

    const tokenObj = this.tokenService.getToken(raw);
    let user = this.userRepository.findById(tokenObj.userId);
    return user;
  }
}

export default AuthService;
