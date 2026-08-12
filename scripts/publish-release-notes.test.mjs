// Unit tests for the pure formatting logic in publish-release-notes.mjs
// (changelog parsing, markdown->storage-format conversion, ticket grouping).
// Run with `npm run test:scripts`. Uses node:test, not Vitest, since this
// script runs outside src/ and has no DOM/browser surface to test.

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  extractChangelogBlock,
  changelogBlockToStorageFormat,
  groupIssuesByType,
  ticketsSectionToStorageFormat,
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
  const html = changelogBlockToStorageFormat('- Uses <script> & "quotes"');
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&amp;/);
  assert.match(html, /&quot;quotes&quot;/);
  assert.doesNotMatch(html, /<script>/i);
});

test("groupIssuesByType groups and orders Story before Task before Bug, unknowns last", () => {
  const issues = [
    { key: "DEB-2", type: "Bug", summary: "b", status: "Done" },
    { key: "DEB-1", type: "Story", summary: "a", status: "Done" },
    { key: "DEB-3", type: "Chore", summary: "c", status: "Done" },
    { key: "DEB-4", type: "Task", summary: "d", status: "Done" },
  ];

  const grouped = groupIssuesByType(issues);
  const typeOrder = grouped.map(([type]) => type);

  assert.deepEqual(typeOrder, ["Story", "Task", "Bug", "Chore"]);
});

test("ticketsSectionToStorageFormat links each ticket to Jira and shows a placeholder when empty", () => {
  const grouped = [["Story", [{ key: "DEB-80", summary: "Release notes", status: "In Progress" }]]];
  const html = ticketsSectionToStorageFormat("https://acekode.atlassian.net", grouped);

  assert.match(html, /<a href="https:\/\/acekode\.atlassian\.net\/browse\/DEB-80">DEB-80<\/a>/);
  assert.match(html, /Release notes/);
  assert.match(html, /In Progress/);

  const empty = ticketsSectionToStorageFormat("https://acekode.atlassian.net", []);
  assert.match(empty, /Ningún ticket/);
});

test("composePageBody stitches changelog and tickets sections together in order", () => {
  const body = composePageBody({
    changelogBlock: "### Minor Changes\n- did a thing",
    jiraBaseUrl: "https://acekode.atlassian.net",
    groupedIssues: [["Story", [{ key: "DEB-80", summary: "Release notes", status: "Done" }]]],
  });

  const novedadesIndex = body.indexOf("<h2>Novedades</h2>");
  const ticketsIndex = body.indexOf("<h2>Tickets de Jira</h2>");

  assert.ok(novedadesIndex !== -1 && ticketsIndex !== -1);
  assert.ok(novedadesIndex < ticketsIndex, "changelog section must come before the tickets section");
});
