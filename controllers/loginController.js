import AuthService from "../services/authService.js";

const loginForm = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

const authService = new AuthService();

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    email: email.value,
    password: password.value,
  };
  console.log("login.js: user object created");
  try {
    await authService.signIn(user);
    console.log("login.js: user signed in successfully");
    window.location.href = "../pages/home.html";
  } catch (error) {
    console.log(error);
  }
});
