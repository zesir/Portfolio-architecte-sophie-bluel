import { API_BASE } from "./projects.js";

const form = document.querySelector("form");
const errorMsgContainer = document.querySelector(".error-message");
const errorMsg = document.createElement("p");
export const navLog = document.getElementById("nav-log");

// Logout
function logout() {
  localStorage.removeItem("token");

  const editBtn = document.querySelector(".edit-btn");
  if (editBtn) editBtn.style.display = "none";

  navLog.innerHTML = `<a href="assets/pages/login.html">Login</a>`;
}

// Si clic sur nav-log et qu'on est déjà connecté
navLog.addEventListener("click", (e) => {
  if (localStorage.getItem("token")) {
    e.preventDefault(); // bloque la navigation
    logout();
  }
});

// Gestion soumission du formulaire
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validation basique
  if (!email || !password) {
    showError("Veuillez remplir tous les champs.");
    return;
  }

  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!regex.test(email)) {
    showError("Email invalide.");
    return;
  }

  // Appel API login
  try {
    const response = await fetch(`${API_BASE}users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Email ou mot de passe incorrect.");
    }

    // Stocker token et rediriger
    localStorage.setItem("token", data.token);
    window.location.href = "../../index.html";
  } catch (err) {
    showError(err.message);
  }
});

// Fonction utilitaire pour afficher une erreur
function showError(msg) {
  errorMsgContainer.innerHTML = "";
  errorMsg.textContent = msg;
  errorMsg.style.color = "red";
  errorMsgContainer.appendChild(errorMsg);
}
