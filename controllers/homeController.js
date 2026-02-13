import AuthService from "../services/authService.js";

const authService = new AuthService();

function initHome() {
  const user = authService.getCurrentUser();
  if (!user) {
    window.location.href = "../pages/login.html";
  }

  const userWelcome = document.getElementById("user-welcome");
  userWelcome.textContent = `Welcome, ${user.name}`;
}

initHome();

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  authService.SignOut();
  window.location.href = "../pages/login.html";
});
