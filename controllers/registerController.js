import AuthService from "../services/authService.js";

const registerForm = document.querySelector("form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");

const authService = new AuthService();

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }
  const user = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  try {
    await authService.Register(user);
    alert("User registered successfully : go to login page");
    window.location.href = "login.html";
  } catch (error) {
    console.log(error);
  }
});
