import { displayProject, generateFiltersBtn } from "./filtre.js";
import {
  allProjects,
  API_BASE,
  categories,
  loadCategories,
  loadProject,
  setAllProjects,
} from "./projects.js";

document.addEventListener("DOMContentLoaded", async function () {
  // --- Constantes DOM ---
  const token = localStorage.getItem("token");
  const navLog = document.getElementById("nav-log");
  const titleEdit = document.querySelector(".title-edit");
  const overlay = document.querySelector(".overlay");
  const closeBtn = document.querySelector(".cross_icon");
  const backBtn = document.querySelector(".return_icon");
  const modalBtn = document.querySelector(".addPhoto-btn");
  const valider = document.querySelector(".validate-btn");
  const gallerie = document.querySelector(".gallery-photo");
  const titre = document.querySelector(".header__modal h3");
  const ajoutPhoto = document.querySelector(".ajout-photo");
  const photoPlaceholder = document.querySelector(".photo-placeholder");
  const select = document.querySelector(".ajout-photo select");
  let fileInput; // sera assigné dynamiquement

  // --- Fonctions utilitaires ---
  function toggle(el, show, displayType = "flex") {
    if (show) el.style.display = displayType;
    else el.style.display = "none";
  }

  function attachFileInputListener() {
    fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.addEventListener("change", handleFileChange);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      photoPlaceholder.innerHTML = `<img src="${e.target.result}" alt="Preview" class="preview">`;
    };
    reader.readAsDataURL(file);
  }

  function resetForm() {
    photoPlaceholder.innerHTML = `
      <div class="photo-icon"><i class="fa-regular fa-image"></i></div>
      <label class="btn btn-grey" for="file">+ Ajouter photo</label>
      <p>jpg,png : 4mo max</p>
      <input type="file" id="file" hidden />
    `;
    attachFileInputListener();
    document.querySelector(".ajout-photo input[type='text']").value = "";
    select.selectedIndex = 0;
  }

  async function initCategorySelect() {
    await loadCategories();
    fillCategorySelect();
  }

  function fillCategorySelect() {
    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.textContent = "Sélectionnez une catégorie";
    placeholder.value = "";
    select.appendChild(placeholder);

    categories.forEach(function (cat) {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  }
  async function handleFormSubmit() {
    const titleInput = document.querySelector(
      ".ajout-photo input[type='text']"
    );
    const categorySelect = select;
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    if (!titleInput.value || !categorySelect.value || !file) {
      alert("Merci de remplir tous les champs !");
      return;
    }

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value); // string from select
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

      let newProject = await response.json();
      console.log("newProject raw:", newProject); // <-- utile pour debug

      // --- Normaliser categoryId pour être sûr ---
      // Cas 1: API renvoie newProject.category = {id: X, name: "..."}
      if (newProject.category && newProject.category.id !== undefined) {
        newProject.categoryId = Number(newProject.category.id);
      }
      // Cas 2: API renvoie newProject.categoryId
      else if (newProject.categoryId !== undefined) {
        newProject.categoryId = Number(newProject.categoryId);
      }
      // Cas 3: on se rabat sur la valeur du select (string) si rien d'autre
      else {
        newProject.categoryId = Number(categorySelect.value);
      }

      // Assure-toi aussi que newProject.id est number
      if (newProject.id) newProject.id = Number(newProject.id);

      console.log("newProject normalized:", newProject);

      // Ajouter le projet au tableau global et mettre à jour
      allProjects.push(newProject);
      setAllProjects(allProjects);

      // Mettre à jour l'affichage modal + galerie
      displayProject(allProjects);
      displayProjectInModal(allProjects);

      // --- Appliquer le filtre actuellement sélectionné (si existe) ---
      const selectedBtn = document.querySelector(".filter-btn.selected");
      if (selectedBtn) {
        // on suppose que les boutons de filtre ont data-id pour la catégorie
        const selectedCatId = selectedBtn.dataset.id; // undefined pour "tous"
        if (!selectedCatId || selectedBtn.classList.contains("all")) {
          // bouton "tous"
          displayProject(allProjects);
        } else {
          const filtered = allProjects.filter(function (p) {
            // compare numbers pour éviter problèmes de type
            return Number(p.categoryId) === Number(selectedCatId);
          });
          displayProject(filtered);
        }
      } else {
        // pas de bouton sélectionné : affiche tout
        displayProject(allProjects);
      }

      // Revenir à la galerie et reset du formulaire
      switchToGallery();
      resetForm();

      console.log("Projet ajouté :", newProject);
    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Erreur réseau !");
    }
  }

  // --- Modal et édition ---
  function initEditMode() {
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> modifier`;
    navLog.textContent = "Logout";
    titleEdit.appendChild(editBtn);

    editBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    backBtn.addEventListener("click", switchToGallery);
    modalBtn.addEventListener("click", switchToAddPhoto);
    valider.addEventListener("click", handleFormSubmit);
  }

  function openModal() {
    toggle(overlay, true);
    toggle(valider, false);
    displayProjectInModal(allProjects);
  }

  function closeModal() {
    toggle(overlay, false);
  }

  function switchToAddPhoto() {
    toggle(gallerie, false);
    toggle(ajoutPhoto, true);
    titre.textContent = "Ajout photo";
    toggle(modalBtn, false);
    toggle(valider, true);
    backBtn.style.visibility = "visible";
  }

  function switchToGallery() {
    toggle(gallerie, true);
    toggle(ajoutPhoto, false);
    titre.textContent = "Gallerie photo";
    toggle(modalBtn, true);
    toggle(valider, false);
    backBtn.style.visibility = "hidden";
  }

  function displayProjectInModal(projects) {
    const galleryUl = document.querySelector(".gallery_modal ul");
    galleryUl.innerHTML = "";

    projects.forEach(function (project) {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="image_container">
          <img src="${project.imageUrl}" alt="${project.title}" />
          <div class="trash_icon" data-id="${project.id}">
            <i class="fa-solid fa-trash-can"></i>
          </div>
        </div>`;
      galleryUl.appendChild(li);
    });

    galleryUl.addEventListener("click", handleDeleteClick);
  }

  async function handleDeleteClick(e) {
    const trashBtn = e.target.closest(".trash_icon");
    if (!trashBtn) return;

    const projectId = trashBtn.dataset.id;
    const confirmation = confirm("Voulez-vous vraiment supprimer ce projet ?");
    if (!confirmation) return;

    try {
      const response = await fetch(`${API_BASE}works/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const updatedProjects = allProjects.filter(function (p) {
          return p.id != projectId;
        });
        setAllProjects(updatedProjects);
        displayProject(updatedProjects);
        displayProjectInModal(updatedProjects);
      } else {
        alert("Impossible de supprimer le projet.");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  }

  // --- Logout ---
  function logout() {
    localStorage.removeItem("token");
    const editBtn = document.querySelector(".edit-btn");
    if (editBtn) toggle(editBtn, false);
    navLog.innerHTML = `<a href="assets/pages/login.html">login</a>`;
  }

  navLog.addEventListener("click", logout);

  // --- Initialisation ---
  const projects = await loadProject();
  displayProject(projects);
  await initCategorySelect();
  generateFiltersBtn();
  attachFileInputListener();
  if (token) initEditMode();
});
