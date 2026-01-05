import { json, upstash, safeId } from "./_lib.js";

function hashToObj(result) {
  if (!result) return {};
  if (Array.isArray(result)) {
    const obj = {};
    for (let i = 0; i < result.length; i += 2) {
      obj[String(result[i])] = String(result[i + 1] ?? "");
    }
    return obj;
  }
  if (typeof result === "object") return result;
  return {};
}


export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  let body = {};
  try { body = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}"); }
  catch { return json(res, 400, { error: "Invalid JSON" }); }

  const id = safeId(body.id);
  const direction = body.direction === "up" || body.direction === "down" ? body.direction : null;
  if (!id || !direction) return json(res, 400, { error: "Invalid payload" });

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    "unknown";

  const rlKey = `smellable:rl:vote:${id}:${ip}`;

  try {
    const hit = await upstash(`INCR/${encodeURIComponent(rlKey)}`);
    if (Number(hit?.result || 0) === 1) {
      await upstash(`EXPIRE/${encodeURIComponent(rlKey)}/1`);
    } else {
      return json(res, 429, { error: "Too many votes. Slow down." });
    }

    const votesKey = `smellable:votes:${id}`;
    await upstash(`HINCRBY/${encodeURIComponent(votesKey)}/${direction}/1`);
    const votes = await upstash(`HGETALL/${encodeURIComponent(votesKey)}`);
    const obj = hashToObj(votes?.result);
    return json(res, 200, { up: Number(obj.up || 0), down: Number(obj.down || 0) });
  } catch (e) {
    return json(res, 500, { error: "Server error", detail: String(e?.message || e) });
  }
}
