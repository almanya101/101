// =========================================================
// FILE: /api/zbom-admin-action.js
// PURPOSE:
// - GET list: inbox/moved/rejected
// - POST actions: move/reject/restore
// - Requires admin key for POST (x-zbom-admin-key)
// STORAGE: Upstash via KV REST env vars
// =========================================================

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const ADMIN_KEY = process.env.ZBOM_ADMIN_KEY || ""; // you must set this

function ok(res, code, body) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function mustKV(res) {
  if (!KV_URL || !KV_TOKEN) {
    ok(res, 503, { error: "KV not configured" });
    return false;
  }
  return true;
}

function keyFor(which) {
  if (which === "moved") return "zbom:moved";
  if (which === "rejected") return "zbom:rejected";
  return "zbom:user-submissions"; // inbox
}

async function kvFetch(endpoint, method = "GET") {
  const r = await fetch(endpoint, {
    method,
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || "KV request failed");
  return j;
}

function encodeVal(obj) {
  return encodeURIComponent(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (!mustKV(res)) return;

  // ---------------- GET: list ----------------
  if (req.method === "GET") {
    const fn = String(req.query.fn || "").trim();
    if (fn !== "list") return ok(res, 400, { error: "Invalid fn" });

    const which = String(req.query.which || "inbox").trim();
    const limit = Math.min(parseInt(req.query.limit || "200", 10) || 200, 500);

    const key = keyFor(which);
    const endpoint = `${KV_URL.replace(/\/$/, "")}/lrange/${encodeURIComponent(key)}/0/${limit - 1}`;

    try {
      const data = await kvFetch(endpoint, "GET");
      const raw = Array.isArray(data.result) ? data.result : [];
      const items = raw.map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      }).filter(Boolean);

      return ok(res, 200, { ok: true, items });
    } catch (e) {
      return ok(res, 500, { error: e.message || "list failed" });
    }
  }

  // ---------------- POST: actions ----------------
  if (req.method === "POST") {
    // auth
    const provided = String(req.headers["x-zbom-admin-key"] || "");
    if (!ADMIN_KEY) return ok(res, 500, { error: "ZBOM_ADMIN_KEY missing on server" });
    if (provided !== ADMIN_KEY) return ok(res, 401, { error: "Unauthorized" });

    let body = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    } catch {
      return ok(res, 400, { error: "Invalid JSON" });
    }

    const fn = String(body.fn || "").trim();
    const item = body.item;

    if (!item || typeof item !== "object") return ok(res, 400, { error: "Missing item" });

    const inboxKey = keyFor("inbox");
    const movedKey = keyFor("moved");
    const rejectedKey = keyFor("rejected");

    try {
      if (fn === "move") {
        // LPUSH moved, LREM inbox
        const lpush = `${KV_URL.replace(/\/$/, "")}/lpush/${encodeURIComponent(movedKey)}/${encodeVal(item)}`;
        const lrem = `${KV_URL.replace(/\/$/, "")}/lrem/${encodeURIComponent(inboxKey)}/1/${encodeVal(item)}`;
        await kvFetch(lpush, "POST");
        await kvFetch(lrem, "POST");
        return ok(res, 200, { ok: true });
      }

      if (fn === "reject") {
        const lpush = `${KV_URL.replace(/\/$/, "")}/lpush/${encodeURIComponent(rejectedKey)}/${encodeVal(item)}`;
        const lrem = `${KV_URL.replace(/\/$/, "")}/lrem/${encodeURIComponent(inboxKey)}/1/${encodeVal(item)}`;
        await kvFetch(lpush, "POST");
        await kvFetch(lrem, "POST");
        return ok(res, 200, { ok: true });
      }

      if (fn === "restore") {
        // restore from moved/rejected back to inbox
        const from = String(body.from || "").trim();
        if (!["moved", "rejected"].includes(from)) {
          return ok(res, 400, { error: "Invalid from" });
        }
        const fromKey = keyFor(from);
        const lpush = `${KV_URL.replace(/\/$/, "")}/lpush/${encodeURIComponent(inboxKey)}/${encodeVal(item)}`;
        const lrem = `${KV_URL.replace(/\/$/, "")}/lrem/${encodeURIComponent(fromKey)}/1/${encodeVal(item)}`;
        await kvFetch(lpush, "POST");
        await kvFetch(lrem, "POST");
        return ok(res, 200, { ok: true });
      }

      return ok(res, 400, { error: "Invalid fn" });
    } catch (e) {
      return ok(res, 500, { error: e.message || "action failed" });
    }
  }

  return ok(res, 405, { error: "Method not allowed" });
}
