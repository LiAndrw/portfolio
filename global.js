console.log('IT’S ALIVE!');

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );

// currentLink?.classList.add('current');


let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/LiAndrw', title: 'GitHub' },
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
      );
    a.toggleAttribute('target', a.host !== location.host);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select>
                <option value="light dark">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </label>`
);
  
const select = document.querySelector('.color-scheme select');

const savedScheme = localStorage.colorScheme || 'light dark';

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    select.value = colorScheme;
}

setColorScheme(savedScheme);

select.addEventListener('input', (event) => {
    const selectedScheme = event.target.value;
    localStorage.colorScheme = selectedScheme;
    setColorScheme(selectedScheme);
});

const form = document.querySelector('form');

form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);

    let url = form.action + '?';

    for (let [name, value] of data) {
        url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
    }

    url = url.slice(0, -1);

    location.href = url;
});


export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
        return [];
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';

    if (!containerElement) {
        console.error('Invalid container element provided.');
        return;
    }

    if (projects.length === 0) {
        containerElement.innerHTML = '<p>No projects available.</p>';
        return;
    }

    for (let project of projects) {
        const article = document.createElement('article');
        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
        `;
        containerElement.appendChild(article);
    }
}


export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/LiAndrw`);
}
