export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(503).json({ error: "Submissions not configured (missing KV env vars)." });
  }

  const limit = Math.min(parseInt(req.query.limit || "200", 10) || 200, 500);

  const key = "zbom:user-submissions";
  const start = 0;
  const stop = limit - 1;

  const endpoint = `${KV_URL.replace(/\/$/, "")}/lrange/${encodeURIComponent(key)}/${start}/${stop}`;

  try {
    const r = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(500).json({ error: "KV read failed", details: data });
    }

    // Upstash returns { result: [ "jsonstring", ... ] }
    const raw = Array.isArray(data.result) ? data.result : [];
    const items = raw
      .map(s => {
        try { return JSON.parse(s); } catch { return null; }
      })
      .filter(Boolean);

    return res.status(200).json({ ok: true, items });
  } catch (e) {
    return res.status(500).json({ error: "List failed" });
  }
}
