# Weekly blog playbook

How each blog post is researched, written, and published. The twice-weekly scheduled task (Mondays and Thursdays) follows this file, so keep it current. The `docs` folder is listed in `.assetsignore`, so nothing here is published on the site.

## Goal

Two new posts a week (Mondays and Thursdays, chosen by Tyler 2026-10-20) that rank in search and turn readers into free audit requests. Readers are owners and managers of small and mid-sized U.S. businesses (any industry, "3 people or 300"). Property management and e-commerce are strong industries with real case studies.

## Editorial standard (read first)

Every post follows `docs/seo-content-prompt.md` (Tyler, 2026-10-20): how to choose the question, sourcing standards, the experience element, the writing rules, the on-page checklist, the monthly refresh, and the quality gate. Its clusters are the pillars below. This playbook covers the files and publishing; where the two differ on writing, the prompt wins.

How its output format maps to this pipeline:

- Items 1, 2, 5, 6, 8, and 9 (strategy brief, placeholders, sources, linking plan, verify flags, promotion idea) go in the pull request description.
- Items 3, 4, and 7 (title, description, slug, the post, and JSON-LD) become `blog/<slug>.html`, not Markdown.
- Anything flagged [VERIFY BEFORE PUBLISHING] must be checked against its source before merging, or cut.
- A draft with any [AUTHOR INPUT NEEDED] placeholder is never merged. Leave the PR open and tell Tyler what's needed.
- One of the eight posts each month is a refresh of an existing post (first Monday of the month), as the prompt's refresh section describes.



Every post belongs to one of four pillars and links to that pillar's anchor page plus `/audit`. Rotate through the pillars so each gets a new post about every two weeks.

| Pillar | Covers | Anchor page |
| --- | --- | --- |
| 1. Costs and payback | Prices, ROI, automation vs hiring, whether a monthly plan is worth it | `/blog/business-automation-cost` |
| 2. What to automate | Task lists, process examples, signs you need automation | `/property-management-tasks-to-automate` (until an any-business guide exists) |
| 3. Industry playbooks | Automation for one industry at a time | The matching industry service page (`/leasing-automation`, `/maintenance-automation`, `/bookkeeping-automation`, `/marketing-automation`, `/ecommerce-automation`) |
| 4. Hiring automation help | What a consultant does, what the free audit covers, DIY vs hiring, what ongoing care includes, who owns what | `/audit` |

Pillar 4 describes what a client gets, what it costs, and who owns what. It never explains how automations are built.

## Rules (never break these)

- Company name is always **KeyProcess Automation Services**.
- Sell outcomes and results only. Never explain how automations are built, never name tools or software products (no app, platform, or vendor names), and never name clients.
- Never invent statistics, testimonials, quotes, or client stories. The only numbers allowed are (a) real case study numbers from `results.html`, (b) the site's own prices (from $1,000, from $3,000, from $500/month), or (c) clearly labeled made-up examples ("An example, with made-up numbers"). If you cite an outside statistic, link the original source in the post and only use it if the source is reputable and recent.
- No testimonials of any kind.
- Oxford comma everywhere.
- The 30-day guarantee and "3 new clients this quarter" are approved offers and can be mentioned. Do not offer a free first month of Automation Care (offer retired 2026-10-20).
- The daily industry news blog case study is a case study only: never pitch it as a service.
- Safe and Healthy Homes law is only mentioned in the compliance case study, not in posts.
- No new costs: no paid tools, images, or services.

## Picking the keyword

1. Read `docs/blog-topics.md` and skip anything already published.
2. Pick the next topic from the backlog (it is grouped by pillar and lists the planned order first), or a better one found in research. Keep the pillar rotation. Prefer keywords with buyer intent (cost, examples, "how to automate X", "X for small business", industry-specific tasks) that a small site can realistically rank for. Alternate between broad any-business topics and industry topics (property management, e-commerce, home services, professional offices, healthcare practices, agencies, nonprofits).
3. Search the web for the keyword. Read the top results and note what they cover, what questions they answer, and what they miss. The post must answer the searcher's question better and faster than any of them.
4. Choose one primary keyword and 3 to 5 close variations.

## Writing the post

- Usually 1,200 to 2,000 words for a supporting post and 2,500+ for a pillar page; whatever it takes to beat the current #1 result, never padded. Plain English (grade 8 to 9), short paragraphs, written for a busy owner.
- Title (H1) contains the primary keyword. `<title>` under about 60 characters before the " | KeyProcess Automation Services" suffix. Meta description 140 to 155 characters with the keyword.
- Open with an `answer-box` that answers the question in 2 to 3 sentences, 40 to 60 words (this is what search snippets and AI answers pick up), followed by a "Key takeaways" box (a `callout` with 3 to 5 bullets).
- Add a `toc` list for posts with 5 or more sections, with `id`s on each H2.
- Use H2s and H3s phrased like the questions people search.
- At least 3 internal links: `/results` (or a specific `/results#id` case), `/#calculator`, `/audit`, and any relevant service page or earlier post.
- 4 to 6 FAQ questions at the bottom, mirrored exactly in `FAQPage` JSON-LD.
- Byline in the `post-meta` line: "By Tyler, Founder of KeyProcess Automation Services" (until Tyler gives his full name). In the BlogPosting JSON-LD, `author` is a `Person` named "Tyler" with `jobTitle` "Founder" and `worksFor` the organization, and `dateModified` is set.
- Before the FAQ, a short author bio in a `callout`: Tyler founded KeyProcess Automation Services and has built dozens of automations for property management and e-commerce teams, with a link to `/results`.
- End with the CTA section pointing to `/audit`.
- Slug: short, lowercase, hyphenated, keyword-based, no dates (example: `business-automation-cost`).

## Files to touch

Posts live at `blog/<slug>.html`. The one exception is the older guide at `/property-management-tasks-to-automate`, which stays at its original address but is listed on the blog.

1. Copy `blog/business-automation-cost.html` as the template for `blog/<slug>.html`. Update the title, description, canonical, og tags (including `og:image:alt`), twitter tags (`twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`), `article:published_time`, all JSON-LD (BlogPosting, BreadcrumbList, FAQPage), the hero, meta line (date and read time at ~230 words a minute), body, FAQ, and CTA. Keep the header and footer menus identical to every other page, with absolute paths (`/styles.css`, `/logo.svg`).
2. Make the featured image: `NODE_PATH=$(npm root -g) node docs/blog-image.js <slug> "<post title>" "<short category>"`. It writes `blog/images/<slug>.jpg` (1200x630, branded, used by social posts and the feed) and a lighter `blog/images/<slug>.webp` (used on the site); commit both. Look at it before committing. Point the post's `og:image`, `twitter:image`, and JSON-LD `image` at `https://www.keyprocessautomation.com/blog/images/<slug>.jpg`.
3. `blog/index.html`: add a `post-card` at the top of the list (below the `POSTS` comment) with the `post-thumb` image wrapped in a `<picture>` with the `.webp` as a `<source>` (copy an existing card), and a `BlogPosting` entry (with `image`) at the top of the `blogPost` array.
4. `blog/feed.xml`: add an `<item>` below the `ITEMS` comment with an `<enclosure>` (url, byte `length`, `image/jpeg`) and a `<media:content>` tag for the image, and update `lastBuildDate`. Tyler's make.com scenario reads the feed and posts the image, title, link, and description to LinkedIn and Google Business Profile, so every item must have them.
5. `sitemap.xml`: add the post URL with today's date, and update the `/blog/` lastmod.
6. `docs/blog-topics.md`: move the topic to Published with the date, slug, and primary keyword.
7. When a new post covers a topic an older post touches, add a link from the older post to the new one.
8. Add at least one in-post illustration (Tyler, 2026-10-20): add a `card(...)` call to `docs/illustrations.py` that shows the post's outcome (real prices or case study results only, no made-up numbers, no tool names), run `python3 docs/illustrations.py`, and place it in the post as `<img class="illo post-illo" src="/images/<name>.svg" alt="..." width="480" height="320" loading="lazy" decoding="async">` before an early H2. New service pages get one the same way as a hero image in a `page-hero-grid`.

## SEO standards (every page, every post)

- Exactly one `<h1>`, and headings never skip a level (an H2 comes before any H3).
- A self-referencing canonical: `https://www.keyprocessautomation.com/<path>` with no `.html` and no trailing slash (except `/blog/`).
- Never add `noindex` to a public page. Only `/audit-thanks` and `/404` carry it.
- Every `<img>` has descriptive `alt` text plus `width` and `height`. Images below the first screen get `loading="lazy" decoding="async"`; photos or screenshots ship as WebP (keep a JPG only where social posts or the feed need one).
- All internal links and asset paths start with `/` (`/styles.css`, `/results`), never relative and never ending in `.html`.
- No third-party scripts, fonts, or embeds. The site's security headers (`_headers`) block them; if one is ever truly needed, update the Content-Security-Policy there in the same pull request.
- Link each new page from at least one existing page, and add it to `sitemap.xml`. Add new service pages and guides to `llms.txt` too.

## Checks before opening the pull request

- Run `python3 docs/seo-check.py`. It must print "All N pages pass." It checks headings, titles, descriptions, canonicals, social tags, alt text, image sizes, JSON-LD, broken links and anchors, and sitemap coverage.
- Validate every JSON-LD block parses as JSON.
- Search the new post for tool or vendor names, client names, "testimonial", and how-it-works details. Remove any.
- Check each list of three or more items has an Oxford comma.
- Check every internal link points to a page or anchor that exists.

## Publishing

Tyler chose auto-publish (2026-10-19). Open a pull request against `main` titled `Blog: <post title>`, wait for the Cloudflare preview build on it to succeed, then merge it yourself (merging publishes, since pushes to `main` auto-deploy). If the build fails or any check above fails and can't be fixed, leave the PR open and tell Tyler why instead of merging. After merging, tell Tyler the post is live with its link.
