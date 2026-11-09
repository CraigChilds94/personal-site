const {defineConfig} = require("@playwright/test");

// Visual regression checks: builds the production site into .visual/site and
// compares full-page screenshots against local baselines, which aren't tracked in git.
// Create or update them on purpose with `pnpm test:visual:update`.
module.exports = defineConfig({
  testDir: "tests/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  fullyParallel: true,
  reporter: [["list"], ["html", {open: "never", outputFolder: ".visual/report"}]],
  outputDir: ".visual/results",

  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      // A fixed pixel budget rather than a ratio: on a full-page screenshot even a
      // 0.1% ratio is ~3,000 pixels, enough to miss a swapped 40px logo
      maxDiffPixels: 25
    }
  },

  use: {
    baseURL: "http://localhost:4173",
    channel: "chrome",
    colorScheme: "dark",
    // Scroll animations are skipped with reduced motion, so full-page screenshots
    // show every section in its final state
    reducedMotion: "reduce"
  },

  projects: [
    {name: "desktop", use: {viewport: {width: 1280, height: 900}}},
    {name: "mobile", use: {viewport: {width: 375, height: 812}, isMobile: true, hasTouch: true, deviceScaleFactor: 2}}
  ],

  webServer: {
    command: "pnpm run build:visual && sirv .visual/site --port 4173 --quiet",
    url: "http://localhost:4173",
    reuseExistingServer: false,
    timeout: 120000
  }
});
