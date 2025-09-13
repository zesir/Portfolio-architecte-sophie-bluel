import { allProjects, loadProject } from "./projects.js";

const gallery = document.querySelector(".gallery");

export function displayProject(projects) {
  gallery.innerHTML = "";
  projects.forEach((project) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}" />
    <figcaption>${project.title}<figcaption/>`;
    gallery.appendChild(figure);
  });
}
async function init() {
  await loadProject();
  displayProject(allProjects);
}
init();

async function generateFiltersBtn() {
  const filtersContainer = document.querySelector(".filters");
  filtersContainer.innerHTML = "";
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    const categories = await res.json();

    const allBtn = document.createElement("button");
    allBtn.textContent = "tous";
    allBtn.classList.add("filter-btn", "selected");
    allBtn.addEventListener("click", () => {
      displayProject(allProjects);
      updateSelected(allBtn);
    });
    filtersContainer.appendChild(allBtn);
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.classList.add("filter-btn");
      btn.textContent = cat.name;
      btn.addEventListener("click", () => {
        const filtered = allProjects.filter((p) => p.categoryId === cat.id);
        displayProject(filtered);
        updateSelected(btn);
      });
      filtersContainer.appendChild(btn);
    });
  } catch (err) {
    console.error("erreur de chargement des catégories", err);
  }
}
function updateSelected(activeBtn) {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  activeBtn.classList.add("selected");
}
generateFiltersBtn();
