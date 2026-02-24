import AuthService from "../services/authService.js";
import NotificationService from "../services/notificationService.js";

const loginForm = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

const authService = new AuthService();
const notificationService = new NotificationService();

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    email: email.value,
    password: password.value,
  };
  console.log("login.js: user object created");
  try {
    notificationService.showLoader("Authenticating...");
    await authService.signIn(user);
    console.log("login.js: user signed in successfully");
    notificationService.showToast(
      "Login successful. Redirecting...",
      "success",
    );
    setTimeout(() => {
      window.location.href = "../pages/home.html";
    }, 1000);
  } catch (error) {
    console.error("Login error:", error);
    const isSystemError =
      error instanceof TypeError ||
      error instanceof ReferenceError ||
      error instanceof SyntaxError;
    const friendlyMessage = isSystemError
      ? "An unexpected system error occurred. Please try again later."
      : error.message || "Invalid credentials. Try again.";

    notificationService.showToast(friendlyMessage, "error");
  } finally {
    notificationService.hideLoader();
  }
});
