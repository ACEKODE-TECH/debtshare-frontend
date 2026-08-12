#!/usr/bin/env node
// Composes a Confluence release-notes page from two sources:
//   1. The human-written CHANGELOG.md block for this version (from Changesets).
//   2. A live Confluence "Jira issues" smart-link, embedding a JQL query over
//      the `DEB-XXXX` tickets referenced by the commits since the previous
//      release tag (resolved by release-notes.yml). Confluence renders this
//      as a table by querying Jira directly — the page always shows current
//      status/assignee, we never snapshot stale data.
//
// Page hierarchy in Confluence: <CONFLUENCE_PROJECT_PAGE> (must exist) >
// "📓Release Notes" (created once, never overwritten) > "Release vX.Y.Z"
// (created or updated every run — safe to re-run against the same tag).
//
// Trade-off accepted deliberately: because the ticket table is a live JQL
// embed, we can't detect at publish time whether a referenced ticket key
// actually exists in Jira (`key in (...)` just silently omits unknown keys).
// We do a best-effort bulk search first and warn in the log about any
// ticket that doesn't resolve, but this is observability only — it never
// blocks the publish, unlike the CHANGELOG.md handling below which still
// fails loudly on unrecoverable errors.

import { readFileSync } from "node:fs";

const REQUIRED_ENV = [
  "ATLASSIAN_EMAIL",
  "ATLASSIAN_API_TOKEN",
  "JIRA_URL",
  "CONFLUENCE_URL",
  "CONFLUENCE_SPACE_KEY",
  "CONFLUENCE_PROJECT_PAGE",
  "RELEASE_TAG",
];

function readEnv() {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.error(`Missing required environment variable(s): ${missing.join(", ")}`);
    process.exit(1);
  }
  const env = Object.fromEntries(REQUIRED_ENV.map((name) => [name, process.env[name]]));
  env.JIRA_URL = env.JIRA_URL.replace(/\/+$/, "");
  env.CONFLUENCE_URL = env.CONFLUENCE_URL.replace(/\/+$/, "").replace(/\/wiki$/, "") + "/wiki";
  return env;
}

// --- Atlassian HTTP -------------------------------------------------------

function basicAuthHeader(env) {
  return "Basic " + Buffer.from(`${env.ATLASSIAN_EMAIL}:${env.ATLASSIAN_API_TOKEN}`).toString("base64");
}

async function atlassianRequest(url, options, env) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: basicAuthHeader(env),
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${options.method ?? "GET"} ${url} failed: ${res.status} ${res.statusText}\n${text}`);
  }

  return res;
}

// tenant_info is an unauthenticated Confluence endpoint used only to resolve
// the Atlassian cloudId a Jira-issues smart-link datasource needs.
async function getCloudId(siteUrl) {
  const res = await fetch(`${siteUrl}/_edge/tenant_info`);
  if (!res.ok) {
    throw new Error(
      `Could not resolve cloudId from ${siteUrl}/_edge/tenant_info: ${res.status} ${res.statusText}`,
    );
  }
  const data = await res.json();
  if (!data.cloudId) throw new Error(`${siteUrl}/_edge/tenant_info response did not include a cloudId`);
  return data.cloudId;
}

// --- Confluence v2 pages ---------------------------------------------------

async function getConfluenceSpaceId(confluenceUrl, spaceKey, env) {
  const url = `${confluenceUrl}/api/v2/spaces?keys=${encodeURIComponent(spaceKey)}&limit=1`;
  const data = await (await atlassianRequest(url, {}, env)).json();
  const space = data.results?.[0];
  if (!space) throw new Error(`No Confluence space found for key "${spaceKey}"`);
  return space.id;
}

// Returns null only for a genuine "no page with this title" (empty result
// set); any actual API error propagates from atlassianRequest instead.
async function getPageIdByTitle(confluenceUrl, spaceId, title, env) {
  const url = `${confluenceUrl}/api/v2/pages?space-id=${spaceId}&title=${encodeURIComponent(title)}&limit=1`;
  const data = await (await atlassianRequest(url, {}, env)).json();
  return data.results?.[0] ?? null;
}

async function getChildPages(confluenceUrl, parentPageId, env) {
  const url = `${confluenceUrl}/api/v2/pages/${parentPageId}/children?limit=50`;
  const data = await (await atlassianRequest(url, {}, env)).json();
  return data.results ?? [];
}

async function createConfluencePage(confluenceUrl, { spaceId, title, bodyHtml, parentId }, env) {
  const res = await atlassianRequest(
    `${confluenceUrl}/api/v2/pages`,
    {
      method: "POST",
      body: JSON.stringify({
        spaceId,
        status: "current",
        title,
        parentId,
        body: { representation: "storage", value: bodyHtml },
      }),
    },
    env,
  );
  return res.json();
}

async function updateConfluencePage(confluenceUrl, pageId, { title, bodyHtml }, env) {
  const current = await (await atlassianRequest(`${confluenceUrl}/api/v2/pages/${pageId}`, {}, env)).json();
  const res = await atlassianRequest(
    `${confluenceUrl}/api/v2/pages/${pageId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        id: pageId,
        status: "current",
        title,
        body: { representation: "storage", value: bodyHtml },
        version: { number: current.version.number + 1, message: "Actualizado por release-notes automation" },
      }),
    },
    env,
  );
  return res.json();
}

// Creates the page once and never touches its body again on later runs —
// for container pages like "📓Release Notes" that a human may edit by hand.
async function findOrCreatePage(confluenceUrl, spaceId, parentId, title, placeholderHtml, env) {
  const existing = (await getChildPages(confluenceUrl, parentId, env)).find((p) => p.title === title);
  if (existing) return { id: existing.id, created: false };

  const created = await createConfluencePage(
    confluenceUrl,
    { spaceId, title, bodyHtml: placeholderHtml, parentId },
    env,
  );
  return { id: created.id, created: true };
}

// Creates the page with a placeholder then fills it in, or updates it in
// place if it already exists — safe to re-run against the same release tag.
async function upsertPage(confluenceUrl, spaceId, parentId, title, bodyHtml, env) {
  const existing = (await getChildPages(confluenceUrl, parentId, env)).find((p) => p.title === title);

  if (existing) {
    await updateConfluencePage(confluenceUrl, existing.id, { title, bodyHtml }, env);
    return { id: existing.id, created: false };
  }

  const created = await createConfluencePage(
    confluenceUrl,
    { spaceId, title, bodyHtml: "<p>Generando contenido…</p>", parentId },
    env,
  );
  await updateConfluencePage(confluenceUrl, created.id, { title, bodyHtml }, env);
  return { id: created.id, created: true };
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

// CHANGELOG.md may not exist yet — e.g. a tag cut before Changesets adopted
// this repo, or a workflow_dispatch test run against such a tag. Treat that
// the same as "no block for this version": warn and publish without it,
// don't crash the whole run over a missing changelog.
export function readChangelogBlock(version) {
  let changelogContent;
  try {
    changelogContent = readFileSync("CHANGELOG.md", "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
  return extractChangelogBlock(changelogContent, version);
}

// --- Markdown (Changesets output) -> Confluence storage format ------------

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

// --- Jira tickets: live smart-link table -----------------------------------

// Fixed identifier for Confluence Cloud's built-in "Jira issues" smart-link
// datasource type. Not tenant-specific — same value across Atlassian sites.
const JIRA_ISSUES_DATASOURCE_ID = "d8b75300-dfda-4519-b6cd-e49abbd50401";

export function buildJql(ticketKeys) {
  return `key in (${ticketKeys.join(", ")}) ORDER BY created DESC`;
}

export function buildTicketsDatasourceBlock(jiraUrl, cloudId, ticketKeys) {
  if (ticketKeys.length === 0) {
    return "<h2>Tickets de Jira</h2>\n<p><em>Ningún ticket DEB-XXXX referenciado en esta versión.</em></p>";
  }

  const jql = buildJql(ticketKeys);
  const issuesUrl = `${jiraUrl}/issues/?jql=${encodeURIComponent(jql)}`;

  const datasource = {
    id: JIRA_ISSUES_DATASOURCE_ID,
    parameters: { cloudId, jql },
    views: [
      {
        type: "table",
        properties: {
          columns: [{ key: "issuetype" }, { key: "key" }, { key: "summary" }, { key: "status" }],
        },
      },
    ],
  };

  return [
    "<h2>Tickets de Jira</h2>",
    "<p />",
    `<a href="${escapeHtml(issuesUrl)}" data-card-appearance="block" data-datasource="${escapeHtml(JSON.stringify(datasource))}">${escapeHtml(issuesUrl)}</a>`,
  ].join("\n");
}

// Best-effort only: warns in the log about ticket keys the smart-link table
// will silently drop, but never blocks the publish. A failure of this check
// itself (network error, endpoint change) is swallowed by the caller.
async function warnIfTicketsUnresolved(jiraUrl, ticketKeys, env) {
  if (ticketKeys.length === 0) return;

  const res = await atlassianRequest(
    `${jiraUrl}/rest/api/3/search`,
    {
      method: "POST",
      body: JSON.stringify({ jql: buildJql(ticketKeys), fields: ["key"], maxResults: ticketKeys.length }),
    },
    env,
  );
  const data = await res.json();
  const resolvedKeys = new Set((data.issues ?? []).map((issue) => issue.key));
  const missing = ticketKeys.filter((key) => !resolvedKeys.has(key));

  if (missing.length > 0) {
    console.warn(
      `Warning: ${missing.length} ticket(s) referenced in commits were not found in Jira and won't appear in the table: ${missing.join(", ")}`,
    );
  }
}

// --- Page body composition -------------------------------------------------

export function composePageBody({ changelogBlock, ticketsBlockHtml }) {
  const changelogHtml = changelogBlock
    ? changelogBlockToStorageFormat(changelogBlock)
    : "<p><em>Sin entradas de changelog para esta versión.</em></p>";

  return ["<h2>Novedades</h2>", changelogHtml, ticketsBlockHtml].join("\n");
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

  const changelogBlock = readChangelogBlock(version);
  if (!changelogBlock) {
    console.warn(`No CHANGELOG.md entry found for version ${version} — publishing without it.`);
  }

  try {
    await warnIfTicketsUnresolved(env.JIRA_URL, ticketKeys, env);
  } catch (err) {
    console.warn(`Could not verify Jira tickets ahead of publish (continuing anyway): ${err.message}`);
  }

  const siteUrl = env.CONFLUENCE_URL.replace(/\/wiki$/, "");
  const cloudId = await getCloudId(siteUrl);
  const ticketsBlockHtml = buildTicketsDatasourceBlock(env.JIRA_URL, cloudId, ticketKeys);
  const bodyHtml = composePageBody({ changelogBlock, ticketsBlockHtml });

  const spaceId = await getConfluenceSpaceId(env.CONFLUENCE_URL, env.CONFLUENCE_SPACE_KEY, env);
  console.log(`Resolved space "${env.CONFLUENCE_SPACE_KEY}" -> id ${spaceId}`);

  const projectPage = await getPageIdByTitle(env.CONFLUENCE_URL, spaceId, env.CONFLUENCE_PROJECT_PAGE, env);
  if (!projectPage) {
    throw new Error(
      `Project page "${env.CONFLUENCE_PROJECT_PAGE}" not found in space "${env.CONFLUENCE_SPACE_KEY}" — create it first.`,
    );
  }

  const { id: releaseNotesPageId } = await findOrCreatePage(
    env.CONFLUENCE_URL,
    spaceId,
    projectPage.id,
    "📓Release Notes",
    `<p>Release notes de ${env.CONFLUENCE_PROJECT_PAGE}.</p>`,
    env,
  );

  const versionTitle = `Release ${env.RELEASE_TAG}`;
  const { id: versionPageId, created } = await upsertPage(
    env.CONFLUENCE_URL,
    spaceId,
    releaseNotesPageId,
    versionTitle,
    bodyHtml,
    env,
  );

  console.log(`${created ? "Created" : "Updated"} "${versionTitle}" (page ${versionPageId})`);
  console.log(`${siteUrl}/wiki/spaces/${env.CONFLUENCE_SPACE_KEY}/pages/${versionPageId}`);
}

// Only run when executed directly (not when imported for tests/simulation).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
