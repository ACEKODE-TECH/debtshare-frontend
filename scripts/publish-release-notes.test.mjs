// Unit tests for the pure formatting logic in publish-release-notes.mjs
// (changelog parsing, markdown->storage-format conversion, JQL/datasource
// composition). Run with `npm run test:scripts`. Uses node:test, not
// Vitest, since this script runs outside src/ and has no DOM/browser
// surface to test. Network calls (Jira/Confluence) are intentionally not
// exercised here — see the manual workflow_dispatch trigger for that.

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  extractChangelogBlock,
  readChangelogBlock,
  changelogBlockToStorageFormat,
  buildJql,
  buildTicketsDatasourceBlock,
  composePageBody,
} from "./publish-release-notes.mjs";

test("extractChangelogBlock returns the block for the matching version only", () => {
  const changelog = `# debtshare-frontend

## 0.3.0

### Minor Changes

- a1b2c3d: feat(DEB-80): add release notes automation

## 0.2.0

### Patch Changes

- 9f8e7d6: fix(DEB-73): fix empty state spacing
`;

  const block = extractChangelogBlock(changelog, "0.3.0");
  assert.match(block, /Minor Changes/);
  assert.match(block, /DEB-80/);
  assert.doesNotMatch(block, /DEB-73/);
});

test("extractChangelogBlock returns null when the version heading is missing", () => {
  const changelog = "# debtshare-frontend\n\n## 0.2.0\n\n- something\n";
  assert.equal(extractChangelogBlock(changelog, "9.9.9"), null);
});

test("readChangelogBlock returns null instead of throwing when CHANGELOG.md doesn't exist", () => {
  // This repo has no CHANGELOG.md yet (no Changesets release has landed),
  // so this exercises the exact ENOENT path a manual workflow_dispatch run
  // against a pre-Changesets tag hits in production.
  assert.doesNotThrow(() => readChangelogBlock("0.1.0"));
  assert.equal(readChangelogBlock("0.1.0"), null);
});

test("changelogBlockToStorageFormat converts headings, bullets and inline markdown", () => {
  const block = [
    "### Minor Changes",
    "- a1b2c3d: feat(DEB-80): add release notes automation ([#42](https://github.com/acme/repo/pull/42))",
    "- plain **bold** and `code`",
  ].join("\n");

  const html = changelogBlockToStorageFormat(block);

  assert.match(html, /<h3>Minor Changes<\/h3>/);
  assert.match(html, /<ul>/);
  assert.match(html, /<a href="https:\/\/github\.com\/acme\/repo\/pull\/42">#42<\/a>/);
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /<code>code<\/code>/);
});

test("changelogBlockToStorageFormat escapes HTML-significant characters", () => {
  const html = changelogBlockToStorageFormat("- Uses <script> & \"quotes\" and 'apostrophes'");
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&amp;/);
  assert.match(html, /&quot;quotes&quot;/);
  assert.match(html, /&apos;apostrophes&apos;/);
  assert.doesNotMatch(html, /<script>/i);
});

test("buildJql builds a `key in (...)` query ordered by creation date", () => {
  assert.equal(buildJql(["DEB-80", "DEB-2"]), "key in (DEB-80, DEB-2) ORDER BY created DESC");
});

test("buildTicketsDatasourceBlock shows a placeholder when there are no tickets", () => {
  const html = buildTicketsDatasourceBlock("https://acekode.atlassian.net", "cloud-123", []);
  assert.match(html, /<h2>Tickets de Jira<\/h2>/);
  assert.match(html, /Ningún ticket/);
});

test("buildTicketsDatasourceBlock embeds a valid, escaped Jira-issues datasource", () => {
  const html = buildTicketsDatasourceBlock("https://acekode.atlassian.net", "cloud-123", ["DEB-80", "DEB-2"]);

  assert.match(html, /<h2>Tickets de Jira<\/h2>/);
  assert.match(html, /data-card-appearance="block"/);

  const attrMatch = html.match(/data-datasource="([^"]+)"/);
  assert.ok(attrMatch, "expected a data-datasource attribute");

  const unescaped = attrMatch[1]
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  const datasource = JSON.parse(unescaped);

  assert.equal(datasource.id, "d8b75300-dfda-4519-b6cd-e49abbd50401");
  assert.equal(datasource.parameters.cloudId, "cloud-123");
  assert.equal(datasource.parameters.jql, "key in (DEB-80, DEB-2) ORDER BY created DESC");
  assert.deepEqual(
    datasource.views[0].properties.columns.map((c) => c.key),
    ["issuetype", "key", "summary", "status"],
  );
});

test("composePageBody stitches changelog and tickets sections together in order", () => {
  const body = composePageBody({
    changelogBlock: "### Minor Changes\n- did a thing",
    ticketsBlockHtml: buildTicketsDatasourceBlock("https://acekode.atlassian.net", "cloud-123", ["DEB-80"]),
  });

  const novedadesIndex = body.indexOf("<h2>Novedades</h2>");
  const ticketsIndex = body.indexOf("<h2>Tickets de Jira</h2>");

  assert.ok(novedadesIndex !== -1 && ticketsIndex !== -1);
  assert.ok(novedadesIndex < ticketsIndex, "changelog section must come before the tickets section");
});

test("composePageBody falls back to a placeholder when there is no changelog block", () => {
  const body = composePageBody({
    changelogBlock: null,
    ticketsBlockHtml: buildTicketsDatasourceBlock("https://acekode.atlassian.net", "cloud-123", []),
  });

  assert.match(body, /Sin entradas de changelog/);
});
