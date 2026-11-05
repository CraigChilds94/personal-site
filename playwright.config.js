const {defineConfig} = require("@playwright/test");

// Visual regression checks: builds the production site into .visual/site and
// compares full-page screenshots against the committed baselines.
// Update baselines on purpose with `pnpm test:visual:update`.
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
      // Allow sub-pixel anti-aliasing noise, nothing more
      maxDiffPixelRatio: 0.001
    }
  },

  use: {
    baseURL: "http://localhost:4173",
    channel: "chrome",
    colorScheme: "dark"
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
