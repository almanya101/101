// =========================================================
// FILE: /api/zbom-admin-update.js
// POST /api/zbom-admin-update
// body: { action: "move"|"reject"|"restore", item: {...}, from?: "moved"|"rejected" }
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

function keyFor(which) {
  if (which === "moved") return "zbom:moved";
  if (which === "rejected") return "zbom:rejected";
  return "zbom:user-submissions"; // inbox
}

async function kvCall(url, method) {
  const r = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || "KV request failed");
  return j;
}

function enc(obj) {
  return encodeURIComponent(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!mustEnv(res)) return;
  if (!auth(req, res)) return;

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return send(res, 400, { error: "Invalid JSON" });
  }

  const action = String(body.action || "").trim();
  const item = body.item;

  if (!item || typeof item !== "object") return send(res, 400, { error: "Missing item" });

  const base = KV_URL.replace(/\/$/, "");
  const inboxKey = keyFor("inbox");
  const movedKey = keyFor("moved");
  const rejectedKey = keyFor("rejected");

  try {
    if (action === "move") {
      // inbox -> moved
      await kvCall(`${base}/lpush/${encodeURIComponent(movedKey)}/${enc(item)}`, "POST");
      await kvCall(`${base}/lrem/${encodeURIComponent(inboxKey)}/1/${enc(item)}`, "POST");
      return send(res, 200, { ok: true });
    }

    if (action === "reject") {
      // inbox -> rejected
      await kvCall(`${base}/lpush/${encodeURIComponent(rejectedKey)}/${enc(item)}`, "POST");
      await kvCall(`${base}/lrem/${encodeURIComponent(inboxKey)}/1/${enc(item)}`, "POST");
      return send(res, 200, { ok: true });
    }

    if (action === "restore") {
      // moved/rejected -> inbox
      const from = String(body.from || "").trim();
      if (!["moved", "rejected"].includes(from)) return send(res, 400, { error: "Invalid from" });

      const fromKey = keyFor(from);
      await kvCall(`${base}/lpush/${encodeURIComponent(inboxKey)}/${enc(item)}`, "POST");
      await kvCall(`${base}/lrem/${encodeURIComponent(fromKey)}/1/${enc(item)}`, "POST");
      return send(res, 200, { ok: true });
    }

    return send(res, 400, { error: "Invalid action" });
  } catch (e) {
    return send(res, 500, { error: e.message || "Update failed" });
  }
}
