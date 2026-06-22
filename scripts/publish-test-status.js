#!/usr/bin/env node
'use strict';

/**
 * publish-test-status.js
 *
 * Posts the unit test pass/total count as a GitHub commit status so it can
 * be read back over the public REST API (job summaries can't be).
 * Used by the portfolio site's "Vanguard Pipeline" live readout.
 *
 * Requires: GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_SHA (all set by Actions).
 */

const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(process.cwd(), 'test-results.json');
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY;
const SHA = process.env.GITHUB_SHA;

if (!TOKEN || !REPO || !SHA) {
  console.error('Missing GITHUB_TOKEN, GITHUB_REPOSITORY, or GITHUB_SHA — skipping.');
  process.exit(0);
}

if (!fs.existsSync(RESULTS_FILE)) {
  console.error('test-results.json not found — skipping.');
  process.exit(0);
}

const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
const passed = results.numPassedTests ?? 0;
const total = results.numTotalTests ?? 0;
const ok = results.success === true;

fetch(`https://api.github.com/repos/${REPO}/statuses/${SHA}`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
  },
  body: JSON.stringify({
    state: ok ? 'success' : 'failure',
    context: 'tests/vitest',
    description: `${passed}/${total} tests passed`,
  }),
}).then((res) => {
  if (!res.ok) {
    console.error('Failed to publish status:', res.status);
    process.exit(0);
  }
  console.log(`Published status: ${passed}/${total} tests passed`);
});
