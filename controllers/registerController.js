import AuthService from "../services/authService.js";
import NotificationService from "../services/notificationService.js";

const registerForm = document.querySelector("form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");

const authService = new AuthService();
const notificationService = new NotificationService();

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (password.value !== confirmPassword.value) {
    notificationService.showToast("Passwords do not match", "error");
    return;
  }
  const user = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  try {
    notificationService.showLoader("Creating account...");
    await authService.register(user);
    notificationService.showToast(
      "User registered successfully! Redirecting to login...",
      "success",
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);
    const isSystemError =
      error instanceof TypeError ||
      error instanceof ReferenceError ||
      error instanceof SyntaxError;
    const friendlyMessage = isSystemError
      ? "An unexpected system error occurred. Please try again later."
      : error.message || "Registration failed. Try again.";

    notificationService.showToast(friendlyMessage, "error");
  } finally {
    notificationService.hideLoader();
  }
});
