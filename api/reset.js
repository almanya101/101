import { json, upstash, safeId } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const adminKey = process.env.SMELLABLE_ADMIN_KEY;
  const provided = req.headers["x-admin-key"] || req.headers["X-Admin-Key"];

  if (!adminKey || provided !== adminKey) {
    return json(res, 401, { error: "Unauthorized" });
  }

  let body = {};
  try { body = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}"); }
  catch { return json(res, 400, { error: "Invalid JSON" }); }

  const id = safeId(body.id);
  if (!id) return json(res, 400, { error: "Invalid id" });

  const votesKey = `smellable:votes:${id}`;
  const commentsKey = `smellable:comments:${id}`;

  try {
    await upstash(`DEL/${encodeURIComponent(votesKey)}`);
    await upstash(`DEL/${encodeURIComponent(commentsKey)}`);
    return json(res, 200, { ok: true, id });
  } catch (e) {
    return json(res, 500, { error: "Server error", detail: String(e?.message || e) });
  }
}
