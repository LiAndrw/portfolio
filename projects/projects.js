import { fetchJSON, renderProjects } from '../global.js';
const projectsContainer = document.querySelector('.projects');

async function loadProjects() {
    const projects = await fetchJSON('../lib/projects.json');
    renderProjects(projects, projectsContainer, 'h2');

    // Update the project count in the heading
    const projectCountElement = document.querySelector('.projects-title');
    if (projectCountElement) {
        projectCountElement.textContent = `Projects (${projects.length})`;
    }
}

loadProjects();