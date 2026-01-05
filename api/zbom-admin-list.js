// =========================================================
// FILE: /api/zbom-admin-list.js
// GET /api/zbom-admin-list?which=inbox|moved|rejected&limit=200
// Requires: x-zbom-admin-key
// =========================================================

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ADMIN_KEY = process.env.ZBOM_ADMIN_KEY || "";

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function mustEnv(res) {
  if (!KV_URL || !KV_TOKEN) {
    send(res, 503, { error: "KV env missing (KV_REST_API_URL / KV_REST_API_TOKEN)" });
    return false;
  }
  if (!ADMIN_KEY) {
    send(res, 500, { error: "ZBOM_ADMIN_KEY missing on server" });
    return false;
  }
  return true;
}

function auth(req, res) {
  const provided = String(req.headers["x-zbom-admin-key"] || "");
  if (provided !== ADMIN_KEY) {
    send(res, 401, { error: "Unauthorized" });
    return false;
  }
  return true;
}

function listKey(which) {
  if (which === "moved") return "zbom:moved";
  if (which === "rejected") return "zbom:rejected";
  return "zbom:user-submissions"; // inbox
}

async function kvGetJSON(url) {
  const r = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || "KV request failed");
  return j;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Method not allowed" });
  if (!mustEnv(res)) return;
  if (!auth(req, res)) return;

  const which = String(req.query.which || "inbox").trim();
  const limitRaw = parseInt(String(req.query.limit || "200"), 10);
  const limit = Math.min(Math.max(isNaN(limitRaw) ? 200 : limitRaw, 1), 500);

  const key = listKey(which);
  const base = KV_URL.replace(/\/$/, "");
  const endpoint = `${base}/lrange/${encodeURIComponent(key)}/0/${limit - 1}`;

  try {
    const data = await kvGetJSON(endpoint);
    const raw = Array.isArray(data.result) ? data.result : [];
    const items = raw
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return send(res, 200, { ok: true, items });
  } catch (e) {
    return send(res, 500, { error: e.message || "List failed" });
  }
}
