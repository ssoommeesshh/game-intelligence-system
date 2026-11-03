import { query } from "./mysql";

export interface GameSummary {
  gameId: string;
  title: string;
  description: string;
  steamAppId: number | null;
  rawgId: number | null;
  basePrice: string;
  releaseDate: string | null;
  ageRating: string | null;
  metacriticScore: number | null;
  publisherName: string | null;
  currentLowestPrice: string | null;
  historicalLowestPrice: string | null;
  currency: string;
  genres: string[];
  tags: string[];
}

export interface GameDetail extends GameSummary {
  developers: { developerId: string; name: string; role: string }[];
  platforms: { platformId: string; name: string; manufacturer: string | null }[];
  publisher: { publisherId: string; name: string; country: string | null; website: string | null } | null;
}

export interface CatalogFilterOptions {
  q?: string;
  genreId?: string;
  tagId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function searchGames(options: CatalogFilterOptions = {}): Promise<PaginatedResult<GameSummary>> {
  const page = Math.max(1, Number(options.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(options.pageSize) || 20));
  const offset = (page - 1) * pageSize;

  const conditions: string[] = ["1=1"];
  const params: any[] = [];

  if (options.q && options.q.trim()) {
    conditions.push("g.title LIKE ?");
    params.push(`%${options.q.trim()}%`);
  }

  if (options.genreId && options.genreId.trim()) {
    conditions.push("EXISTS (SELECT 1 FROM `GAME_GENRE` gg WHERE gg.game_id = g.game_id AND gg.genre_id = ?)");
    params.push(options.genreId.trim());
  }

  if (options.tagId && options.tagId.trim()) {
    conditions.push("EXISTS (SELECT 1 FROM `GAME_TAG` gt WHERE gt.game_id = g.game_id AND gt.tag_id = ?)");
    params.push(options.tagId.trim());
  }

  const whereClause = conditions.join(" AND ");

  // Count total matching items
  const countSql = `SELECT COUNT(*) AS total FROM \`GAME\` g WHERE ${whereClause}`;
  const countRows = await query<{ total: number }>(countSql, params);
  const total = Number(countRows[0]?.total || 0);

  // Fetch paginated games using view_game_catalog_summary
  const dataSql = `
    SELECT 
      g.game_id AS gameId,
      g.title,
      g.description,
      g.steam_app_id AS steamAppId,
      g.rawg_id AS rawgId,
      CAST(g.base_price AS CHAR) AS basePrice,
      DATE_FORMAT(g.release_date, '%Y-%m-%d') AS releaseDate,
      g.age_rating AS ageRating,
      g.metacritic_score AS metacriticScore,
      p.name AS publisherName,
      CAST(cur.current_lowest_price AS CHAR) AS currentLowestPrice,
      CAST(hist.historical_lowest_price AS CHAR) AS historicalLowestPrice,
      COALESCE(cur.currency, 'INR') AS currency
    FROM GAME g
    LEFT JOIN PUBLISHER p ON g.publisher_id = p.publisher_id
    LEFT JOIN view_game_current_lowest cur ON g.game_id = cur.game_id
    LEFT JOIN view_game_historical_lowest hist ON g.game_id = hist.game_id
    WHERE ${whereClause}
    ORDER BY g.title ASC
    LIMIT ? OFFSET ?
  `;

  const rows = await query<any>(dataSql, [...params, pageSize, offset]);

  // Aggregate genres and tags for the selected games
  if (rows.length === 0) {
    return { items: [], total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  const gameIds = rows.map((r: any) => r.gameId);
  const placeholders = gameIds.map(() => "?").join(",");

  const genresRows = await query<any>(
    `SELECT gg.game_id, gen.name FROM \`GAME_GENRE\` gg JOIN \`GENRE\` gen ON gg.genre_id = gen.genre_id WHERE gg.game_id IN (${placeholders})`,
    gameIds
  );
  const tagsRows = await query<any>(
    `SELECT gt.game_id, t.name FROM \`GAME_TAG\` gt JOIN \`TAG\` t ON gt.tag_id = t.tag_id WHERE gt.game_id IN (${placeholders})`,
    gameIds
  );

  const genresByGame: Record<string, string[]> = {};
  genresRows.forEach((r: any) => {
    if (!genresByGame[r.game_id]) genresByGame[r.game_id] = [];
    genresByGame[r.game_id].push(r.name);
  });

  const tagsByGame: Record<string, string[]> = {};
  tagsRows.forEach((r: any) => {
    if (!tagsByGame[r.game_id]) tagsByGame[r.game_id] = [];
    tagsByGame[r.game_id].push(r.name);
  });

  const items: GameSummary[] = rows.map((r: any) => ({
    gameId: r.gameId,
    title: r.title,
    description: r.description,
    steamAppId: r.steamAppId,
    rawgId: r.rawgId,
    basePrice: r.basePrice,
    releaseDate: r.releaseDate,
    ageRating: r.ageRating,
    metacriticScore: r.metacriticScore,
    publisherName: r.publisherName,
    currentLowestPrice: r.currentLowestPrice,
    historicalLowestPrice: r.historicalLowestPrice,
    currency: r.currency,
    genres: genresByGame[r.gameId] || [],
    tags: tagsByGame[r.gameId] || [],
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getGameById(gameId: string): Promise<GameDetail | null> {
  const games = await query<any>(
    `
    SELECT 
      g.game_id AS gameId,
      g.title,
      g.description,
      g.steam_app_id AS steamAppId,
      g.rawg_id AS rawgId,
      CAST(g.base_price AS CHAR) AS basePrice,
      DATE_FORMAT(g.release_date, '%Y-%m-%d') AS releaseDate,
      g.age_rating AS ageRating,
      g.metacritic_score AS metacriticScore,
      p.publisher_id AS publisherId,
      p.name AS publisherName,
      p.country AS publisherCountry,
      p.website AS publisherWebsite,
      CAST(cur.current_lowest_price AS CHAR) AS currentLowestPrice,
      CAST(hist.historical_lowest_price AS CHAR) AS historicalLowestPrice,
      COALESCE(cur.currency, 'INR') AS currency
    FROM GAME g
    LEFT JOIN PUBLISHER p ON g.publisher_id = p.publisher_id
    LEFT JOIN view_game_current_lowest cur ON g.game_id = cur.game_id
    LEFT JOIN view_game_historical_lowest hist ON g.game_id = hist.game_id
    WHERE g.game_id = ?
    `,
    [gameId]
  );

  if (games.length === 0) {
    return null;
  }

  const g = games[0];

  // Fetch developers
  const devRows = await query<any>(
    `
    SELECT d.developer_id AS developerId, d.name, gd.role
    FROM \`GAME_DEVELOPER\` gd
    JOIN \`DEVELOPER\` d ON gd.developer_id = d.developer_id
    WHERE gd.game_id = ?
    `,
    [gameId]
  );

  // Fetch genres
  const genreRows = await query<any>(
    `
    SELECT gen.name
    FROM \`GAME_GENRE\` gg
    JOIN \`GENRE\` gen ON gg.genre_id = gen.genre_id
    WHERE gg.game_id = ?
    ORDER BY gen.name
    `,
    [gameId]
  );

  // Fetch tags
  const tagRows = await query<any>(
    `
    SELECT t.name
    FROM \`GAME_TAG\` gt
    JOIN \`TAG\` t ON gt.tag_id = t.tag_id
    WHERE gt.game_id = ?
    ORDER BY t.name
    `,
    [gameId]
  );

  // Fetch platforms
  const platformRows = await query<any>(
    `
    SELECT p.platform_id AS platformId, p.name, p.manufacturer
    FROM \`GAME_PLATFORM\` gp
    JOIN \`PLATFORM\` p ON gp.platform_id = p.platform_id
    WHERE gp.game_id = ?
    ORDER BY p.name
    `,
    [gameId]
  );

  return {
    gameId: g.gameId,
    title: g.title,
    description: g.description,
    steamAppId: g.steamAppId,
    rawgId: g.rawgId,
    basePrice: g.basePrice,
    releaseDate: g.releaseDate,
    ageRating: g.ageRating,
    metacriticScore: g.metacriticScore,
    publisherName: g.publisherName,
    currentLowestPrice: g.currentLowestPrice,
    historicalLowestPrice: g.historicalLowestPrice,
    currency: g.currency,
    publisher: g.publisherId
      ? {
          publisherId: g.publisherId,
          name: g.publisherName,
          country: g.publisherCountry,
          website: g.publisherWebsite,
        }
      : null,
    developers: devRows,
    genres: genreRows.map((r: any) => r.name),
    tags: tagRows.map((r: any) => r.name),
    platforms: platformRows,
  };
}

/**
 * Exported reusable query explicitly requested by Somesh for F08 Semantic Search.
 * Preserves the exact ordering of input gameIds!
 */
export async function getGamesByIds(gameIds: string[]): Promise<GameSummary[]> {
  if (!gameIds || gameIds.length === 0) {
    return [];
  }

  const placeholders = gameIds.map(() => "?").join(",");
  const rows = await query<any>(
    `
    SELECT 
      g.game_id AS gameId,
      g.title,
      g.description,
      g.steam_app_id AS steamAppId,
      g.rawg_id AS rawgId,
      CAST(g.base_price AS CHAR) AS basePrice,
      DATE_FORMAT(g.release_date, '%Y-%m-%d') AS releaseDate,
      g.age_rating AS ageRating,
      g.metacritic_score AS metacriticScore,
      p.name AS publisherName,
      CAST(cur.current_lowest_price AS CHAR) AS currentLowestPrice,
      CAST(hist.historical_lowest_price AS CHAR) AS historicalLowestPrice,
      COALESCE(cur.currency, 'INR') AS currency
    FROM GAME g
    LEFT JOIN PUBLISHER p ON g.publisher_id = p.publisher_id
    LEFT JOIN view_game_current_lowest cur ON g.game_id = cur.game_id
    LEFT JOIN view_game_historical_lowest hist ON g.game_id = hist.game_id
    WHERE g.game_id IN (${placeholders})
    `,
    gameIds
  );

  const genresRows = await query<any>(
    `SELECT gg.game_id, gen.name FROM \`GAME_GENRE\` gg JOIN \`GENRE\` gen ON gg.genre_id = gen.genre_id WHERE gg.game_id IN (${placeholders})`,
    gameIds
  );
  const tagsRows = await query<any>(
    `SELECT gt.game_id, t.name FROM \`GAME_TAG\` gt JOIN \`TAG\` t ON gt.tag_id = t.tag_id WHERE gt.game_id IN (${placeholders})`,
    gameIds
  );

  const genresByGame: Record<string, string[]> = {};
  genresRows.forEach((r: any) => {
    if (!genresByGame[r.game_id]) genresByGame[r.game_id] = [];
    genresByGame[r.game_id].push(r.name);
  });

  const tagsByGame: Record<string, string[]> = {};
  tagsRows.forEach((r: any) => {
    if (!tagsByGame[r.game_id]) tagsByGame[r.game_id] = [];
    tagsByGame[r.game_id].push(r.name);
  });

  const gameMap = new Map<string, GameSummary>();
  rows.forEach((r: any) => {
    gameMap.set(r.gameId, {
      gameId: r.gameId,
      title: r.title,
      description: r.description,
      steamAppId: r.steamAppId,
      rawgId: r.rawgId,
      basePrice: r.basePrice,
      releaseDate: r.releaseDate,
      ageRating: r.ageRating,
      metacriticScore: r.metacriticScore,
      publisherName: r.publisherName,
      currentLowestPrice: r.currentLowestPrice,
      historicalLowestPrice: r.historicalLowestPrice,
      currency: r.currency,
      genres: genresByGame[r.gameId] || [],
      tags: tagsByGame[r.gameId] || [],
    });
  });

  // Return strictly in the order requested by gameIds (crucial for pgvector ranking)
  const orderedResults: GameSummary[] = [];
  for (const id of gameIds) {
    const item = gameMap.get(id);
    if (item) {
      orderedResults.push(item);
    }
  }

  return orderedResults;
}

export async function getAllGenres(): Promise<{ genreId: string; name: string }[]> {
  const rows = await query<any>("SELECT genre_id AS genreId, name FROM `GENRE` ORDER BY name ASC");
  return rows;
}

export async function getAllTags(): Promise<{ tagId: string; name: string }[]> {
  const rows = await query<any>("SELECT tag_id AS tagId, name FROM `TAG` ORDER BY name ASC");
  return rows;
}
