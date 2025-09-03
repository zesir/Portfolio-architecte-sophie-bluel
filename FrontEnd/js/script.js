console.log("Script loaded successfully.");

const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");

let allProjects = [];

fetch("http://localhost:5678/api/works")
  .then((Response) => Response.json())
  .then((resultat) => {
    allProjects = resultat;
    console.log(allProjects);
    displayProjects(allProjects);
  });

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
