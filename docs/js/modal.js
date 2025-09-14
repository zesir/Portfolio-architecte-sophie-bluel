import { displayProjects } from "./filtre.js";
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

export function toggle(el, show, displayType = "flex") {
  if (!el) return;
  el.style.display = show ? displayType : "none";
}

export function initEditMode() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const titleEdit = document.querySelector(".title-edit");

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

  // gestion suppression
  galleryUl.addEventListener("click", handleDeleteClick);
}

// suppression projet
async function handleDeleteClick(e) {
  const trashBtn = e.target.closest(".trash_icon");
  if (!trashBtn) return;

  const projectId = trashBtn.dataset.id;
  const confirmation = confirm("Voulez-vous vraiment supprimer ce projet ?");
  if (!confirmation) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}works/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const updatedProjects = allProjects.filter((p) => p.id != projectId);
      setAllProjects(updatedProjects);
      displayProjects(updatedProjects);
      displayProjectsInModal(updatedProjects);
    } else {
      alert("Impossible de supprimer le projet.");
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
}
