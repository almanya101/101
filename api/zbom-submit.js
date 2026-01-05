export default async function handler(req, res) {
  // CORS basic (same-origin default; keep it simple)
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(503).json({ error: "Submissions not configured (missing KV env vars)." });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const title = String(body.title || "").trim().slice(0, 140);
  const url = String(body.url || "").trim().slice(0, 500);
  const note = String(body.note || "").trim().slice(0, 800);
  const category = String(body.category || "tools").trim().slice(0, 60);
  const img = String(body.img || "").trim().slice(0, 500);

  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required." });
  }
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "URL must start with http:// or https:// (client adds https:// automatically)." });
  }

  // simple bot trap (optional)
  if (body.website) {
    return res.status(400).json({ error: "Nope." });
  }

  const now = Date.now();
  const id = `u-${now}-${Math.random().toString(16).slice(2)}`;

  const item = {
    id,
    title,
    url,
    note,
    category,
    img: img || "",
    createdAt: now
  };

  // Store as JSON string in a Redis list
  // Key: zbom:user-submissions
  const key = "zbom:user-submissions";
  const value = encodeURIComponent(JSON.stringify(item));

  const endpoint = `${KV_URL.replace(/\/$/, "")}/lpush/${encodeURIComponent(key)}/${value}`;

  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(500).json({ error: "KV write failed", details: data });
    }

    return res.status(200).json({ ok: true, item });
  } catch (e) {
    return res.status(500).json({ error: "Submit failed" });
  }
}
