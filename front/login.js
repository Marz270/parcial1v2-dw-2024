import { auth } from "./validations/auth.js";

// Si ya está autenticado, redirigir a la lista de personas
if (auth.isAuthenticated()) {
  window.location.href = "../itemList/index.html"
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById("user").value;
  const contraseña = document.getElementById("password").value;

  try {
    await auth.login(user, contraseña);
    handleSuccessfulLogin();
  } catch (error) {
    handleLoginError(error);
  }
}

function handleSuccessfulLogin() {
  window.alert("Login exitoso");
  document.dispatchEvent(new Event("authChanged"));
  if(auth.is_admin){
    window.location.href = "../itemList/index.html";
  }
  window.location.href = "../userItemList/index.html"
}

function handleLoginError(error) {
  console.error("Login failed:", error);
  window.alert("Login fallido: " + error.message);
}
