import { allProjects, categories } from "./projects.js";

const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");

// Fonction pour afficher les projets
export function displayProject(projects) {
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

// Générer les boutons de filtres
export function generateFiltersBtn() {
  const filtersContainer = document.querySelector(".filters");
  filtersContainer.innerHTML = "";

  // Bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("filter-btn", "all", "selected");
  // marque un dataset pour le bouton "tous" si tu veux
  allBtn.dataset.id = "";
  allBtn.addEventListener("click", function () {
    displayProject(allProjects);
    updateSelected(allBtn);
  });
  filtersContainer.appendChild(allBtn);

  // Boutons pour chaque catégorie
  categories.forEach(function (cat) {
    const btn = document.createElement("button");
    btn.classList.add("filter-btn");
    btn.textContent = cat.name;
    btn.dataset.id = String(cat.id); // IMPORTANT : set dataset id (string ok)
    btn.addEventListener("click", function () {
      const filtered = allProjects.filter(function (p) {
        return Number(p.categoryId) === Number(cat.id);
      });
      displayProject(filtered);
      updateSelected(btn);
    });
    filtersContainer.appendChild(btn);
  });
}

// Mettre à jour le bouton sélectionné
function updateSelected(activeBtn) {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  activeBtn.classList.add("selected");
}

// Initialiser l'affichage
displayProject(allProjects);
generateFiltersBtn();
