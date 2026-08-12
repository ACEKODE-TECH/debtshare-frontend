#!/usr/bin/env node
// Composes a Confluence release-notes page from two sources:
//   1. The human-written CHANGELOG.md block for this version (from Changesets).
//   2. The Jira tickets referenced by `DEB-XXXX` in the commits since the
//      previous release tag (resolved by release-notes.yml).
//
// Fails loudly and exits before calling Confluence if any Jira ticket can't
// be resolved — we never want a partial/incomplete page published.

import { readFileSync } from "node:fs";

const REQUIRED_ENV = [
  "JIRA_BASE_URL",
  "JIRA_EMAIL",
  "JIRA_API_TOKEN",
  "CONFLUENCE_BASE_URL",
  "CONFLUENCE_EMAIL",
  "CONFLUENCE_API_TOKEN",
  "CONFLUENCE_SPACE_KEY",
  "CONFLUENCE_PARENT_PAGE_ID",
  "RELEASE_TAG",
];

function readEnv() {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.error(`Missing required environment variable(s): ${missing.join(", ")}`);
    process.exit(1);
  }
  return Object.fromEntries(REQUIRED_ENV.map((name) => [name, process.env[name]]));
}

// --- Jira ---------------------------------------------------------------

async function fetchJiraIssue(env, key) {
  const auth = Buffer.from(`${env.JIRA_EMAIL}:${env.JIRA_API_TOKEN}`).toString("base64");
  const url = `${env.JIRA_BASE_URL}/rest/api/3/issue/${key}?fields=summary,issuetype,status`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
  });

  if (res.status === 404) {
    throw new Error(`${key} not found in Jira (404) — check the ticket key or Jira permissions`);
  }
  if (!res.ok) {
    throw new Error(`Jira request for ${key} failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return {
    key,
    summary: data.fields.summary,
    type: data.fields.issuetype?.name ?? "Sin tipo",
    status: data.fields.status?.name ?? "Desconocido",
  };
}

async function resolveTickets(env, ticketKeys) {
  const results = await Promise.allSettled(ticketKeys.map((key) => fetchJiraIssue(env, key)));

  const issues = [];
  const failures = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      issues.push(result.value);
    } else {
      failures.push({ key: ticketKeys[i], error: result.reason });
    }
  });

  if (failures.length > 0) {
    console.error(`\nFailed to resolve ${failures.length} of ${ticketKeys.length} Jira ticket(s):`);
    for (const failure of failures) {
      console.error(`  - ${failure.key}: ${failure.error.message ?? failure.error}`);
    }
    console.error("\nAborting before creating the Confluence page — no partial publish.");
    process.exit(1);
  }

  return issues;
}

const ISSUE_TYPE_ORDER = ["Story", "Task", "Bug", "Sub-task", "Subtarea"];

export function groupIssuesByType(issues) {
  const groups = new Map();
  for (const issue of issues) {
    if (!groups.has(issue.type)) groups.set(issue.type, []);
    groups.get(issue.type).push(issue);
  }

  for (const group of groups.values()) {
    group.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
  }

  return [...groups.entries()].sort(([a], [b]) => {
    const ai = ISSUE_TYPE_ORDER.indexOf(a);
    const bi = ISSUE_TYPE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

// --- CHANGELOG.md ---------------------------------------------------------

export function extractChangelogBlock(changelogContent, version) {
  const lines = changelogContent.split("\n");
  const startIndex = lines.findIndex((line) => line.trim() === `## ${version}`);
  if (startIndex === -1) return null;

  const rest = lines.slice(startIndex + 1);
  const endIndex = rest.findIndex((line) => /^## /.test(line));
  const block = endIndex === -1 ? rest : rest.slice(0, endIndex);

  const trimmed = block.join("\n").trim();
  return trimmed.length > 0 ? trimmed : null;
}

// --- Markdown (Changesets output) -> Confluence storage format ------------

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inlineMarkdownToHtml(text) {
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  return html;
}

export function changelogBlockToStorageFormat(block) {
  const lines = block.split("\n");
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inlineMarkdownToHtml(line.slice(4))}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdownToHtml(line.slice(2))}</li>`);
    } else {
      closeList();
      html.push(`<p>${inlineMarkdownToHtml(line)}</p>`);
    }
  }
  closeList();

  return html.join("\n");
}

// --- Page body composition -------------------------------------------------

export function ticketsSectionToStorageFormat(jiraBaseUrl, groupedIssues) {
  if (groupedIssues.length === 0) {
    return "<h2>Tickets de Jira</h2>\n<p><em>Ningún ticket DEB-XXXX referenciado en esta versión.</em></p>";
  }

  const html = ["<h2>Tickets de Jira</h2>"];
  for (const [type, issues] of groupedIssues) {
    html.push(`<h3>${escapeHtml(type)}</h3>`);
    html.push("<ul>");
    for (const issue of issues) {
      html.push(
        `<li><a href="${jiraBaseUrl}/browse/${issue.key}">${escapeHtml(issue.key)}</a> — ` +
          `${escapeHtml(issue.summary)} <em>(${escapeHtml(issue.status)})</em></li>`,
      );
    }
    html.push("</ul>");
  }
  return html.join("\n");
}

export function composePageBody({ changelogBlock, jiraBaseUrl, groupedIssues }) {
  const changelogHtml = changelogBlock
    ? changelogBlockToStorageFormat(changelogBlock)
    : "<p><em>Sin entradas de changelog para esta versión.</em></p>";

  return [
    "<h2>Novedades</h2>",
    changelogHtml,
    ticketsSectionToStorageFormat(jiraBaseUrl, groupedIssues),
  ].join("\n");
}

// --- Confluence -------------------------------------------------------------

async function createConfluencePage(env, { title, bodyHtml }) {
  const auth = Buffer.from(`${env.CONFLUENCE_EMAIL}:${env.CONFLUENCE_API_TOKEN}`).toString("base64");

  const res = await fetch(`${env.CONFLUENCE_BASE_URL}/wiki/rest/api/content`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      type: "page",
      title,
      space: { key: env.CONFLUENCE_SPACE_KEY },
      ancestors: [{ id: env.CONFLUENCE_PARENT_PAGE_ID }],
      body: { storage: { value: bodyHtml, representation: "storage" } },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Confluence page creation failed: ${res.status} ${res.statusText}\n${text}`);
  }

  return res.json();
}

// --- Entry point --------------------------------------------------------

async function main() {
  const env = readEnv();
  const version = env.RELEASE_TAG.replace(/^v/, "");
  const ticketKeys = (process.env.TICKET_KEYS ?? "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);

  console.log(
    `Release ${env.RELEASE_TAG}: ${ticketKeys.length} Jira ticket(s) referenced: ${ticketKeys.join(", ") || "(none)"}`,
  );

  const changelogContent = readFileSync("CHANGELOG.md", "utf8");
  const changelogBlock = extractChangelogBlock(changelogContent, version);
  if (!changelogBlock) {
    console.warn(`No CHANGELOG.md block found for version ${version} — publishing without it.`);
  }

  const issues = await resolveTickets(env, ticketKeys);
  const groupedIssues = groupIssuesByType(issues);

  const bodyHtml = composePageBody({ changelogBlock, jiraBaseUrl: env.JIRA_BASE_URL, groupedIssues });

  const releaseDate = new Date().toISOString().slice(0, 10);
  const title = `Release ${env.RELEASE_TAG} — ${releaseDate}`;

  console.log(`Publishing "${title}" to Confluence space ${env.CONFLUENCE_SPACE_KEY}...`);
  const page = await createConfluencePage(env, { title, bodyHtml });

  const webUrl =
    page._links?.base && page._links?.webui ? `${page._links.base}${page._links.webui}` : "(url unknown)";
  console.log(`Published: ${webUrl}`);
}

// Only run when executed directly (not when imported for tests/simulation).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
