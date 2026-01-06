// Utility to parse coverage/coverage-summary.json and return total line coverage
import fs from 'fs';

export function getCoveragePercent() {
  try {
    const summary = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json', 'utf-8'));
    const total = summary.total;
    return total.lines.pct;
  } catch {
    return null;
  }
}
