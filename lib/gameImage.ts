const KNOWN_GAMES = new Set([
  "gam-001",
  "gam-002",
  "gam-003",
  "gam-004",
  "gam-005",
  "gam-006",
  "gam-007",
  "gam-008",
  "gam-009",
  "gam-010",
  "gam-011",
  "gam-012",
]);

export function getGameImageUrl(gameId: string, steamAppId?: number | null): string {
  // Use locally served SVG banners from /public/games/
  // Guarantees 100% instant offline loading and complete immunity from network/campus firewall blocks on steamstatic.com
  if (KNOWN_GAMES.has(gameId)) {
    return `/games/${gameId}.svg`;
  }
  return `/games/fallback.svg`;
}

