import { API_BASE } from "./projects.js";

const form = document.querySelector("form");
const errorMsgContainer = document.querySelector(".error-message");
const errorMsg = document.createElement("p");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "" || password === "") {
    errorMsgContainer.innerHTML = "";
    errorMsgContainer.appendChild(errorMsg);
    errorMsg.textContent = "Veuillez remplir tous les champs.";
    errorMsg.style.color = "red";
    return;
  }
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!regex.test(email)) {
    errorMsgContainer.innerHTML = "";
    errorMsgContainer.appendChild(errorMsg);
    errorMsg.textContent = "Email invalide.";
    errorMsg.style.color = "red";
    return;
  }
  logUser(email, password);
});

async function logUser(email, password) {
  try {
    const response = await fetch(`${API_BASE}users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Email ou mot de passe incorrect"); // on ignore le message du serveur
    }

    if (!response.ok) {
      const msg = data.message || "Email ou mot de passe incorrect";
      throw new Error(msg);
    }

    // Tout est ok
    localStorage.setItem("token", data.token);
    window.location.href = "../../index.html";
  } catch (error) {
    // Affichage de l'erreur
    errorMsgContainer.innerHTML = "";
    errorMsgContainer.appendChild(errorMsg);
    errorMsg.textContent = error.message;
    errorMsg.style.color = "red";
  }
}
