import fs from "fs";
import path from "path";

const outDir = path.resolve("public/games");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const games = [
  {
    id: "gam-001",
    title: "CYBERPUNK 2077",
    subtitle: "NIGHT CITY • ACTION RPG",
    bg1: "#0a0a14",
    bg2: "#1f1738",
    accent: "#fee715",
    accent2: "#00f0ff",
    badge: "CD PROJEKT RED",
    tagline: "WAKE THE F*** UP, SAMURAI"
  },
  {
    id: "gam-002",
    title: "THE WITCHER 3",
    subtitle: "WILD HUNT • ACTION RPG",
    bg1: "#12090b",
    bg2: "#2d0f14",
    accent: "#ef4444",
    accent2: "#f59e0b",
    badge: "METACRITIC 93",
    tagline: "THE CONTINENT AWAITS"
  },
  {
    id: "gam-003",
    title: "ELDEN RING",
    subtitle: "LANDS BETWEEN • ACTION RPG",
    bg1: "#0d0a06",
    bg2: "#2a1c0d",
    accent: "#f59e0b",
    accent2: "#fbbf24",
    badge: "GOTY WINNER",
    tagline: "RISE, TARNISHED"
  },
  {
    id: "gam-004",
    title: "RED DEAD REDEMPTION II",
    subtitle: "OUTLAWS TO THE END • OPEN WORLD",
    bg1: "#1c0606",
    bg2: "#450a0a",
    accent: "#ef4444",
    accent2: "#f97316",
    badge: "ROCKSTAR GAMES",
    tagline: "VAN DER LINDE GANG"
  },
  {
    id: "gam-005",
    title: "BALDUR'S GATE 3",
    subtitle: "FORGOTTEN REALMS • D&D RPG",
    bg1: "#120826",
    bg2: "#2e1065",
    accent: "#a855f7",
    accent2: "#f59e0b",
    badge: "LARIAN STUDIOS",
    tagline: "GATHER YOUR PARTY"
  },
  {
    id: "gam-006",
    title: "HADES",
    subtitle: "BATTLE OUT OF HELL • ROGUELIKE",
    bg1: "#1a0808",
    bg2: "#3f0d0d",
    accent: "#f97316",
    accent2: "#eab308",
    badge: "SUPERGIANT GAMES",
    tagline: "IN THE NAME OF HADES"
  },
  {
    id: "gam-007",
    title: "HOLLOW KNIGHT",
    subtitle: "HALLOWNEST • METROIDVANIA",
    bg1: "#050b14",
    bg2: "#0f172a",
    accent: "#38bdf8",
    accent2: "#94a3b8",
    badge: "TEAM CHERRY",
    tagline: "DESCEND INTO THE DEPTHS"
  },
  {
    id: "gam-008",
    title: "GRAND THEFT AUTO V",
    subtitle: "LOS SANTOS • OPEN WORLD ACTION",
    bg1: "#061811",
    bg2: "#064e3b",
    accent: "#10b981",
    accent2: "#34d399",
    badge: "OVER 180M COPIES",
    tagline: "WELCOME TO LOS SANTOS"
  },
  {
    id: "gam-009",
    title: "COUNTER-STRIKE 2",
    subtitle: "COMPETITIVE TACTICAL FPS",
    bg1: "#0c0d12",
    bg2: "#1e2433",
    accent: "#f97316",
    accent2: "#38bdf8",
    badge: "VALVE • FREE TO PLAY",
    tagline: "THE NEXT ERA OF CS"
  },
  {
    id: "gam-010",
    title: "GOD OF WAR",
    subtitle: "NORSE REALM • ACTION ADVENTURE",
    bg1: "#07131f",
    bg2: "#0c4a6e",
    accent: "#38bdf8",
    accent2: "#ef4444",
    badge: "SANTA MONICA STUDIO",
    tagline: "FATHER AND SON"
  },
  {
    id: "gam-011",
    title: "PORTAL 2",
    subtitle: "APERTURE SCIENCE • PUZZLE CO-OP",
    bg1: "#0f172a",
    bg2: "#1e293b",
    accent: "#0284c7",
    accent2: "#ea580c",
    badge: "METACRITIC 95",
    tagline: "NOW YOU'RE THINKING WITH PORTALS"
  },
  {
    id: "gam-012",
    title: "STARDEW VALLEY",
    subtitle: "VALLEY LIFE • RELAXING SIM",
    bg1: "#061b11",
    bg2: "#14532d",
    accent: "#4ade80",
    accent2: "#facc15",
    badge: "CONCERNEDAPE",
    tagline: "ESCAPE TO THE COUNTRYSIDE"
  }
];

for (const g of games) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 215" width="460" height="215">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${g.bg1}" />
      <stop offset="100%" stop-color="${g.bg2}" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${g.accent}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${g.accent2}" stop-opacity="0.8" />
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="460" height="215" fill="url(#bg)" />
  <rect width="460" height="215" fill="url(#grid)" />

  <!-- Ambient glow circle -->
  <circle cx="380" cy="40" r="140" fill="${g.accent}" opacity="0.12" filter="blur(40px)" />
  <circle cx="80" cy="180" r="100" fill="${g.accent2}" opacity="0.12" filter="blur(30px)" />

  <!-- Decorative technical lines -->
  <line x1="30" y1="35" x2="120" y2="35" stroke="${g.accent}" stroke-width="2" opacity="0.8" />
  <line x1="30" y1="185" x2="430" y2="185" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  <rect x="30" y="30" width="4" height="10" fill="${g.accent}" />

  <!-- Top Badge -->
  <rect x="330" y="25" width="100" height="20" rx="4" fill="rgba(0,0,0,0.5)" stroke="${g.accent}" stroke-width="1" stroke-opacity="0.6"/>
  <text x="380" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="${g.accent}" text-anchor="middle" letter-spacing="1">${g.badge}</text>

  <!-- Main Game Title -->
  <text x="30" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Montserrat', sans-serif" font-size="24" font-weight="900" fill="#ffffff" letter-spacing="1">
    ${g.title}
  </text>

  <!-- Subtitle / Genre -->
  <text x="30" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="${g.accent}" letter-spacing="1.5">
    ${g.subtitle}
  </text>

  <!-- Tagline -->
  <text x="30" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="400" fill="#94a3b8" letter-spacing="0.5">
    ${g.tagline}
  </text>

  <!-- Bottom Accent Stripe -->
  <rect x="0" y="211" width="460" height="4" fill="url(#glow)" />
</svg>`;

  fs.writeFileSync(path.join(outDir, `${g.id}.svg`), svg, "utf-8");
  console.log(`Generated banner for ${g.id} (${g.title})`);
}
