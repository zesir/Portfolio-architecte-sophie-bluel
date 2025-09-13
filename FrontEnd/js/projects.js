export let allProjects = [];

export async function loadProject() {
  try {
    const res = await fetch("http://localhost:5678/api/works");
    allProjects = await res.json();
    return allProjects;
  } catch (err) {
    console.error("erreur lors du chargement des projets:", err);
    allProjects = [];
    return [];
  }
}
