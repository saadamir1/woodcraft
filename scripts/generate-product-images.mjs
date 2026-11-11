import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "public", "products");
fs.mkdirSync(dir, { recursive: true });

const items = [
  ["walnut-cutting-board", "Cutting Board", "#5c3d22"],
  ["spice-box-6", "Spice Box", "#7a5c3a"],
  ["serving-tray-oval", "Serving Tray", "#8b6914"],
  ["bread-board", "Bread Board", "#6b4423"],
  ["salt-cellar", "Salt Cellar", "#a67c52"],
  ["utensil-crock", "Utensil Crock", "#4a3728"],
  ["salad-bowl", "Salad Bowl", "#9c6644"],
  ["coaster-set-4", "Coasters", "#c4a574"],
  ["rolling-pin", "Rolling Pin", "#8d6e63"],
  ["toy-stacking-rings", "Stacking Rings", "#d4a574"],
  ["toy-block-set", "Block Set", "#e8b86d"],
  ["toy-rattle", "Baby Rattle", "#c98a3a"],
  ["toy-car", "Push Car", "#a1887f"],
  ["toy-puzzle-animals", "Animal Puzzle", "#bcaaa4"],
  ["gift-box-kitchen", "Gift Box", "#6d4c41"],
  ["wall-shelf-small", "Wall Shelf", "#795548"],
  ["hero-home", "WoodCraft", "#3d2914"],
];

for (const [slug, label, color] of items) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="#2a1c10"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="#f7f1e8"/>
  <rect x="48" y="48" width="704" height="904" rx="40" fill="url(#g)"/>
  <circle cx="620" cy="180" r="90" fill="rgba(255,252,247,0.12)"/>
  <circle cx="160" cy="780" r="120" fill="rgba(255,252,247,0.08)"/>
  <text x="400" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="#fff8ef">${label}</text>
  <text x="400" y="530" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="rgba(255,248,239,0.75)">WoodCraft</text>
</svg>`;
  fs.writeFileSync(path.join(dir, `${slug}.svg`), svg);
}

console.log(`Wrote ${items.length} product images to public/products`);
