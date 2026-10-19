# Weekly blog playbook

How the weekly blog post is researched, written, and published. The weekly scheduled task follows this file, so keep it current. The `docs` folder is listed in `.assetsignore`, so nothing here is published on the site.

## Goal

One new post a week that ranks in search and turns readers into free audit requests. Readers are owners and managers of small and mid-sized U.S. businesses (any industry, "3 people or 300"). Property management and e-commerce are strong industries with real case studies.

## Rules (never break these)

- Company name is always **KeyProcess Automation Services**.
- Sell outcomes and results only. Never explain how automations are built, never name tools or software products (no app, platform, or vendor names), and never name clients.
- Never invent statistics, testimonials, quotes, or client stories. The only numbers allowed are (a) real case study numbers from `results.html`, (b) the site's own prices (from $1,000, from $3,000, from $500/month), or (c) clearly labeled made-up examples ("An example, with made-up numbers"). If you cite an outside statistic, link the original source in the post and only use it if the source is reputable and recent.
- No testimonials of any kind.
- Oxford comma everywhere.
- The 30-day guarantee, first month of Automation Care free with any build, and "3 new clients this quarter" are approved offers and can be mentioned.
- The daily industry news blog case study is a case study only: never pitch it as a service.
- Safe and Healthy Homes law is only mentioned in the compliance case study, not in posts.
- No new costs: no paid tools, images, or services.

## Picking the keyword

1. Read `docs/blog-topics.md` and skip anything already published.
2. Pick the next topic from the backlog, or a better one found in research. Prefer keywords with buyer intent (cost, examples, "how to automate X", "X for small business", industry-specific tasks) that a small site can realistically rank for. Alternate between broad any-business topics and industry topics (property management, e-commerce, home services, professional offices, healthcare practices, agencies, nonprofits).
3. Search the web for the keyword. Read the top results and note what they cover, what questions they answer, and what they miss. The post must answer the searcher's question better and faster than any of them.
4. Choose one primary keyword and 3 to 5 close variations.

## Writing the post

- 1,500 to 2,500 words. Plain English, short paragraphs, written for a busy owner.
- Title (H1) contains the primary keyword. `<title>` under about 60 characters before the " | KeyProcess Automation Services" suffix. Meta description 140 to 160 characters with the keyword.
- Open with an `answer-box` that answers the question in 2 to 4 sentences (this is what search snippets and AI answers pick up).
- Add a `toc` list for posts with 5 or more sections, with `id`s on each H2.
- Use H2s and H3s phrased like the questions people search.
- At least 3 internal links: `/results` (or a specific `/results#id` case), `/#calculator`, `/audit`, and any relevant service page or earlier post.
- 4 to 6 FAQ questions at the bottom, mirrored exactly in `FAQPage` JSON-LD.
- End with the CTA section pointing to `/audit`.
- Slug: short, lowercase, hyphenated, keyword-based, no dates (example: `business-automation-cost`).

## Files to touch

Posts live at `blog/<slug>.html`. The one exception is the older guide at `/property-management-tasks-to-automate`, which stays at its original address but is listed on the blog.

1. Copy `blog/business-automation-cost.html` as the template for `blog/<slug>.html`. Update the title, description, canonical, og tags, `article:published_time`, all JSON-LD (BlogPosting, BreadcrumbList, FAQPage), the hero, meta line (date and read time at ~230 words a minute), body, FAQ, and CTA. Keep the header and footer menus identical to every other page, with absolute paths (`/styles.css`, `/logo.svg`).
2. `blog/index.html`: add a `post-card` at the top of the list (below the `POSTS` comment) and a `BlogPosting` entry at the top of the `blogPost` array.
3. `blog/feed.xml`: add an `<item>` below the `ITEMS` comment and update `lastBuildDate`.
4. `sitemap.xml`: add the post URL with today's date, and update the `/blog/` lastmod.
5. `docs/blog-topics.md`: move the topic to Published with the date, slug, and primary keyword.
6. When a new post covers a topic an older post touches, add a link from the older post to the new one.

## Checks before opening the pull request

- Validate every JSON-LD block parses as JSON.
- Search the new post for tool or vendor names, client names, "testimonial", and how-it-works details. Remove any.
- Check each list of three or more items has an Oxford comma.
- Check every internal link points to a page or anchor that exists.

## Publishing

Open a pull request against `main` titled `Blog: <post title>` for Tyler to review. Merging it publishes the post (pushes to `main` auto-deploy). Do not merge it yourself.
