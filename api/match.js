
export default async function handler(req, res) {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    return res.status(500).json({
      error: "API key is not configured"
    });
  }

  const id = String(req.query.id || "");
  const type = String(req.query.type || "details");

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: "Invalid fixture ID"
    });
  }

  const endpoints = {
    details: "fixtures",
    statistics: "fixtures/statistics",
    lineups: "fixtures/lineups",
    events: "fixtures/events"
  };

  if (!Object.prototype.hasOwnProperty.call(endpoints, type)) {
    return res.status(400).json({
      error: "Invalid match data type"
    });
  }

  try {
    const url = new URL(
      `https://v3.football.api-sports.io/${endpoints[type]}`
    );

    url.searchParams.set(
      type === "details" ? "id" : "fixture",
      id
    );

    const response = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": key
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Football API request failed"
      });
    }

    if (data.errors && Object.keys(data.errors).length) {
      return res.status(502).json({
        error: "Football API returned an error"
      });
    }

    return res.status(200).json({
      type,
      results: data.results || 0,
      data: data.response || []
    });

  } catch (error) {
    return res.status(500).json({
      error: "Unable to load match information"
    });
  }
}
