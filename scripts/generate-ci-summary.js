#!/usr/bin/env node
'use strict';

/**
 * generate-ci-summary.js
 *
 * Reads test/lint output files and writes a professional HTML report
 * to $GITHUB_STEP_SUMMARY for display in the GitHub Actions UI.
 *
 * Usage:
 *   node scripts/generate-ci-summary.js --type=lint|unit|e2e
 *
 * Expected input files:
 *   lint  : lint-results.json  (ESLint JSON formatter output)
 *   unit  : coverage/coverage-summary.json  (Vitest v8 coverage)
 *   e2e   : playwright-report/results.json  (Playwright JSON reporter)
 */

const fs   = require('fs');
const path = require('path');

const args = {};
for (const arg of process.argv.slice(2)) {
  const m = arg.match(/^--([^=]+)(?:=(.+))?$/);
  if (m) args[m[1]] = m[2] !== undefined ? m[2] : true;
}

const TYPE          = args.type;
const SUMMARY_FILE  = process.env.GITHUB_STEP_SUMMARY;

if (!TYPE) { console.error('--type required'); process.exit(1); }
if (!SUMMARY_FILE) { console.error('GITHUB_STEP_SUMMARY not set'); process.exit(0); }

// ── Icon helpers (Unicode only, no emojis) ─────────────────────────────────

const ICON = {
  pass:    '<span style="color:#4ade80;font-weight:700;">&#10003;</span>',
  fail:    '<span style="color:#FF5F1F;font-weight:700;">&#10007;</span>',
  warn:    '<span style="color:#f59e0b;font-weight:700;">&#9651;</span>',
  skip:    '<span style="color:#94A3B8;">&#9135;</span>',
  bullet:  '<span style="color:#94A3B8;">&#9679;</span>',
};

const badge = (ok) => ok
  ? '<span style="background:#14532d;color:#4ade80;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.05em;">PASS</span>'
  : '<span style="background:#450a0a;color:#FF5F1F;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.05em;">FAIL</span>';

// ── Shared HTML wrapper ────────────────────────────────────────────────────

function wrap(title, body) {
  return `
<table style="width:100%;border-collapse:collapse;font-family:ui-monospace,monospace;font-size:13px;">
  <thead>
    <tr style="background:#0d1014;border-bottom:1px solid #1e293b;">
      <th colspan="4" style="text-align:left;padding:10px 14px;color:#E2E8F0;font-size:14px;font-weight:600;letter-spacing:0.03em;">
        ${title}
      </th>
    </tr>
  </thead>
  ${body}
</table>
`;
}

function row(...cells) {
  const tds = cells.map((c, i) =>
    `<td style="padding:7px 14px;border-bottom:1px solid #1e293b;color:#E2E8F0;${i === 0 ? 'width:40%;' : ''}">${c}</td>`
  ).join('');
  return `<tr>${tds}</tr>`;
}

// ── Lint summary ───────────────────────────────────────────────────────────

function lintSummary() {
  const file = path.join(process.cwd(), 'lint-results.json');
  let errors = 0, warnings = 0, files = 0;

  if (fs.existsSync(file)) {
    try {
      const results = JSON.parse(fs.readFileSync(file, 'utf8'));
      files = results.length;
      for (const r of results) {
        errors   += r.errorCount   || 0;
        warnings += r.warningCount || 0;
      }
    } catch { errors = -1; }
  } else {
    // No JSON output — try to infer pass from exit code written by CI
    const exitFile = path.join(process.cwd(), '.lint-exit-code');
    if (fs.existsSync(exitFile)) {
      const code = parseInt(fs.readFileSync(exitFile, 'utf8').trim(), 10);
      errors = code === 0 ? 0 : 1;
    }
  }

  const ok = errors === 0;
  const body = `
    <tbody>
      ${row('Status', badge(ok))}
      ${row('Files scanned', files > 0 ? String(files) : 'n/a')}
      ${row(`${ICON.fail} Errors`, `<strong style="color:${errors > 0 ? '#FF5F1F' : '#4ade80'}">${errors}</strong>`)}
      ${row(`${ICON.warn} Warnings`, `<strong style="color:${warnings > 0 ? '#f59e0b' : '#94A3B8'}">${warnings}</strong>`)}
    </tbody>
  `;
  return wrap(`${ok ? ICON.pass : ICON.fail} &nbsp; ESLint`, body);
}

// ── Unit test + coverage summary ───────────────────────────────────────────

function unitSummary() {
  const covFile = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
  let html = '';

  // Coverage table
  if (fs.existsSync(covFile)) {
    const cov = JSON.parse(fs.readFileSync(covFile, 'utf8'));
    const total = cov.total;
    const pct = (k) => {
      const p = total[k]?.pct ?? 0;
      const ok = p >= 80;
      return `<span style="color:${ok ? '#4ade80' : p >= 60 ? '#f59e0b' : '#FF5F1F'};font-weight:600;">${p}%</span>`;
    };

    const fileRows = Object.entries(cov)
      .filter(([k]) => k !== 'total')
      .sort(([, a], [, b]) => (a.lines?.pct ?? 0) - (b.lines?.pct ?? 0))
      .slice(0, 10)
      .map(([file, data]) => {
        const rel = file.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\//, '');
        const p = data.lines?.pct ?? 0;
        const ok = p >= 80;
        return row(
          `<span style="color:#94A3B8;">${rel}</span>`,
          `${ok ? ICON.pass : ICON.warn} ${pct('lines')}`,
        );
      }).join('');

    const body = `
      <tbody>
        <tr style="background:#0a0f0c;">
          <td style="padding:7px 14px;color:#94A3B8;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;">Metric</td>
          <td style="padding:7px 14px;color:#94A3B8;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;">Coverage</td>
        </tr>
        ${row('Lines',      pct('lines'))}
        ${row('Statements', pct('statements'))}
        ${row('Functions',  pct('functions'))}
        ${row('Branches',   pct('branches'))}
        <tr><td colspan="2" style="padding:10px 14px 4px;color:#94A3B8;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;border-top:1px solid #1e293b;">Lowest coverage files</td></tr>
        ${fileRows}
      </tbody>
    `;
    html += wrap(`${ICON.bullet} &nbsp; Code Coverage`, body);
  }

  return html || wrap(`${ICON.bullet} &nbsp; Unit Tests`, '<tbody>' + row('Coverage report', 'Not generated') + '</tbody>');
}

// ── E2E summary ────────────────────────────────────────────────────────────

function e2eSummary() {
  const file = path.join(process.cwd(), 'playwright-report', 'results.json');
  if (!fs.existsSync(file)) {
    return wrap(`${ICON.bullet} &nbsp; E2E Tests`, '<tbody>' + row('Results', 'Report not found') + '</tbody>');
  }

  const results = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { passed = 0, failed = 0, skipped = 0, expected = 0 } = results.stats || {};
  const ok = failed === 0;

  const suiteRows = (results.suites || []).flatMap(suite =>
    (suite.specs || []).map(spec => {
      const specOk = spec.tests?.every(t => t.results?.every(r => r.status === 'passed'));
      return row(
        `<span style="color:#94A3B8;">${suite.file || suite.title || 'unknown'}</span> &nbsp; ${spec.title}`,
        specOk ? ICON.pass : ICON.fail,
      );
    })
  ).slice(0, 20).join('');

  const body = `
    <tbody>
      ${row('Status', badge(ok))}
      ${row(`${ICON.pass} Passed`, `<strong style="color:#4ade80;">${passed}</strong>`)}
      ${row(`${ICON.fail} Failed`, `<strong style="color:${failed > 0 ? '#FF5F1F' : '#94A3B8'}">${failed}</strong>`)}
      ${row(`${ICON.skip} Skipped`, `<span style="color:#94A3B8;">${skipped}</span>`)}
      ${row('Total', String(expected || passed + failed + skipped))}
      ${suiteRows ? `<tr><td colspan="2" style="padding:10px 14px 4px;color:#94A3B8;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;border-top:1px solid #1e293b;">Test results</td></tr>${suiteRows}` : ''}
    </tbody>
  `;
  return wrap(`${ok ? ICON.pass : ICON.fail} &nbsp; Playwright E2E`, body);
}

// ── Write ──────────────────────────────────────────────────────────────────

const generators = { lint: lintSummary, unit: unitSummary, e2e: e2eSummary };
const gen = generators[TYPE];
if (!gen) { console.error(`Unknown type: ${TYPE}`); process.exit(1); }

const html = gen();
fs.appendFileSync(SUMMARY_FILE, html + '\n');
console.log(`CI summary (${TYPE}) written to GITHUB_STEP_SUMMARY`);
