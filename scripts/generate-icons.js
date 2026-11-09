/*
 * Generates the logo and every icon derived from it: `pnpm icons`.
 * The mark is defined once below, so change it here and regenerate rather than
 * editing the output files in site/static.
 */
const fs = require("fs");
const path = require("path");
const {chromium} = require("@playwright/test");

const ROOT = path.join(__dirname, "..");
const STATIC = path.join(ROOT, "site/static");

// Keep in step with @theme in src/css/imports/tailwind.css
const INK = "#0c0c0d";
const FG = "#e7e7ea";
const ACCENT = "#80db7e";

// Two diamonds on a 45° grid, each broken where it passes under the other.
// `gap` is how far each cut end sits from the crossing, along the stroke.
const REGULAR = {stroke: 5.5, gap: 3.2};
// Tab-sized icons get a heavier stroke and wider cuts so the weave survives at 16px
const SMALL = {stroke: 7, gap: 4.6};

const LEFT_CX = 24;
const RIGHT_CX = 44;
const CY = 24;
const HALF = 20;

function centreLines({gap}) {
  const fg = [
    [34 + gap, 34 - gap],
    [LEFT_CX + HALF, CY],
    [LEFT_CX, CY - HALF],
    [LEFT_CX - HALF, CY],
    [LEFT_CX, CY + HALF],
    [34 - gap, 34 + gap]
  ];
  const accent = [
    [34 + gap, 14 - gap],
    [RIGHT_CX, CY - HALF],
    [RIGHT_CX + HALF, CY],
    [RIGHT_CX, CY + HALF],
    [RIGHT_CX - HALF, CY],
    [34 - gap, 14 + gap]
  ];
  return {fg, accent};
}

// Expands an open polyline into a filled outline with butt ends and mitred corners
function outline(points, width) {
  const half = width / 2;
  const normals = points.slice(1).map(([x, y], i) => {
    const dx = x - points[i][0];
    const dy = y - points[i][1];
    const length = Math.hypot(dx, dy);
    return [-dy / length, dx / length];
  });
  const offset = (side) => points.map(([x, y], i) => {
    const a = normals[Math.max(i - 1, 0)];
    const b = normals[Math.min(i, normals.length - 1)];
    const scale = (side * half) / (1 + a[0] * b[0] + a[1] * b[1]);
    return [x + (a[0] + b[0]) * scale, y + (a[1] + b[1]) * scale];
  });
  return [...offset(1), ...offset(-1).reverse()];
}

const formatPoints = (points) => points
  .map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`)
  .join(" ");

function shapes(cut) {
  const {fg, accent} = centreLines(cut);
  return {fg: formatPoints(outline(fg, cut.stroke)), accent: formatPoints(outline(accent, cut.stroke))};
}

function bounds({stroke}) {
  const miter = stroke / Math.SQRT2;
  return {
    x: LEFT_CX - HALF - miter,
    y: CY - HALF - miter,
    width: RIGHT_CX - LEFT_CX + 2 * HALF + 2 * miter,
    height: 2 * HALF + 2 * miter
  };
}

// The mark as SVG elements, scaled and centred to span `width` of a square canvas
function placedMark(cut, canvas, width, colours = {fg: FG, accent: ACCENT}) {
  const box = bounds(cut);
  const scale = width / box.width;
  const tx = (canvas - box.width * scale) / 2 - box.x * scale;
  const ty = (canvas - box.height * scale) / 2 - box.y * scale;
  const {fg, accent} = shapes(cut);
  return `<g transform="translate(${+tx.toFixed(3)} ${+ty.toFixed(3)}) scale(${+scale.toFixed(4)})">` +
    `<polygon points="${fg}" fill="${colours.fg}"/><polygon points="${accent}" fill="${colours.accent}"/></g>`;
}

const svgDoc = (size, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>`;

// Canvas size, background and how much of the width the mark spans
const tile = (size, cut, markWidth) => svgDoc(size, `<rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${INK}"/>${placedMark(cut, size, size * markWidth)}`);
const fullBleed = (size, markWidth) => svgDoc(size, `<rect width="${size}" height="${size}" fill="${INK}"/>${placedMark(REGULAR, size, size * markWidth)}`);

const SMALL_TILE_WIDTH = 0.92;
const TILE_WIDTH = 0.78;
// A 0.62-wide mark keeps its corners inside the maskable safe zone (a circle of 40% radius)
const MASKABLE_WIDTH = 0.62;

const pngs = {
  "favicon-16x16.png": tile(16, SMALL, SMALL_TILE_WIDTH),
  "favicon-32x32.png": tile(32, SMALL, SMALL_TILE_WIDTH),
  "apple-touch-icon.png": fullBleed(180, 0.72),
  "android-chrome-192x192.png": tile(192, REGULAR, TILE_WIDTH),
  "android-chrome-256x256.png": tile(256, REGULAR, TILE_WIDTH),
  "android-chrome-384x384.png": tile(384, REGULAR, TILE_WIDTH),
  "android-chrome-512x512.png": tile(512, REGULAR, TILE_WIDTH),
  "maskable-icon-192x192.png": fullBleed(192, MASKABLE_WIDTH),
  "maskable-icon-512x512.png": fullBleed(512, MASKABLE_WIDTH),
  "mstile-150x150.png": svgDoc(150, placedMark(REGULAR, 150, 90)),
  "media/logo.png": svgDoc(512, placedMark(REGULAR, 512, 512))
};
const icoSizes = [16, 32, 48];

function logoSvg() {
  const box = bounds(REGULAR);
  const {fg, accent} = shapes(REGULAR);
  // Shifted so the viewBox starts at the origin
  const dx = -box.x;
  const dy = -box.y;
  const viewBox = `0 0 ${+box.width.toFixed(2)} ${+box.height.toFixed(2)}`;
  return {dx, dy, viewBox, width: Math.round(box.width), height: Math.round(box.height), fg, accent};
}

function standaloneLogo() {
  const {dx, dy, viewBox, width, height, fg, accent} = logoSvg();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">\n` +
    `  <g transform="translate(${+dx.toFixed(2)} ${+dy.toFixed(2)})">\n` +
    `    <polygon points="${fg}" fill="${FG}"/>\n    <polygon points="${accent}" fill="${ACCENT}"/>\n  </g>\n</svg>\n`;
}

function logoPartial() {
  const {dx, dy, viewBox, width, height, fg, accent} = logoSvg();
  return `<svg width="${width}" height="${height}" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">\n` +
    `  <g transform="translate(${+dx.toFixed(2)} ${+dy.toFixed(2)})">\n` +
    `    <polygon points="${fg}" style="fill: var(--color-fg)"/>\n` +
    `    <polygon points="${accent}" style="fill: var(--color-accent)"/>\n  </g>\n</svg>\n`;
}

// Safari wants a single solid colour on a square canvas
const pinnedTab = () => `${svgDoc(96, placedMark(REGULAR, 96, 96, {fg: "#000", accent: "#000"}))}\n`;

const socialCard = () => `<!doctype html>
<link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;700&display=swap" rel="stylesheet">
<body style="margin:0;width:1200px;height:630px;background:${INK};color:${FG};font-family:'Mona Sans',system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center">
  ${svgDoc(280, placedMark(REGULAR, 280, 280))}
  <div style="font-size:72px;font-weight:700;letter-spacing:-0.02em;margin-top:-16px">Craig Childs</div>
  <div style="font-size:32px;color:#a1a1aa;margin-top:12px">Senior Full-Stack Developer</div>
</body>`;

// An ICO is a small directory followed by the images, which can be plain PNGs
function buildIco(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({size, data}, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map(({data}) => data)]);
}

async function render(browser, html, width, height) {
  const page = await browser.newPage({viewport: {width, height}});
  const isDocument = html.startsWith("<!doctype");
  await page.setContent(isDocument ? html : `<!doctype html><body style="margin:0;background:transparent">${html}`, {waitUntil: "load"});
  await page.evaluate(() => document.fonts.ready);
  const data = await page.screenshot({omitBackground: true});
  await page.close();
  return data;
}

async function main() {
  const browser = await chromium.launch({channel: "chrome"});

  for (const [name, svg] of Object.entries(pngs)) {
    const size = Number(svg.match(/width="(\d+)"/)[1]);
    fs.writeFileSync(path.join(STATIC, name), await render(browser, svg, size, size));
  }

  const images = [];
  for (const size of icoSizes) {
    images.push({size, data: await render(browser, tile(size, SMALL, SMALL_TILE_WIDTH), size, size)});
  }
  fs.writeFileSync(path.join(STATIC, "favicon.ico"), buildIco(images));

  fs.writeFileSync(path.join(STATIC, "media/og-image.png"), await render(browser, socialCard(), 1200, 630));
  await browser.close();

  fs.writeFileSync(path.join(STATIC, "favicon.svg"), `${tile(64, SMALL, SMALL_TILE_WIDTH)}\n`);
  fs.writeFileSync(path.join(STATIC, "safari-pinned-tab.svg"), pinnedTab());
  fs.writeFileSync(path.join(STATIC, "logo.svg"), standaloneLogo());
  fs.writeFileSync(path.join(ROOT, "site/layouts/_partials/logo.html"), logoPartial());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
