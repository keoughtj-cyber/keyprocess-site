// Serves the static site and emails free audit requests to Tyler.
import { EmailMessage } from "cloudflare:email";

const FROM = "audit@keyprocessautomation.com";
const TO = "keyprocessautomation@gmail.com";
// Fields used for spam checks only; never included in the email.
const HIDDEN = new Set(["website_url", "started"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/audit") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
      return handleAudit(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleAudit(request, env) {
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 50000) return errorPage(413);

  let form;
  try {
    form = await request.formData();
  } catch {
    return errorPage(400);
  }

  // Bots fill the hidden field or submit within a couple of seconds of loading.
  const started = Number(form.get("started") || 0);
  if (form.get("website_url") || (started && Date.now() - started < 3000)) {
    return Response.redirect(new URL("/audit-thanks", request.url), 303);
  }

  const email = clean(form.get("Work email"));
  const first = clean(form.get("First name"));
  const last = clean(form.get("Last name"));
  const company = clean(form.get("Company name"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !first || !company) return errorPage(400);

  // Keep the form's order and join checkbox answers onto one line.
  const answers = new Map();
  for (const [key, value] of form.entries()) {
    if (HIDDEN.has(key) || typeof value !== "string" || !value.trim()) continue;
    answers.set(key, answers.has(key) ? answers.get(key) + ", " + value.trim() : value.trim());
  }
  const lines = [];
  for (const [key, value] of answers) lines.push(key + (/[?:]$/.test(key) ? "" : ":") + "\n" + value + "\n");
  const body = "New free audit request from keyprocessautomation.com\n\n" + lines.join("\n");

  const subject = `Audit request: ${company} (${first} ${last})`.trim();
  const raw = [
    `From: KeyProcess Website <${FROM}>`,
    `To: ${TO}`,
    `Reply-To: ${email}`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@keyprocessautomation.com>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    toBase64(body).replace(/.{76}/g, "$&\r\n"),
  ].join("\r\n");

  try {
    await env.AUDIT_EMAIL.send(new EmailMessage(FROM, TO, raw));
  } catch (err) {
    console.error("Audit email failed", err);
    return errorPage(500);
  }
  return Response.redirect(new URL("/audit-thanks", request.url), 303);
}

function clean(value) {
  return typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim().slice(0, 200) : "";
}

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function encodeHeader(text) {
  return `=?UTF-8?B?${toBase64(text)}?=`;
}

function errorPage(status) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Something went wrong | KeyProcess Automation Services</title><link rel="stylesheet" href="/styles.css"></head><body><main><section class="page-hero"><div class="wrap"><h1>Sorry, that didn't go through</h1><p class="section-lead">Please go back and try again, or email <a href="mailto:tyler@keyprocessautomation.com">tyler@keyprocessautomation.com</a> and we'll set up your free audit from there.</p><p><a class="btn" href="/audit">Back to the form</a></p></div></section></main></body></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}
