#!/usr/bin/env node
// Screen-reader contract checks for Streets route controls.

import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const DEFAULT_BASE_URL = "http://localhost:3000";
const baseUrl = process.env.STREETS_A11Y_BASE_URL ?? DEFAULT_BASE_URL;
const chromeCandidates = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];

const expectedPracticeModes = [
  { label: "Start to Halfway", value: "2b", checked: true },
  { label: "Start to Finish", value: "2", checked: false },
  { label: "Start to Halfway to Finish", value: "3", checked: false },
];

function assert(condition, message, failures) {
  if (!condition) {
    failures.push(message);
  }
}

async function findExistingChrome() {
  const { access } = await import("node:fs/promises");
  for (const candidate of chromeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next installed browser path.
    }
  }
  return null;
}

async function runAxe(page, route, failures) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  for (const violation of results.violations) {
    failures.push(
      `${route}: axe ${violation.id} (${violation.impact ?? "unknown impact"}) - ${violation.help}`,
    );
  }
}

async function checkPracticeModeRadios(page, failures) {
  await page.goto(`${baseUrl}/practice`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.removeItem("om-app-state");
  });
  await page.reload({ waitUntil: "networkidle" });

  await runAxe(page, "/practice", failures);

  const modes = await page
    .locator("fieldset")
    .filter({ hasText: "Practice mode" })
    .locator("label")
    .evaluateAll((labels) =>
      labels.map((label) => {
        const input = label.querySelector("input");
        const visualTitle = label.querySelector("span");
        return {
          ariaLabel: input?.getAttribute("aria-label") ?? "",
          checked: Boolean(input?.checked),
          inputRole: input?.getAttribute("type") ?? "",
          labelText: label.textContent?.trim() ?? "",
          value: input?.getAttribute("value") ?? "",
          visualHidden: visualTitle?.getAttribute("aria-hidden") ?? "",
          visualText: visualTitle?.textContent?.trim() ?? "",
        };
      }),
    );

  assert(
    modes.length === expectedPracticeModes.length,
    `/practice: expected ${expectedPracticeModes.length} mode radios, found ${modes.length}`,
    failures,
  );

  expectedPracticeModes.forEach((expected, index) => {
    const actual = modes[index];
    assert(Boolean(actual), `/practice: missing mode at position ${index + 1}`, failures);
    if (!actual) {
      return;
    }
    assert(
      actual.inputRole === "radio",
      `/practice: ${expected.label} should be rendered as a radio input`,
      failures,
    );
    assert(
      actual.ariaLabel === expected.label,
      `/practice: radio ${index + 1} accessible name should be "${expected.label}", got "${actual.ariaLabel}"`,
      failures,
    );
    assert(
      actual.visualText === expected.label,
      `/practice: visual label ${index + 1} should be "${expected.label}", got "${actual.visualText}"`,
      failures,
    );
    assert(
      actual.visualHidden === "true",
      `/practice: visual label "${expected.label}" must be aria-hidden so VoiceOver does not stop on it separately`,
      failures,
    );
    assert(
      actual.value === expected.value,
      `/practice: ${expected.label} should keep internal value "${expected.value}", got "${actual.value}"`,
      failures,
    );
    assert(
      actual.checked === expected.checked,
      `/practice: ${expected.label} checked state should be ${expected.checked}`,
      failures,
    );
    assert(
      !/^(2|2b|3)$/.test(actual.labelText),
      `/practice: mode label exposes internal ID "${actual.labelText}"`,
      failures,
    );
  });
}

async function main() {
  const executablePath = await findExistingChrome();
  const browser = await chromium.launch({
    executablePath: executablePath ?? undefined,
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const failures = [];

  try {
    await checkPracticeModeRadios(page, failures);
  } finally {
    await context.close();
    await browser.close();
  }

  if (failures.length > 0) {
    console.error("Screen-reader contract check failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Screen-reader contract check passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
