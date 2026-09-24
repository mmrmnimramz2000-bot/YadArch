const urlParams = new URLSearchParams(
    window.location.search
);

const slug = urlParams.get('slug');

console.log("PROJECT SLUG:", slug);


// ==========================================
// Load Project
// ==========================================

async function loadProject() {

    const titleElement =
        document.getElementById('project-title');

    const categoryElement =
        document.getElementById('project-category');

    const categoryNameElement =
        document.getElementById('project-category-name');

    const mainImageElement =
        document.getElementById('project-main-image');

    const roleElement =
        document.getElementById('project-role');

    const areaElement =
        document.getElementById('project-area');

    const yearElement =
        document.getElementById('project-year');

    const cityElement =
        document.getElementById('project-city');

    const galleryElement =
        document.getElementById('project-gallery');


    // ==========================================
    // Check slug
    // ==========================================

    if (!slug) {

        titleElement.innerText =
            "Project not found";

        return;
    }


    // ==========================================
    // Sanity GROQ Query
    // ==========================================

    const query = `*[
        _type == "project" &&
        slug.current == "${slug}"
    ][0] {

        title,

        slug,

        year,

        city,

        area,

        role,

        "categoryName": category->title,

        "mainImageUrl": mainImage.asset->url,

        "galleryUrls": gallery[].asset->url

    }`;


    console.log("QUERY:", query);


    try {

        // ==========================================
        // Create API URL
        // ==========================================

        const apiUrl =
            'https://opobfr0n.api.sanity.io/v2023-05-03/data/query/production?query='
            + encodeURIComponent(query);


        // ==========================================
        // Fetch
        // ==========================================

        const response =
            await fetch(apiUrl);


        console.log("RESPONSE:", response);


        if (!response.ok) {

            throw new Error(
                `HTTP ERROR: ${response.status}`
            );

        }


        // ==========================================
        // JSON
        // ==========================================

        const data =
            await response.json();


        console.log(
            "SANITY PROJECT:",
            data
        );


        const project =
            data.result;


        // ==========================================
        // Project not found
        // ==========================================

        if (!project) {

            titleElement.innerText =
                "Project not found";

            return;
        }


        // ==========================================
        // Project Information
        // ==========================================

        titleElement.innerText =
            project.title || '';


        categoryElement.innerText =
            project.categoryName || '';


        categoryNameElement.innerText =
            project.categoryName || '';


        roleElement.innerText =
            project.role || '';


        areaElement.innerText =
            project.area
                ? `${project.area} m²`
                : '';


        yearElement.innerText =
            project.year || '';


        cityElement.innerText =
            project.city || '';


        // ==========================================
        // Main Image
        // ==========================================

        if (project.mainImageUrl) {

            mainImageElement.src =
                project.mainImageUrl;

            mainImageElement.alt =
                project.title || '';

        }


        // ==========================================
        // Gallery
        // ==========================================

        galleryElement.innerHTML = '';


        if (
            project.galleryUrls &&
            project.galleryUrls.length > 0
        ) {

            project.galleryUrls.forEach(
                (imageUrl) => {

                    const photo =
                        document.createElement('div');

                    photo.className =
                        'col res_photo';


                    photo.innerHTML = `

                        <img
                            src="${imageUrl}"
                            alt="${project.title || ''}"
                            class="w-100 object-fit-cover"
                        >

                    `;


                    galleryElement.appendChild(
                        photo
                    );

                }
            );

        }


        console.log(
            "PROJECT LOADED SUCCESSFULLY"
        );

    }


    catch (error) {

        console.error(
            "PROJECT ERROR:",
            error
        );


        titleElement.innerText =
            "Error loading project";

    }

}


// ==========================================
// Start
// ==========================================

loadProject();