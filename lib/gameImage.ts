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
  // 1. Serve authentic local high-resolution cover art (JPEG) stored in /public/games/
  if (KNOWN_GAMES.has(gameId)) {
    return `/games/${gameId}.jpg`;
  }
  
  // 2. Fallback to unblocked image proxy cache for any dynamically added Steam games
  if (steamAppId) {
    return `https://images.weserv.nl/?url=shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/header.jpg`;
  }

  // 3. Fallback vector banner
  return `/games/fallback.svg`;
}

