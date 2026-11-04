export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        const { slug, category } = req.query;

        let query;

        if (slug) {

            query = `*[
                _type == "project" &&
                slug.current == $slug
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

        } else {

            query = `*[_type == "project" &&
                (!defined($category) ||
                category->slug.current == $category)
            ] {
                title,
                "slug": slug.current,
                "imageUrl": mainImage.asset->url,
                "categoryName": category->title,
                "categorySlug": category->slug.current
            }`;

        }

        const params = new URLSearchParams();

        params.set("query", query);
        params.set("$slug", JSON.stringify(slug || null));
        params.set("$category", JSON.stringify(category || null));

        const sanityUrl =
            `https://opobfr0n.api.sanity.io/v2023-05-03/data/query/production?${params.toString()}`;

        const response = await fetch(sanityUrl);

        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: "Sanity request failed",
                sanityStatus: response.status
            });
        }

        const data = await response.json();

        return res.status(200).json({
            success: true,
            ...(slug
                ? { project: data.result }
                : { projects: data.result })
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}