
export default async function handler(req, res) {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    return res.status(500).json({
      error: "API key is not configured"
    });
  }

  const date = req.query.date;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      error: "Invalid date"
    });
  }

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Africa/Tunis`,
      {
        headers: {
          "x-apisports-key": key
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Football API request failed"
      });
    }

    return res.status(200).json({
      matches: data.response || [],
      results: data.results || 0
    });

  } catch (error) {
    return res.status(500).json({
      error: "Unable to load matches"
    });
  }
}
