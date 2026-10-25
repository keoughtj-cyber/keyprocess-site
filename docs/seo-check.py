"""Checks every page against the site's SEO standards (see docs/blog-playbook.md).

Usage: python3 docs/seo-check.py   (from the repo root; prints problems, exits 1 if any)
"""
import glob
import json
import os
import re
import sys
from html.parser import HTMLParser

SITE = "https://www.keyprocessautomation.com"
SUFFIX = " | KeyProcess Automation Services"
NOINDEX_OK = {"/audit-thanks", "/404", "/hub-lab"}  # Pages that should stay out of search (hub-lab is a test page).
REQUIRED_META = ["og:title", "og:description", "og:image", "og:image:alt", "og:url", "og:type", "og:site_name",
                 "twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"]

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)


def url_for(path):
    if path == "index.html":
        return "/"
    if path.endswith("/index.html"):
        return "/" + path[: -len("index.html")]
    return "/" + path[: -len(".html")]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.headings, self.links, self.ids, self.imgs, self.ld = [], [], set(), [], []
        self.meta, self.canonical, self.title = {}, None, ""
        self._in = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if re.fullmatch(r"h[1-6]", tag):
            self.headings.append(int(tag[1]))
        elif tag == "a" and "href" in a:
            self.links.append(a["href"])
        elif tag == "img":
            self.imgs.append(a)
        elif tag == "meta":
            self.meta[a.get("name") or a.get("property")] = a.get("content") or ""
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in = "ld"
            self.ld.append("")
        elif tag == "title":
            self._in = "title"

    def handle_endtag(self, tag):
        if tag in ("script", "title"):
            self._in = None

    def handle_data(self, data):
        if self._in == "ld":
            self.ld[-1] += data
        elif self._in == "title":
            self.title += data


files = sorted(p for p in glob.glob("**/*.html", recursive=True) if not p.startswith(("docs/", "node_modules/")))
pages = {}
for f in files:
    page = Page()
    page.feed(open(f, encoding="utf-8").read())
    pages[url_for(f)] = page
assets = {"/" + f for f in glob.glob("**/*", recursive=True) if os.path.isfile(f)}
sitemap = set(re.findall(r"<loc>([^<]+)</loc>", open("sitemap.xml", encoding="utf-8").read()))

problems = []
for url, p in sorted(pages.items()):
    say = lambda msg: problems.append(f"{url}: {msg}")
    noindex = "noindex" in p.meta.get("robots", "")
    if noindex and url not in NOINDEX_OK:
        say("has noindex")
    if p.headings.count(1) != 1:
        say(f"has {p.headings.count(1)} h1 tags (needs exactly 1)")
    for prev, cur in zip(p.headings, p.headings[1:]):
        if cur > prev + 1:
            say(f"heading skips from h{prev} to h{cur}")
            break
    title = p.title.replace(SUFFIX, "")
    if len(title) > 60:
        say(f"title is {len(title)} characters before the suffix (keep under 60)")
    desc = p.meta.get("description", "")
    if not 120 <= len(desc) <= 160:
        say(f"meta description is {len(desc)} characters (aim for 120 to 160)")
    for img in p.imgs:
        if not img.get("alt"):
            say(f"image without alt text: {img.get('src')}")
        if not (img.get("width") and img.get("height")):
            say(f"image without width and height: {img.get('src')}")
    for block in p.ld:
        try:
            json.loads(block)
        except ValueError as e:
            say(f"JSON-LD does not parse: {e}")
    if not noindex:
        if p.canonical != SITE + url:
            say(f"canonical is {p.canonical}, expected {SITE + url}")
        if SITE + url not in sitemap:
            say("missing from sitemap.xml")
        for key in REQUIRED_META:
            if not p.meta.get(key):
                say(f"missing {key}")
    for href in p.links:
        if href.startswith(("http:", "https:", "mailto:", "tel:")):
            continue
        path, _, frag = href.partition("#")
        if path and not path.startswith("/"):
            say(f"relative link {href} (use a path starting with /)")
            continue
        if path.endswith(".html"):
            say(f"link {href} should drop .html")
        target = path or url
        if target not in pages and target not in assets:
            say(f"broken link {href}")
        elif frag and target in pages and frag not in pages[target].ids:
            say(f"link {href} points to a missing anchor")

for loc in sorted(sitemap):
    if loc[len(SITE):] not in pages:
        problems.append(f"sitemap.xml: {loc} is not a page")

print("\n".join(problems) or f"All {len(pages)} pages pass.")
sys.exit(1 if problems else 0)
