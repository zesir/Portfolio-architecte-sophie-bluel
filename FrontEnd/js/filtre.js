console.log("Script loaded successfully.");

const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");

let allProjects = [];

// connection avec l'api
fetch("http://localhost:5678/api/works")
  .then((Response) => Response.json())
  .then((resultat) => {
    allProjects = resultat;
    console.log(allProjects);
    displayProjects(allProjects);
    generateFilterButtons(allProjects); // générer les boutons de filtre
  });

//affiche tous les projets
function displayProjects(projects) {
  gallery.innerHTML = ""; // on vide la gallerie
  projects.forEach((project) => {
    const figure = document.createElement("figure");
    figure.innerHTML = ` 
    <img src="${project.imageUrl}" alt="${project.title}" />
    <figcaption>${project.title}</figcaption>
    `;
    gallery.appendChild(figure);
  });
}
//génère les boutons de filtres par catégories
function generateFilterButtons(projects) {
  filtersContainer.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.textContent = "tous";
  allButton.classList.add("filter-btn", "selected");
  allButton.addEventListener("click", () => {
    displayProjects(allProjects);
    document
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.remove("selected"));
    allButton.classList.add("selected");
  });
  filtersContainer.appendChild(allButton);

  const categories = [...new Set(projects.map((p) => p.category.name))]; // on recupere le nom des catégories dans un tableau
  console.log(categories);
  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.classList.add("filter-btn");
    button.textContent = cat;
    button.addEventListener("click", () => {
      filterProjects(cat); //appel de la fonction filterProject
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
    });

    filtersContainer.appendChild(button);
  });

  function filterProjects(categoryName) {
    const filtered = allProjects.filter(
      (project) => project.category.name === categoryName
    );
    displayProjects(filtered);
  }
}
