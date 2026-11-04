export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://opobfr0n.api.sanity.io/v2023-05-03/data/query/production?query=*%5B_type%20%3D%3D%20%22project%22%5D%5B0%5D%7Btitle%7D"
    );

    const result = await response.text();

    return res.status(200).json({
      success: response.ok,
      sanityStatus: response.status,
      response: response.ok ? result : "Sanity request was rejected"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}