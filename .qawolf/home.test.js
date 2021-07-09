const qawolf = require("qawolf");

let browser;
let context;

beforeAll(async () => {
  browser = await qawolf.launch();
  context = await browser.newContext();
  await qawolf.register(context);
});

afterAll(async () => {
  await qawolf.stopVideos();
  await browser.close();
});

test("articles_goes_to_medium", async () => {
  const page = await context.newPage();
  await page.goto("https://craigchilds.me/", { waitUntil: "domcontentloaded" });
  await qawolf.scroll(page, "html", { x: 0, y: 0 });
  await page.click("text=Articles");
  await page.goto("https://craig-childs.medium.com/");
  const page = await qawolf.waitForPage(context, 0, { waitUntil: "domcontentloaded" });
  await page.goBack();
  // 🐺 create code here
});