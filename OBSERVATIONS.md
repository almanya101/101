# Repository Observations

## Project overview
- Static HTML/CSS/JS site for almanya101.de with several sub-tools (QA form, salary calculator, news list).
- Serverless functions under `api/` provide email handling (Zoho SMTP) and Supabase-backed operations for salary reports and news content.

## Key directories and files
- `index.html` plus shared styling in `style-shared.css` define the main landing page.
- `qa/` contains the QA form markup (`qa.html`) and client script (`qa.js`); backend email sender lives in `api/qa-ask.js`.
- `maas/` offers the salary calculator with dedicated HTML, JS (`maas/js/maas.js`, `maas/js/report.js`), and CSS (`maas/css/maas.css`, `maas/css/report.css`), backed by `api/net-salary.js` and `api/reports-get.js` plus Supabase client `lib/supabase.js`.
- `haberler/` renders news cards via `haberindex.html`, `js/haber.js`, and `css/haber.css`, consuming the read-only API `api/news-list.js`.
- Shared assets include `img/`, `styles/`, `style-shared.css`, and meta files (`robots.txt`, `sitemap.xml`).

## Tooling and dependencies
- Package management via `npm`; primary runtime dependencies are `nodemailer` and `@supabase/supabase-js` (see `package.json`).
- Local development uses `npx vercel dev` with no build step (`vercel-build` is a no-op).

## Operational notesa
- Environment variables required for deployment include Zoho SMTP settings (`ZOHO_SMTP_HOST`, `ZOHO_SMTP_PORT`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS`, `MAIL_TO`, optional `MAIL_FROM_NAME`) and Supabase credentials (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
- Assets are static; form submissions and data retrieval occur through serverless endpoints.
