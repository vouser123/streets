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
const expectedNavLabels = [
  "Practice",
  "Timing Setup",
  "Calibration",
  "Exemplars",
  "Preferences",
  "Legacy Prototype",
];
const readyAppState = {
  version: 1,
  lastMode: "2b",
  timing: {
    clearTime: 6.5,
    fullTime: 12,
    tolerance: 0.5,
  },
  calibration: {
    acceptableToneId: "acceptable-a",
    outsideToneId: "outside-a",
    userToneId: "marker",
    outputMode: "audio-only",
    showBanner: true,
    flashAction: false,
    vibrate: false,
    syncVisualReplay: true,
    outsideVisualVariant: "up",
    userFlashContrast: "soft",
    announceCues: true,
  },
  preferences: {
    theme: "system",
    textSize: "default",
    highContrast: false,
    focusBoost: false,
    useTextLabels: true,
    reducedMotion: false,
  },
};

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

async function setPersistedAppState(page, appState) {
  await page.addInitScript((value) => {
    window.localStorage.setItem("om-app-state", JSON.stringify(value));
  }, appState);
}

async function resetAppState(page) {
  await page.addInitScript(() => {
    window.localStorage.removeItem("om-app-state");
  });
}

async function checkTaskNav(page, route, failures) {
  const navLabels = await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.textContent?.trim() ?? "").filter(Boolean));
  assert(
    JSON.stringify(navLabels) === JSON.stringify(expectedNavLabels),
    `${route}: primary navigation labels changed. Expected ${expectedNavLabels.join(", ")}, got ${navLabels.join(", ")}`,
    failures,
  );
}

async function checkTimingPage(page, failures) {
  await page.goto(`${baseUrl}/timing`, { waitUntil: "networkidle" });
  await runAxe(page, "/timing", failures);
  await checkTaskNav(page, "/timing", failures);

  const fields = await page.locator("label").evaluateAll((labels) =>
    labels
      .map((label) => {
        const input = label.querySelector("input");
        if (!input) {
          return null;
        }
        return {
          inputMode: input.getAttribute("inputmode") ?? "",
          label: label.textContent?.trim() ?? "",
          pattern: input.getAttribute("pattern") ?? "",
          type: input.getAttribute("type") ?? "",
        };
      })
      .filter(Boolean),
  );

  const expectedFields = [
    "Time to clear from left (first half)",
    "Full street crossing time",
    "Margin of error",
  ];
  expectedFields.forEach((expected, index) => {
    const actual = fields[index];
    assert(Boolean(actual), `/timing: missing field ${expected}`, failures);
    if (!actual) {
      return;
    }
    assert(
      actual.label === expected,
      `/timing: expected field label "${expected}", got "${actual.label}"`,
      failures,
    );
    assert(
      actual.type === "text",
      `/timing: ${expected} should be a text input, got "${actual.type}"`,
      failures,
    );
    assert(
      actual.inputMode === "decimal",
      `/timing: ${expected} should use decimal input mode, got "${actual.inputMode}"`,
      failures,
    );
  });
}

async function checkPracticeModeRadios(page, failures) {
  await page.goto(`${baseUrl}/practice`, { waitUntil: "networkidle" });
  await runAxe(page, "/practice", failures);
  await checkTaskNav(page, "/practice", failures);

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

async function checkCalibrationPage(page, failures) {
  await page.goto(`${baseUrl}/calibration`, { waitUntil: "networkidle" });
  await runAxe(page, "/calibration", failures);
  await checkTaskNav(page, "/calibration", failures);

  const buttonLabels = await page
    .getByRole("button")
    .evaluateAll((buttons) =>
      buttons.map((button) => button.textContent?.trim() ?? "").filter(Boolean),
    );
  const expectedButtons = [
    "Preview Medium clear tone",
    "Preview Higher clear tone",
    "Preview Lower steady tone",
    "Preview Deep steady tone",
    "Preview Marker tone",
    "Preview Confirm tone",
    "Preview user flash",
    "Preview on-target cue",
    "Preview adjustment cue",
  ];
  expectedButtons.forEach((expected) => {
    assert(buttonLabels.includes(expected), `/calibration: missing button "${expected}"`, failures);
  });
  assert(
    !buttonLabels.some((label) => /acceptable/i.test(label)),
    '/calibration: user-facing buttons should not expose "acceptable"',
    failures,
  );
}

async function checkExemplarsPage(page, failures) {
  await page.goto(`${baseUrl}/exemplars`, { waitUntil: "networkidle" });
  await runAxe(page, "/exemplars", failures);
  await checkTaskNav(page, "/exemplars", failures);

  const buttons = await page.getByRole("button").evaluateAll((elements) =>
    elements.map((element) => ({
      disabled: element.hasAttribute("disabled"),
      text: element.textContent?.trim() ?? "",
    })),
  );
  const expectedTexts = [
    "Play Start to Halfway",
    "Play Start to Finish",
    "Play Start to Halfway to Finish",
  ];
  expectedTexts.forEach((expected, index) => {
    const actual = buttons[index];
    assert(Boolean(actual), `/exemplars: missing button "${expected}"`, failures);
    if (!actual) {
      return;
    }
    assert(
      actual.text === expected,
      `/exemplars: expected "${expected}", got "${actual.text}"`,
      failures,
    );
    assert(
      !actual.disabled,
      `/exemplars: "${expected}" should be enabled with seeded timing`,
      failures,
    );
  });
}

async function checkPreferencesPage(page, failures) {
  await page.goto(`${baseUrl}/preferences`, { waitUntil: "networkidle" });
  await runAxe(page, "/preferences", failures);
  await checkTaskNav(page, "/preferences", failures);

  const checkboxes = await page
    .getByRole("checkbox")
    .evaluateAll((elements) =>
      elements.map(
        (element) =>
          element.getAttribute("aria-label") ?? element.parentElement?.textContent?.trim() ?? "",
      ),
    );
  const expectedCheckboxLabels = [
    "High contrast",
    "Focus boost",
    "Prefer text labels over shorthand",
    "Reduce motion",
  ];
  expectedCheckboxLabels.forEach((expected) => {
    assert(
      checkboxes.some((label) => label.includes(expected)),
      `/preferences: missing checkbox "${expected}"`,
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
    await resetAppState(page);
    await checkTimingPage(page, failures);
    await setPersistedAppState(page, readyAppState);
    await checkPracticeModeRadios(page, failures);
    await checkCalibrationPage(page, failures);
    await checkExemplarsPage(page, failures);
    await checkPreferencesPage(page, failures);
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
