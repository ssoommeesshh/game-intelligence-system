import fs from "fs";
import path from "path";

const GAMES = [
  { id: "gam-001", steamAppId: 1091500, title: "Cyberpunk 2077" },
  { id: "gam-002", steamAppId: 292030, title: "The Witcher 3: Wild Hunt" },
  { id: "gam-003", steamAppId: 1245620, title: "Elden Ring" },
  { id: "gam-004", steamAppId: 1174180, title: "Red Dead Redemption 2" },
  { id: "gam-005", steamAppId: 1086940, title: "Baldur's Gate 3" },
  { id: "gam-006", steamAppId: 1145360, title: "Hades" },
  { id: "gam-007", steamAppId: 367520, title: "Hollow Knight" },
  { id: "gam-008", steamAppId: 271590, title: "Grand Theft Auto V" },
  { id: "gam-009", steamAppId: 730, title: "Counter-Strike 2" },
  { id: "gam-010", steamAppId: 1593500, title: "God of War" },
  { id: "gam-011", steamAppId: 620, title: "Portal 2" },
  { id: "gam-012", steamAppId: 413150, title: "Stardew Valley" },
];

const outDir = path.resolve("public/games");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function downloadOne(game) {
  const targetUrl = `https://images.weserv.nl/?url=shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.steamAppId}/header.jpg`;
  const dest = path.join(outDir, `${game.id}.jpg`);

  console.log(`Downloading ${game.title} from ${targetUrl}...`);
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    console.log(` Saved ${game.id}.jpg (${buf.byteLength} bytes)`);
    return true;
  } catch (err) {
    console.error(` Failed to download ${game.title}:`, err.message);
    return false;
  }
}

async function main() {
  console.log("Starting download of real game header cover art...");
  for (const game of GAMES) {
    await downloadOne(game);
  }
  console.log("All covers processed!");
}

main();
