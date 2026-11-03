import { query } from "./mysql";

export interface StorePriceObservation {
  priceId: string;
  gameId: string;
  storeId: string;
  storeName: string;
  price: string;
  currency: string;
  discountPercentage: number;
  recordedAt: string;
}

export interface PriceHistoryItem {
  priceId: string;
  storeId: string;
  storeName: string;
  price: string;
  currency: string;
  discountPercentage: number;
  recordedAt: string;
}

export interface GamePriceSummary {
  gameId: string;
  basePrice: string;
  currency: string;
  currentLowestPrice: string | null;
  historicalLowestPrice: string | null;
  currentStorePrices: StorePriceObservation[];
  priceHistory: PriceHistoryItem[];
}

export async function getGamePrices(gameId: string): Promise<GamePriceSummary | null> {
  // Validate game exists
  const gameRows = await query<any>(
    "SELECT game_id, base_price FROM `GAME` WHERE game_id = ?",
    [gameId]
  );

  if (gameRows.length === 0) {
    return null;
  }

  const basePrice = String(gameRows[0].base_price);

  // 1. Fetch latest price per store using view_latest_store_prices
  const storePrices = await query<any>(
    `
    SELECT 
      price_id AS priceId,
      game_id AS gameId,
      store_id AS storeId,
      store_name AS storeName,
      CAST(price AS CHAR) AS price,
      currency,
      CAST(discount_percentage AS DOUBLE) AS discountPercentage,
      DATE_FORMAT(recorded_at, '%Y-%m-%d %H:%i:%s') AS recordedAt
    FROM \`view_latest_store_prices\`
    WHERE game_id = ?
    ORDER BY price ASC, store_name ASC
    `,
    [gameId]
  );

  // 2. Fetch current lowest price from view_game_current_lowest
  const curRows = await query<any>(
    "SELECT CAST(current_lowest_price AS CHAR) AS currentLowest, currency FROM `view_game_current_lowest` WHERE game_id = ?",
    [gameId]
  );

  // 3. Fetch historical lowest price from view_game_historical_lowest
  const histRows = await query<any>(
    "SELECT CAST(historical_lowest_price AS CHAR) AS historicalLowest, currency FROM `view_game_historical_lowest` WHERE game_id = ?",
    [gameId]
  );

  // 4. Fetch full price history ordered chronologically
  const history = await query<any>(
    `
    SELECT 
      ph.price_id AS priceId,
      ph.store_id AS storeId,
      s.name AS storeName,
      CAST(ph.price AS CHAR) AS price,
      ph.currency,
      CAST(ph.discount_percentage AS DOUBLE) AS discountPercentage,
      DATE_FORMAT(ph.recorded_at, '%Y-%m-%d %H:%i:%s') AS recordedAt
    FROM \`PRICE_HISTORY\` ph
    JOIN \`STORE\` s ON ph.store_id = s.store_id
    WHERE ph.game_id = ?
    ORDER BY ph.recorded_at DESC, ph.price_id DESC
    LIMIT 100
    `,
    [gameId]
  );

  return {
    gameId,
    basePrice,
    currency: curRows[0]?.currency || "INR",
    currentLowestPrice: curRows[0]?.currentLowest || null,
    historicalLowestPrice: histRows[0]?.historicalLowest || null,
    currentStorePrices: storePrices,
    priceHistory: history,
  };
}
