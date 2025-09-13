export let allProjects = [];
export let categories = []; // ajouter la variable categories
export const API_BASE = "http://localhost:5678/api/";

// Charger les projets
export async function loadProject() {
  try {
    const res = await fetch(`${API_BASE}works`);
    allProjects = await res.json();
    return allProjects;
  } catch (err) {
    console.error("erreur lors du chargement des projets:", err);
    allProjects = [];
    return [];
  }
}

// Charger les catégories
export async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}categories`);
    categories = await res.json();
    return categories;
  } catch (err) {
    console.error("erreur lors du chargement des catégories :", err);
    categories = [];
    return [];
  }
}

// Setter pour mettre à jour allProjects
export function setAllProjects(newProjects) {
  allProjects = newProjects;
}
