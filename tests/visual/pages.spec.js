const {test, expect} = require("@playwright/test");

const pages = [
  {name: "home", path: "/"},
  {name: "projects", path: "/projects/"},
  {name: "coaching", path: "/coaching/"},
  {name: "not-found", path: "/404.html"}
];

for (const {name, path} of pages) {
  test(`${name} matches baseline`, async({page}) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      // The footer shows the current year, which would fail every baseline each January
      mask: [page.getByText(/^© \d{4}/)]
    });
  });
}
