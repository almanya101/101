import { json, upstash, safeId, sanitizeText } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  let body = {};
  try { body = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}"); }
  catch { return json(res, 400, { error: "Invalid JSON" }); }

  const id = safeId(body.id);
  const text = sanitizeText(body.text);
  if (!id || !text) return json(res, 400, { error: "Invalid payload" });

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    "unknown";

  const rlKey = `smellable:rl:comment:${id}:${ip}`;

  try {
    const hit = await upstash(`INCR/${encodeURIComponent(rlKey)}`);
    if (Number(hit?.result || 0) === 1) {
      await upstash(`EXPIRE/${encodeURIComponent(rlKey)}/10`);
    } else {
      return json(res, 429, { error: "Too many comments. Slow down." });
    }

    const commentsKey = `smellable:comments:${id}`;
    const comment = { id: `c_${Math.random().toString(16).slice(2)}`, text, ts: Date.now() };
    await upstash(`LPUSH/${encodeURIComponent(commentsKey)}/${encodeURIComponent(JSON.stringify(comment))}`);
    await upstash(`LTRIM/${encodeURIComponent(commentsKey)}/0/49`);
    return json(res, 200, comment);
  } catch (e) {
    return json(res, 500, { error: "Server error", detail: String(e?.message || e) });
  }
}
