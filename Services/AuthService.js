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
  async Register(user) {
    const userExists = this.userRepository.findByEmail(user.email);
    if (userExists) {
      throw new Error("User already exists");
    }
    if (
      (await validateEmail(user.email)) &&
      (await validatePassword(user.password))
    ) {
      const hashedPassword = await hashPassword(user.password);
      const newUser = new User(user.name, user.email, hashedPassword);
      this.userRepository.save(newUser);
      console.log(
        "Register Function on AuthService: User registered successfully",
      );
    } else {
      throw new Error("Invalid email or password");
    }
  }

  async SignIn(user) {
    const userExists = this.userRepository.findByEmail(user.email);
    if (!userExists) {
      throw new Error("User not found");
    }
    if (await verifyPassword(user.password, userExists.hashedPassword)) {
      const token = this.tokenService.createToken(userExists);
      // alert("Token Created");
      console.log(
        "SignIn Function on AuthService: User signed in successfully",
      );

      // localStorage.setItem("authToken", JSON.stringify(tokenObj.token));
      this.tokenService.setCurrentToken(token.token);
    } else {
      throw new Error("Invalid password");
    }
  }
  async SignOut() {
    this.tokenService.deleteToken(this.tokenService.getCurrentToken());
    this.tokenService.clearCurrentToken();
  }
  // async isAuthenticated() {
  //   const tokenString = this.tokenService.getCurrentToken();
  //   // console.log(tokenString);
  //   if (!tokenString) return false;
  //   return this.tokenService.isValidToken(tokenString);
  // }
  // async getCurrentUser() {
  //   console.log(
  //     "getCurrentUser Function on AuthService: User is authenticated",
  //   );
  // }
  async getAuthenticatedUser() {
    console.log(
      "getAuthenticatedUser Function on AuthService: User is authenticated",
    );
  }

  // getCurrentUser() {
  //   const tokenString = this.tokenService.getCurrentToken();
  //   console.log(tokenString);
  //   if (!tokenString) return null;

  //   // const tokenObj = this.tokenRepository.findByToken(tokenString);
  //   // console.log(tokenObj);
  //   if (!tokenObj) return null;

  //   // optional expiry check (you already have isValidToken in TokenService)
  //   if (tokenObj.expiresAt && new Date(tokenObj.expiresAt) <= new Date())
  //     return null;

  //   return this.userRepository.findById(tokenObj.userId);
  // }

  getCurrentUser() {
    const raw = this.tokenService.getCurrentToken();
    if (!raw) return null;

    const tokenObj = this.tokenService.getToken(raw);

    if (!this.tokenService.isValidToken(tokenObj.token)) {
      this.tokenService.deleteToken(tokenObj);
      return null;
    }
    return this.userRepository.findById(tokenObj.userId);
  }
}

export default AuthService;
