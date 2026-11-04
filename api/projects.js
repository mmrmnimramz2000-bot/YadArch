export default async function handler(req, res) {
    try {
        const category = req.query.category;

        let query = `*[_type == "project"`;

        if (category) {
            query += ` && category->slug.current == "${category}"`;
        }

        query += `] {
            title,
            "slug": slug.current,
            "imageUrl": mainImage.asset->url,
            "categoryName": category->title,
            "categorySlug": category->slug.current
        }`;

        const sanityUrl =
            "https://opobfr0n.api.sanity.io/v2023-05-03/data/query/production?query="
            + encodeURIComponent(query);

        const response = await fetch(sanityUrl);

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: "Sanity connection failed"
            });
        }

        const data = await response.json();

        return res.status(200).json({
            success: true,
            projects: data.result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}