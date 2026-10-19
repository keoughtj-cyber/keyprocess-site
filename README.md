# KeyProcess Automation Services website

Static site for keyprocessautomation.com. No build step: the Cloudflare Worker serves these files as they are.

- `audit.html` – free audit form, served at /audit; `audit-thanks.html` is the page people land on after submitting
- `src/worker.js` – serves the site and handles POST /api/audit, emailing each submission to keyprocessautomation@gmail.com through Cloudflare Email Routing (`send_email` binding in `wrangler.jsonc`)

- `index.html` – home page (hero, services, featured results, pricing, FAQ)
- `results.html` – all case studies, served at /results
- `leasing-automation.html`, `maintenance-automation.html`, `bookkeeping-automation.html`, `marketing-automation.html` – service pages for search, served without `.html`
- `property-management-tasks-to-automate.html` – guide article for search
- `blog/` – weekly blog, served at /blog/ (`index.html` lists posts, `feed.xml` is the RSS feed, each post is `blog/<slug>.html`); `docs/blog-playbook.md` explains how posts are written and published, and `docs/blog-topics.md` tracks keywords (the `docs` folder is not published)
- `styles.css` – all styling
- `menu.js` – opens and closes the header menu on phones (every page loads it right after the header)
- `wrangler.jsonc`, `.assetsignore` – Cloudflare config; the `previews` block lets branch and pull request previews build
- `robots.txt`, `sitemap.xml` (add every new page here), `og-image.png` (link preview image), `logo.png`, `favicon.png`, `apple-touch-icon.png`
