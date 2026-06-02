#!/usr/bin/env node
'use strict';

/**
 * generate-ci-summary.js
 *
 * Reads test/lint output files and writes a Markdown report
 * to $GITHUB_STEP_SUMMARY for display in the GitHub Actions UI.
 *
 * Usage:
 *   node scripts/generate-ci-summary.js --type=lint|unit|e2e
 */

const fs   = require('fs');
const path = require('path');

const args = {};
for (const arg of process.argv.slice(2)) {
  const m = arg.match(/^--([^=]+)(?:=(.+))?$/);
  if (m) args[m[1]] = m[2] !== undefined ? m[2] : true;
}

const TYPE         = args.type;
const SUMMARY_FILE = process.env.GITHUB_STEP_SUMMARY;

if (!TYPE)         { console.error('--type required'); process.exit(1); }
if (!SUMMARY_FILE) { console.error('GITHUB_STEP_SUMMARY not set'); process.exit(0); }

// ── Status helpers ─────────────────────────────────────────────────────────

const PASS = '[PASS]';
const FAIL = '[FAIL]';
const WARN = '[WARN]';
const SKIP = '[SKIP]';

function statusIcon(ok) { return ok ? PASS : FAIL; }

// ── Lint summary ───────────────────────────────────────────────────────────

function lintSummary() {
  const file = path.join(process.cwd(), 'lint-results.json');
  let errors = 0, warnings = 0, files = 0, ok = true;

  if (fs.existsSync(file)) {
    try {
      const results = JSON.parse(fs.readFileSync(file, 'utf8'));
      files = results.length;
      for (const r of results) {
        errors   += r.errorCount   || 0;
        warnings += r.warningCount || 0;
      }
      ok = errors === 0;
    } catch { ok = false; }
  } else {
    const exitFile = path.join(process.cwd(), '.lint-exit-code');
    if (fs.existsSync(exitFile)) {
      const code = parseInt(fs.readFileSync(exitFile, 'utf8').trim(), 10);
      ok = code === 0;
      errors = ok ? 0 : 1;
    }
  }

  const lines = [
    `## ${statusIcon(ok)} ESLint`,
    '',
    `| Check | Result |`,
    `|---|---|`,
    `| Status | ${ok ? '**Passed**' : '**Failed**'} |`,
    `| Files scanned | ${files > 0 ? files : 'n/a'} |`,
    `| Errors | ${errors} |`,
    `| Warnings | ${warnings} |`,
    '',
  ];
  return lines.join('\n');
}

// ── Unit test + coverage summary ───────────────────────────────────────────

function unitSummary() {
  const covFile = path.join(process.cwd(), 'coverage', 'coverage-summary.json');

  if (!fs.existsSync(covFile)) {
    return `## ${SKIP} Code Coverage\n\nCoverage report not found.\n\n`;
  }

  const cov = JSON.parse(fs.readFileSync(covFile, 'utf8'));
  const total = cov.total;

  function pct(k) {
    const p = total[k]?.pct ?? 0;
    const star = p >= 80 ? PASS : p >= 60 ? WARN : FAIL;
    return `${star} ${p}%`;
  }

  const fileRows = Object.entries(cov)
    .filter(([k]) => k !== 'total')
    .sort(([, a], [, b]) => (a.lines?.pct ?? 0) - (b.lines?.pct ?? 0))
    .slice(0, 8)
    .map(([file, data]) => {
      const rel = file.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\//, '');
      const p   = data.lines?.pct ?? 0;
      return `| \`${rel}\` | ${p >= 80 ? PASS : WARN} ${p}% |`;
    });

  const lines = [
    `## ${PASS} Code Coverage`,
    '',
    `| Metric | Coverage |`,
    `|---|---|`,
    `| Lines | ${pct('lines')} |`,
    `| Statements | ${pct('statements')} |`,
    `| Functions | ${pct('functions')} |`,
    `| Branches | ${pct('branches')} |`,
    '',
    `### Lowest coverage files`,
    '',
    `| File | Lines |`,
    `|---|---|`,
    ...fileRows,
    '',
  ];
  return lines.join('\n');
}

// ── E2E summary ────────────────────────────────────────────────────────────

function e2eSummary() {
  const file = path.join(process.cwd(), 'playwright-report', 'results.json');

  if (!fs.existsSync(file)) {
    return `## ${SKIP} E2E Tests\n\nPlaywright report not found.\n\n`;
  }

  const results = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { passed = 0, failed = 0, skipped = 0 } = results.stats || {};
  const total = passed + failed + skipped;
  const ok    = failed === 0;

  const specRows = (results.suites || []).flatMap(suite =>
    (suite.specs || []).map(spec => {
      const specOk = spec.tests?.every(t => t.results?.every(r => r.status === 'passed'));
      const label  = [suite.file || suite.title, spec.title].filter(Boolean).join(' › ');
      return `| ${specOk ? PASS : FAIL} | \`${label}\` |`;
    })
  ).slice(0, 20);

  const lines = [
    `## ${statusIcon(ok)} Playwright E2E`,
    '',
    `| Result | Count |`,
    `|---|---|`,
    `| ${PASS} Passed | ${passed} |`,
    `| ${FAIL} Failed | ${failed} |`,
    `| ${SKIP} Skipped | ${skipped} |`,
    `| Total | ${total} |`,
    '',
  ];

  if (specRows.length) {
    lines.push(
      `### Test results`,
      '',
      `| Status | Test |`,
      `|---|---|`,
      ...specRows,
      '',
    );
  }

  return lines.join('\n');
}

// ── Write ──────────────────────────────────────────────────────────────────

const generators = { lint: lintSummary, unit: unitSummary, e2e: e2eSummary };
const gen = generators[TYPE];
if (!gen) { console.error(`Unknown type: ${TYPE}`); process.exit(1); }

fs.appendFileSync(SUMMARY_FILE, gen());
console.log(`CI summary (${TYPE}) written to GITHUB_STEP_SUMMARY`);
