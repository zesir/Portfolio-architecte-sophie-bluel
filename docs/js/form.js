// form.js
import { displayProjects } from "./filtre.js";
import {
  API_BASE,
  allProjects,
  categories,
  setAllProjects,
} from "./projects.js";

const photoPlaceholder = document.querySelector(".photo-placeholder");
const validerBtn = document.querySelector(".validate-btn");

// le <select> se trouve dans .ajout-photo
function getSelect() {
  return document.querySelector(".ajout-photo select");
}
function getTitleInput() {
  return document.querySelector(".ajout-photo input[type='text']");
}

const titleInput = getTitleInput();
const select = getSelect();

export function showError(message) {
  const alertContainer = document.querySelector(".alertContainer");
  const alertInput = document.createElement("p");
  while (alertContainer.firstChild) {
    alertContainer.removeChild(alertContainer.firstChild);
  }
  alertInput.textContent = message;
  alertInput.classList.add("red");
  alertContainer.appendChild(alertInput);
}

let fileInput = null;

function checkFormCompletion() {
  const file = fileInput.files && fileInput.files[0];
  if (titleInput.value.trim() && select.value && file) {
    validerBtn.classList.add("btn-green");
  } else {
    validerBtn.classList.remove("btn-green");
  }
}

// ===== preview + input file =====
function attachFileInputListener() {
  fileInput = document.getElementById("file");
  if (!fileInput) return;
  fileInput.addEventListener("change", handleFileChange);
}

function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    photoPlaceholder.innerHTML = `<img src="${reader.result}" alt="Preview" class="preview">`;
  };
  reader.readAsDataURL(file);
}

// ===== reset formulaire =====
export function resetForm() {
  photoPlaceholder.innerHTML = `
    <div class="photo-icon"><i class="fa-regular fa-image"></i></div>
    <label class="btn btn-grey" for="file">+ Ajouter photo</label>
    <p>jpg,png : 4mo max</p>
    <input type="file" id="file" hidden />
  `;
  attachFileInputListener();

  const title = getTitleInput();
  if (title) title.value = "";

  const select = getSelect();
  if (select) select.selectedIndex = 0;
}

// ===== remplir le select des catégories (exporté) =====
export function fillCategorySelect() {
  const select = getSelect();
  if (!select) {
    console.warn(
      "fillCategorySelect: select .ajout-photo select introuvable dans le DOM"
    );
    return;
  }

  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Sélectionnez une catégorie";
  select.appendChild(placeholder);

  // categories vient de projects.js et doit être chargé via loadCategories() avant appel
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}

// ===== envoi du formulaire =====
export async function handleFormSubmit() {
  const titleInput = getTitleInput();
  const select = getSelect();
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  if (!titleInput.value || !select.value || !file) {
    showError("Merci de remplir tout les champs");

    return;
  }
  if (titleInput.value && select.value && file) {
    validerBtn.classList.add("btn-green");
  }
  const formData = new FormData();
  formData.append("title", titleInput.value);
  formData.append("category", select.value);
  formData.append("image", file);

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}works`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("Erreur API :", response.status);
      alert("Impossible d'ajouter le projet.");
      return;
    }

    const newProject = await response.json();
    // normalize
    if (newProject.category && newProject.category.id !== undefined) {
      newProject.categoryId = Number(newProject.category.id);
    } else if (newProject.categoryId !== undefined) {
      newProject.categoryId = Number(newProject.categoryId);
    } else {
      newProject.categoryId = Number(select.value);
    }
    if (newProject.id) newProject.id = Number(newProject.id);

    allProjects.push(newProject);
    setAllProjects(allProjects);

    // mettre à jour affichages
    displayProjects(allProjects);
    if (typeof displayProjectInModal === "function") {
      displayProjectInModal(allProjects);
    }

    resetForm();
    // éventuellement fermer / revenir à la galerie si tu as cette logique
  } catch (err) {
    console.error("Erreur réseau :", err);
    alert("Erreur réseau !");
  }
}

// ===== initialisation publique =====
export function initForm() {
  attachFileInputListener();
  // écoute les changements sur tous les champs
  titleInput.addEventListener("input", checkFormCompletion);
  select.addEventListener("change", checkFormCompletion);
  fileInput.addEventListener("change", checkFormCompletion);

  const valider = document.querySelector(".validate-btn");
  if (valider)
    valider.addEventListener("click", (e) => {
      e.preventDefault();
      handleFormSubmit();
    });
}
