import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projectsContainer = document.querySelector('.projects');

async function loadProjects() {
    const projects = await fetchJSON('../lib/projects.json');
    renderProjects(projects, projectsContainer, 'h2');

    const projectCountElement = document.querySelector('.projects-title');
    if (projectCountElement) {
        projectCountElement.textContent = `Projects (${projects.length})`;
    }

    renderPieChart(projects);
}

let projects = [
        {
            title: "League of Legends Esports Void Grubs Impact Analysis.",
            year: 2024,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi blanditiis assumenda laborum cupiditate aliquid sit, ut perspiciatis eos libero nobis maxime perferendis! Deleniti totam blanditiis reiciendis ut obcaecati ducimus possimus!"
        },
        {
            title: "Shakespeare Sentence Prediction Language Model.",
            year: 2024,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Nobis tempore, quasi veritatis quod excepturi totam distinctio perspiciatis quo rerum officiis exercitationem laudantium ad, harum, nihil nemo atque! Iste sed ipsum sunt autem commodi quae facilis explicabo accusamus eveniet!"
        },
        {
            title: "US City Sunshine Trend Analysis.",
            year: 2025,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Voluptate autem ab tempora ipsa pariatur nulla libero laudantium! Fugiat, assumenda non nulla praesentium eius cupiditate eos at dolores iusto laudantium animi qui architecto? Quaerat assumenda praesentium quae corrupti repellendus!"
        },
        {
            title: "ECON 120A Class Data Analysis.",
            year: 2024,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Unde, dolor ipsa ea debitis dignissimos exercitationem veritatis eveniet quod pariatur sunt, dolores, enim eius illo. Ipsum veritatis cupiditate eligendi reiciendis maxime doloribus ea officia voluptatum deserunt illum, magnam totam?"
        },
        {
            title: "WW1 Red Cross Artifact and Poster Research.",
            year: 2023,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Quam fugit doloremque sequi mollitia sunt, beatae perferendis aut minima pariatur obcaecati, iusto quaerat laborum, debitis porro. Modi ea amet iusto excepturi minus, optio consequatur debitis aspernatur perferendis assumenda voluptatum."
        },
        {
            title: "DSC80 Class Grade Calculation Project.",
            year: 2024,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Ut eaque assumenda voluptas quia, maxime pariatur reprehenderit animi, repudiandae nisi harum dolores voluptatem ipsa. Aliquid, error? Quae neque cumque illo similique! Esse, consequuntur nihil! Consequuntur placeat molestias repellat laborum."
        },
        {
            title: "Loan Application Data Analysis.",
            year: 2024,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Excepturi quas ut impedit placeat nostrum atque quia suscipit dolorum dolore nobis velit sunt eum adipisci doloremque numquam soluta beatae officia necessitatibus laudantium cumque tenetur, similique praesentium. Laboriosam, qui. Ab."
        },
        {
            title: "Song Relation Search Engine Project.",
            year: 2023,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Cupiditate perferendis, reiciendis laboriosam ipsum non assumenda repudiandae esse ea tempore quas officia ipsam atque! Eius asperiores amet, quibusdam rem cumque corporis sunt voluptatum mollitia vel neque eos corrupti iste."
        },
        {
            title: "KNN Image Prediction Model and Modifier",
            year: 2024,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Perspiciatis eaque explicabo omnis praesentium nesciunt quam ipsum alias, reprehenderit ipsam qui aperiam beatae repellat? Earum, nam praesentium ducimus impedit dignissimos ipsam, facilis ex enim a eveniet quaerat, libero amet."
        },
        {
            title: "IBI and Body Temperature of High Blood Sugar Individuals Data Analysis.",
            year: 2025,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Maiores, deserunt voluptate placeat quidem inventore quis repudiandae cumque error. Iure assumenda dignissimos hic doloribus at modi ut aut? Minima iusto laborum alias nesciunt doloremque iste nostrum provident asperiores doloribus."
        },
        {
            title: "Binary Tree Implementation Project.",
            year: 2024,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Quisquam saepe, praesentium quam a perspiciatis optio ullam amet molestiae consectetur minus iste nisi repellendus maxime vitae exercitationem. Eum vero provident corrupti eos culpa, rem ex laborum ad animi amet!"
        },
        {
            title: "KNN Number Image Prediction Model.",
            year: 2024,
            image: "https://vis-society.github.io/labs/2/images/empty.svg",
            description: "Fugit laborum nostrum quisquam quas neque deserunt sequi enim voluptas. Eligendi natus neque, asperiores culpa assumenda eius? Suscipit sit, corrupti dolorem ad soluta, ex, itaque assumenda nam vero minima dicta."
        }
];

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let newSVG = d3.select('svg');

    newSVG.selectAll('path').remove();

    let legend = d3.select('.legend');
    legend.selectAll('li').remove();

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));

    arcs.forEach((arc, idx) => {
        newSVG.append("path")
            .attr("d", arc)
            .attr("fill", colors(idx))
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;

                newSVG.selectAll('path')
                    .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

                legend.selectAll('li')
                    .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    const selectedYear = data[selectedIndex].label;
                    const filteredProjects = projects.filter(project => project.year === parseInt(selectedYear));
                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }
            });
    });

    data.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr("class", "legend-item")
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;

                newSVG.selectAll('path')
                    .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

                legend.selectAll('li')
                    .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    const selectedYear = data[selectedIndex].label;
                    const filteredProjects = projects.filter(project => project.year === parseInt(selectedYear));
                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }
            });
    });
}

let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    query = event.target.value;

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    renderProjects(filteredProjects, projectsContainer, 'h2');

    renderPieChart(filteredProjects);
});


loadProjects();
