import UserRepository from "../Repositories/UserRepository.js";
import {
  validateEmail,
  validatePassword,
  hashPassword,
  verifyPassword,
} from "../Utils/utils.js";
import User from "../Models/User.js";

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
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
      const token = await this.tokenService.createToken(user);
      console.log(
        "SignIn Function on AuthService: User signed in successfully",
      );
      return token;
    } else {
      throw new Error("Invalid password");
    }
  }
  async SignOut() {
    console.log(
      "SignOut Function on AuthService: User signed out successfully",
    );
  }
  async isAuthenticated() {
    console.log(
      "isAuthenticated Function on AuthService: User is authenticated",
    );
  }
  async getCurrentUser() {
    console.log(
      "getCurrentUser Function on AuthService: User is authenticated",
    );
  }
  async getAuthenticatedUser() {
    console.log(
      "getAuthenticatedUser Function on AuthService: User is authenticated",
    );
  }
}

export default AuthService;
