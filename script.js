console.log("SCRIPT.JS LOADED");

async function fetchAndDisplayProjects() {

    console.log("FETCH FUNCTION STARTED");

    const grid = document.getElementById('projects-grid');

    if (!grid) {
        console.log("GRID NOT FOUND");
        return;
    }

    // گرفتن category از URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    console.log("CATEGORY FROM URL:", categoryFromUrl);


    // =========================
    // ساخت Query
    // =========================

    let query = `*[_type == "project"`;

    if (categoryFromUrl) {
        query += ` && category->slug.current == "${categoryFromUrl}"`;
    }

    query += `] {
        title,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        "categoryName": category->title,
        "categorySlug": category->slug.current
    }`;


    console.log("QUERY:", query);


    try {

        grid.innerHTML = `
            <div class="col-12 text-center">
                <p>در حال بارگذاری...</p>
            </div>
        `;


        // =========================
        // Sanity API
        // =========================

        const apiUrl =
            'https://opobfr0n.api.sanity.io/v2023-05-03/data/query/production?query='
            + encodeURIComponent(query);


        console.log("API URL:", apiUrl);


        const response = await fetch(apiUrl);


        if (!response.ok) {
            throw new Error(`HTTP ERROR: ${response.status}`);
        }


        const data = await response.json();


        console.log("SANITY DATA:", data);


        const projects = data.result;


        console.log("PROJECTS:", projects);
        console.log("PROJECTS LENGTH:", projects.length);


        // =========================
        // اگر پروژه‌ای پیدا نشد
        // =========================

        if (projects.length === 0) {

            grid.innerHTML = `
                <div class="col-12 text-center">
                    <p>پروژه‌ای در این دسته‌بندی یافت نشد.</p>
                </div>
            `;

            return;
        }


        // =========================
        // نمایش پروژه‌ها
        // =========================

        grid.innerHTML = '';


        projects.forEach(project => {

            console.log("CREATING CARD:", project);


            const projectCard = `
                <div class="col">

                    <a
                        href="Proj/${project.slug}.html"
                        class="card h-100 text-decoration-none"
                    >

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


        console.log("CARDS CREATED");

    }

    catch (error) {

        console.error("SANITY ERROR:", error);


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