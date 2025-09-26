// filtre.js
import { allProjects, categories } from "./projects.js";

const gallery = document.querySelector(".gallery");
export const filtersContainer = document.querySelector(".filters");

// --- Affichage des projets ---
export function displayProjects(projects) {
  gallery.innerHTML = "";
  projects.forEach((project) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <img src="${project.imageUrl}" alt="${project.title}" />
      <figcaption>${project.title}</figcaption>
    `;
    gallery.appendChild(figure);
  });
}

// --- Génération des boutons de filtre ---

export function generateFiltersBtn() {
  filtersContainer.innerHTML = "";

  // Bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("filter-btn", "selected");
  allBtn.dataset.id = "all";
  allBtn.addEventListener("click", () => {
    displayProjects(allProjects);
    setActiveButton(allBtn);
  });
  filtersContainer.appendChild(allBtn);

  // Boutons catégories
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.name;
    btn.classList.add("filter-btn");
    btn.dataset.id = cat.id;
    btn.addEventListener("click", () => {
      const filtered = allProjects.filter(
        (p) => Number(p.categoryId) === Number(cat.id)
      );
      displayProjects(filtered);
      setActiveButton(btn);
    });
    filtersContainer.appendChild(btn);
  });
}

// --- Classe active pour le bouton sélectionné ---
function setActiveButton(activeButton) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("selected"));
  activeButton.classList.add("selected");
}
