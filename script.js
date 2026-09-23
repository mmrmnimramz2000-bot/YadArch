import { createClient } from 'https://esm.sh/@sanity/client';

const client = createClient({
    projectId: 'opobfr0n',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-05-03',
});

async function fetchAndDisplayProjects() {

    const grid = document.getElementById('projects-grid');

    if (!grid) return;

    grid.innerHTML = `
        <div class="col-12 text-center">
            <p>در حال بارگذاری...</p>
        </div>
    `;

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    let query = `*[_type == "project"`;

    if (categoryFromUrl) {
        query += ` && category->slug.current == "${categoryFromUrl}"`;
    }

    query += `] {
        title,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        "categoryName": category->title
    }`;

    try {

        const projects = await client.fetch(query);

        if (projects.length === 0) {

            grid.innerHTML = `
                <div class="col-12 text-center">
                    <p>پروژه‌ای یافت نشد.</p>
                </div>
            `;

            return;
        }

        grid.innerHTML = '';

        projects.forEach(project => {

            const projectCard = `
                <div class="col">

                    <a class="card h-100"
                       href="Proj/${project.slug}.html">

                        <img
                            src="${project.imageUrl}"
                            class="card-img-top"
                            alt="${project.title}"
                        >

                        <div class="card-body">

                            <h5 class="card-title">
                                ${project.title}
                            </h5>

                            <p class="card-text">
                                ${project.categoryName || ''}
                            </p>

                        </div>

                    </a>

                </div>
            `;

            grid.innerHTML += projectCard;
        });

    } catch (error) {

        console.error("Error fetching projects:", error);

        grid.innerHTML = `
            <div class="col-12 text-center">
                <p>خطا در بارگذاری داده‌ها.</p>
            </div>
        `;
    }
}

document.addEventListener(
    'DOMContentLoaded',
    fetchAndDisplayProjects
);