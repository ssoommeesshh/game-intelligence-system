import { query, getDbPool } from "./mysql";

export interface RecordPriceInput {
  gameId: string;
  storeId: string;
  discountPercentage: number;
}

export interface RecordPriceResult {
  priceId: string;
  gameId: string;
  storeId: string;
  basePrice: string;
  discountPercentage: number;
  calculatedPrice: string;
  currency: string;
  recordedAt: string;
}

export async function getAllStores(): Promise<{ storeId: string; name: string; country: string | null }[]> {
  return query<any>("SELECT store_id AS storeId, name, country FROM `STORE` ORDER BY name ASC");
}

export async function getAllGamesForAdmin(): Promise<{ gameId: string; title: string; basePrice: string; steamAppId: number | null }[]> {
  return query<any>("SELECT game_id AS gameId, title, CAST(base_price AS CHAR) AS basePrice, steam_app_id AS steamAppId FROM `GAME` ORDER BY title ASC");
}

export async function recordAdminPriceObservation(input: RecordPriceInput): Promise<RecordPriceResult> {
  const { gameId, storeId, discountPercentage } = input;

  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error("Discount percentage must be between 0 and 100");
  }

  // Use the stored procedure sp_record_price_observation to demonstrate stored routine execution
  const pool = getDbPool();
  const [resultRows] = await pool.query(
    "CALL sp_record_price_observation(?, ?, ?, @new_price_id, @new_price)",
    [gameId, storeId, discountPercentage]
  );

  const [outRows] = await pool.query<any>(
    "SELECT @new_price_id AS priceId, @new_price AS calculatedPrice"
  );

  const out = outRows[0];
  const priceId = out?.priceId;
  const calculatedPrice = String(out?.calculatedPrice || "0.00");

  // Fetch game base price
  const game = await query<any>("SELECT base_price FROM `GAME` WHERE game_id = ?", [gameId]);
  const basePrice = String(game[0]?.base_price || "0.00");

  return {
    priceId,
    gameId,
    storeId,
    basePrice,
    discountPercentage,
    calculatedPrice,
    currency: "INR",
    recordedAt: new Date().toISOString(),
  };
}
