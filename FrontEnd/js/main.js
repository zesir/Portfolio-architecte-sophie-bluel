import { displayProjects, generateFiltersBtn } from "./filtre.js";
import { fillCategorySelect, initForm } from "./form.js";
import { initEditMode } from "./modal.js";
import { allProjects, loadCategories, loadProject } from "./projects.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadProject();
  await loadCategories();
  fillCategorySelect();
  initForm();
  displayProjects(allProjects);
  generateFiltersBtn();
  initEditMode();
});
