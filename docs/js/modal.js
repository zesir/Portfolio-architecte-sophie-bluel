import { displayProjects, filtersContainer } from "./filtre.js";
import { navLog } from "./login.js";
import { allProjects, API_BASE, setAllProjects } from "./projects.js";

const overlay = document.querySelector(".overlay");
const galleryUl = document.querySelector(".gallery_modal ul");
const valider = document.querySelector(".validate-btn");
const addPhoto = document.querySelector(".addPhoto-btn");
const ajoutPhoto = document.querySelector(".ajout-photo");
const gallerie = document.querySelector(".gallery-photo");
const backBtn = document.querySelector(".return_icon");
const titre = document.querySelector(".header__modal h3");
const template = document.getElementById("project-template");

export function toggle(el, show, displayType = "flex") {
  if (!el) return;
  el.style.display = show ? displayType : "none";
}

export function initEditMode() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const titleEdit = document.querySelector(".title-edit");

  toggle(filtersContainer, false);

  // bouton "modifier"
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> modifier`;

  navLog.textContent = "Logout";
  titleEdit.appendChild(editBtn);

  editBtn.addEventListener("click", openModal);

  // fermer la modale
  const closeBtn = document.querySelector(".cross_icon");
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  closeBtn.addEventListener("click", closeModal);
}

function openModal() {
  toggle(overlay, true);
  toggle(valider, false);
  displayProjectsInModal(allProjects);
}

function closeModal() {
  toggle(overlay, false);
  switchToGallery();
}

function switchToGallery() {
  toggle(gallerie, true);
  toggle(ajoutPhoto, false);
  titre.textContent = "Gallerie photo";
  toggle(addPhoto, true);
  toggle(valider, false);
  backBtn.style.visibility = "hidden";
}
backBtn.addEventListener("click", () => {
  switchToGallery();
});

function switchToAddPhoto() {
  toggle(gallerie, false);
  toggle(ajoutPhoto, true);
  titre.textContent = "Ajout photo";
  toggle(addPhoto, false);
  toggle(valider, true);
  backBtn.style.visibility = "visible";
}

addPhoto.addEventListener("click", () => {
  switchToAddPhoto();
});

// affichage dans la modale
export function displayProjectsInModal(projects) {
  galleryUl.innerHTML = "";

  projects.forEach((project) => {
    const clone = template.content.cloneNode(true);

    // Modifier le clone avec les infos du projet
    const img = clone.querySelector("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const trash = clone.querySelector(".trash_icon");
    trash.dataset.id = project.id;

    galleryUl.appendChild(clone);
  });

  // gestion suppression
  galleryUl.addEventListener("click", handleDeleteClick);
}

// suppression projet
async function handleDeleteClick(e) {
  const trashBtn = e.target.closest(".trash_icon");
  if (!trashBtn) return;

  const projectId = trashBtn.dataset.id;
  const token = localStorage.getItem("token");

  const confirmation = confirm("Voulez-vous vraiment supprimer ce projet ?");
  if (!confirmation) return;

  try {
    const response = await fetch(`${API_BASE}works/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Erreur API :", errText);
      alert("Impossible de supprimer le projet.");
      return;
    }

    // suppression côté front
    const updatedProjects = allProjects.filter((p) => p.id != projectId);
    setAllProjects(updatedProjects);
    displayProjects(updatedProjects);
    displayProjectsInModal(updatedProjects);
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
}
