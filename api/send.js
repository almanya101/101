import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.TO_EMAIL || "ubt@ubterzioglu.de";
// Once domain verified, set FROM_EMAIL in Vercel env to e.g. "ZTOOLFORTOOL <ubt@ubterzioglu.de>"
const FROM_EMAIL = process.env.FROM_EMAIL || "ZTOOLFORTOOL <onboarding@resend.dev>";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

export default async function handler(req, res) {
  // CORS (optional; harmless)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { request, name, notify, email } = req.body || {};

  const reqText = String(request || "").trim();
  const nameText = String(name || "").trim();
  const notifyBool = !!notify;
  const emailText = String(email || "").trim();

  if (reqText.length < 8) return res.status(400).json({ error: "Request too short" });
  if (reqText.length > 3000) return res.status(400).json({ error: "Request too long" });

  if (notifyBool) {
    if (!emailText) return res.status(400).json({ error: "Email required when notify is ON" });
    if (!isValidEmail(emailText)) return res.status(400).json({ error: "Invalid email" });
  }

  const text = `New tool request received 👇

Tool idea:
--------------------
${reqText}
--------------------

Name suggestion:
${nameText || "-"}

Notify:
${notifyBool ? "Yes" : "No"}

Requester email:
${notifyBool ? (emailText || "-") : "-"}

Source:
https://ubterzioglu.de/ztoolfortool/ztoolfortool.html
`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: "ZTOOLFORTOOL – New Tool Request",
      text
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Email send failed" });
  }
}
