# KeyProcess Automation Services website

Static site for keyprocessautomation.com. No build step: the Cloudflare Worker serves these files as they are.

- `audit.html` – free audit form, served at /audit; `audit-thanks.html` is the page people land on after submitting
- `src/worker.js` – serves the site and handles POST /api/audit, emailing each submission to keyprocessautomation@gmail.com through Cloudflare Email Routing (`send_email` binding in `wrangler.jsonc`)

- `index.html` – home page (hero, services, featured results, pricing, FAQ)
- `results.html` – all case studies, served at /results
- `leasing-automation.html`, `maintenance-automation.html`, `bookkeeping-automation.html`, `marketing-automation.html` – service pages for search, served without `.html`
- `property-management-tasks-to-automate.html` – guide article for search
- `styles.css` – all styling
- `wrangler.jsonc`, `.assetsignore` – Cloudflare config; the `previews` block lets branch and pull request previews build
- `robots.txt`, `sitemap.xml` (add every new page here), `og-image.png` (link preview image), `logo.png`, `favicon.png`, `apple-touch-icon.png`
