import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const logoSvg = readFileSync(path.join(root, "app/icon.svg"), "utf8");

const innerPaths = logoSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

const DARK_BG = "#0a0a0a";
const DARK_FG = "#fafafa";
const MUTED_DARK = "#a1a1aa";

function logoBlock({ x, y, size }) {
  const scale = size / 127;
  return `<g transform="translate(${x} ${y}) scale(${scale})">${innerPaths}</g>`;
}

function appleIcon() {
  const S = 180;
  const logoSize = 132;
  const offset = (S - logoSize) / 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" rx="40" fill="${DARK_BG}"/>
  ${logoBlock({ x: offset, y: offset, size: logoSize })}
</svg>`;
}

function ogImage() {
  const W = 1200;
  const H = 630;
  const logoSize = 220;
  const logoX = 96;
  const logoY = (H - logoSize) / 2;
  const textX = logoX + logoSize + 64;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${logoBlock({ x: logoX, y: logoY, size: logoSize })}
  <g font-family="Geist, Inter, -apple-system, system-ui, sans-serif" fill="${DARK_FG}">
    <text x="${textX}" y="290" font-size="88" font-weight="700" letter-spacing="-3">OpenHive</text>
    <text x="${textX}" y="350" font-size="34" font-weight="500" fill="${DARK_FG}">Run a company of AI agents.</text>
    <text x="${textX}" y="395" font-size="34" font-weight="500" fill="${MUTED_DARK}">Ship your own dashboard.</text>
  </g>
  <text x="${logoX}" y="${H - 60}" font-family="Geist Mono, ui-monospace, monospace" font-size="22" fill="${MUTED_DARK}">npm i -g openhiveai</text>
</svg>`;
}

async function render(svg, outPath) {
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log("wrote", path.relative(root, outPath));
}

await render(appleIcon(), path.join(root, "app/apple-icon.png"));
await render(ogImage(), path.join(root, "app/opengraph-image.png"));
await render(ogImage(), path.join(root, "app/twitter-image.png"));
