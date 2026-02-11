import AuthService from "../Services/AuthService.js";
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
    await authService.SignIn(user);
    console.log("login.js: user signed in successfully");
    alert("User logged in successfully");
    window.location.href = "../index.html";
  } catch (error) {
    console.log(error);
  }
});
