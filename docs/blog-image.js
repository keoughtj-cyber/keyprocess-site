// Renders a 1200x630 featured image for a blog post into blog/images/<slug>.jpg.
// Usage: NODE_PATH=$(npm root -g) node docs/blog-image.js <slug> "<title>" "<category>"
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const [slug, title, category] = process.argv.slice(2);
if (!slug || !title || !category) {
  console.error('Usage: node docs/blog-image.js <slug> "<title>" "<category>"');
  process.exit(1);
}

const root = path.resolve(__dirname, "..");
const logo = fs.readFileSync(path.join(root, "logo.svg"), "utf8").replace(/<metadata>[\s\S]*?<\/metadata>/, "");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .card { position: relative; width: 1200px; height: 630px; padding: 64px 72px; color: #fff; overflow: hidden;
    background: radial-gradient(circle at 85% 15%, #1d4f9e 0%, rgba(29,79,158,0) 55%), linear-gradient(135deg, #14213d 0%, #0d1730 100%); display: flex; flex-direction: column; }
  .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 48px 48px; }
  .bar { position: absolute; left: 0; top: 0; bottom: 0; width: 14px; background: #f4b740; }
  .eyebrow { position: relative; display: inline-block; align-self: flex-start; background: rgba(244,183,64,0.15); color: #f4b740; border: 2px solid rgba(244,183,64,0.5);
    border-radius: 999px; padding: 8px 20px; font-size: 22px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
  h1 { position: relative; margin-top: 36px; font-size: ${title.length > 70 ? 52 : title.length > 50 ? 60 : 68}px; line-height: 1.12; font-weight: 800; letter-spacing: -0.015em; max-width: 1000px; }
  .foot { position: relative; margin-top: auto; display: flex; align-items: center; gap: 18px; }
  .foot svg { width: 64px; height: 64px; }
  .name { font-size: 28px; font-weight: 700; }
  .url { margin-left: auto; font-size: 24px; color: #c7d2e4; }
</style></head><body><div class="card"><div class="grid"></div><div class="bar"></div>
  <span class="eyebrow">${esc(category)}</span>
  <h1>${esc(title)}</h1>
  <div class="foot">${logo}<span class="name">KeyProcess Automation Services</span><span class="url">keyprocessautomation.com</span></div>
</div></body></html>`;

(async () => {
  const out = path.join(root, "blog", "images", slug + ".jpg");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.screenshot({ path: out, type: "jpeg", quality: 88 });
  await browser.close();
  console.log(out, fs.statSync(out).size, "bytes");
})();
