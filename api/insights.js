export default async function handler(req, res) {
  try {
    const CODE = process.env.GOATCOUNTER_CODE;   // ubterzioglude
    const TOKEN = process.env.GOATCOUNTER_TOKEN; // API key

    if (!CODE || !TOKEN) {
      return res.status(500).json({ error: "Missing GOATCOUNTER_CODE or GOATCOUNTER_TOKEN" });
    }

    // ?days=7 / 30 / 90 (default 30)
    const days = Math.max(1, Math.min(365, parseInt(req.query.days || "30", 10)));
    const end = new Date();
    const start = new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    const iso = (d) => d.toISOString().slice(0, 10);

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`, // GoatCounter auth
    };

    const fetchStats = async (page) => {
      const url =
        `https://${CODE}.goatcounter.com/api/v0/stats/${page}` +
        `?start=${encodeURIComponent(iso(start))}&end=${encodeURIComponent(iso(end))}`;

      const r = await fetch(url, { headers });
      if (!r.ok) throw new Error(`${page}:${r.status}`);
      return r.json();
    };

    // These map exactly to what you see in the dashboard
    const [toprefs, browsers, systems, locations, sizes] = await Promise.all([
      fetchStats("toprefs"),
      fetchStats("browsers"),
      fetchStats("systems"),
      fetchStats("locations"),
      fetchStats("sizes"),
    ]);

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
    return res.status(200).json({
      rangeDays: days,
      start: iso(start),
      end: iso(end),
      toprefs,
      browsers,
      systems,
      locations,
      sizes,
    });
  } catch (e) {
    return res.status(500).json({ error: "insights_failed" });
  }
}
