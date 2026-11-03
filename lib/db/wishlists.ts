import { query, execute, getDbPool } from "./mysql";
import { randomUUID } from "crypto";

export interface WishlistSummary {
  wishlistId: string;
  name: string;
  createdAt: string;
  gameCount: number;
}

export interface WishlistGameItem {
  gameId: string;
  title: string;
  steamAppId: number | null;
  basePrice: string;
  currentLowestPrice: string | null;
  historicalLowestPrice: string | null;
  targetPrice: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  addedAt: string;
  currency: string;
}

export interface WishlistDetail {
  wishlistId: string;
  userId: string;
  name: string;
  createdAt: string;
  games: WishlistGameItem[];
}

export interface WishlistDealMatch {
  wishlistId: string;
  wishlistName: string;
  gameId: string;
  title: string;
  steamAppId: number | null;
  basePrice: string;
  currentLowestPrice: string;
  historicalLowestPrice: string;
  targetPrice: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  currency: string;
  savings: string;
}

export async function getUserWishlists(userId: string): Promise<WishlistSummary[]> {
  const sql = `
    SELECT 
      w.wishlist_id AS wishlistId,
      w.name,
      DATE_FORMAT(w.created_at, '%Y-%m-%d %H:%i:%s') AS createdAt,
      COUNT(wg.game_id) AS gameCount
    FROM \`WISHLIST\` w
    LEFT JOIN \`WISHLIST_GAME\` wg ON w.wishlist_id = wg.wishlist_id
    WHERE w.user_id = ?
    GROUP BY w.wishlist_id, w.name, w.created_at
    ORDER BY w.created_at DESC
  `;
  return query<WishlistSummary>(sql, [userId]);
}

export async function getWishlistById(wishlistId: string, userId: string): Promise<WishlistDetail | null> {
  // Check ownership
  const wishlists = await query<any>(
    "SELECT wishlist_id AS wishlistId, user_id AS userId, name, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS createdAt FROM `WISHLIST` WHERE wishlist_id = ? AND user_id = ?",
    [wishlistId, userId]
  );

  if (wishlists.length === 0) {
    return null;
  }

  const w = wishlists[0];

  const gamesSql = `
    SELECT 
      wg.game_id AS gameId,
      g.title,
      g.steam_app_id AS steamAppId,
      CAST(g.base_price AS CHAR) AS basePrice,
      CAST(cur.current_lowest_price AS CHAR) AS currentLowestPrice,
      CAST(hist.historical_lowest_price AS CHAR) AS historicalLowestPrice,
      CAST(wg.target_price AS CHAR) AS targetPrice,
      wg.priority,
      DATE_FORMAT(wg.added_at, '%Y-%m-%d %H:%i:%s') AS addedAt,
      COALESCE(cur.currency, 'INR') AS currency
    FROM \`WISHLIST_GAME\` wg
    JOIN \`GAME\` g ON wg.game_id = g.game_id
    LEFT JOIN \`view_game_current_lowest\` cur ON g.game_id = cur.game_id
    LEFT JOIN \`view_game_historical_lowest\` hist ON g.game_id = hist.game_id
    WHERE wg.wishlist_id = ?
    ORDER BY wg.added_at DESC
  `;

  const games = await query<WishlistGameItem>(gamesSql, [wishlistId]);

  return {
    wishlistId: w.wishlistId,
    userId: w.userId,
    name: w.name,
    createdAt: w.createdAt,
    games,
  };
}

export async function createWishlist(
  userId: string,
  name: string,
  firstGame?: { gameId: string; targetPrice?: number | null; priority?: "LOW" | "MEDIUM" | "HIGH" }
): Promise<string> {
  const wishlistId = `wsh-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  if (firstGame && firstGame.gameId) {
    // Execute through MySQL Stored Procedure demonstrating multi-step Transaction with rollback handler
    const pool = getDbPool();
    await pool.query(
      "CALL sp_create_wishlist_with_first_game(?, ?, ?, ?, ?, ?)",
      [
        wishlistId,
        userId,
        name.trim(),
        firstGame.gameId,
        firstGame.targetPrice !== undefined ? firstGame.targetPrice : null,
        firstGame.priority || "MEDIUM",
      ]
    );
  } else {
    await execute(
      "INSERT INTO `WISHLIST` (`wishlist_id`, `user_id`, `name`, `created_at`) VALUES (?, ?, ?, UTC_TIMESTAMP())",
      [wishlistId, userId, name.trim()]
    );
  }

  return wishlistId;
}

export async function updateWishlistName(wishlistId: string, userId: string, name: string): Promise<boolean> {
  const res = await execute(
    "UPDATE `WISHLIST` SET `name` = ? WHERE `wishlist_id` = ? AND `user_id` = ?",
    [name.trim(), wishlistId, userId]
  );
  return res.affectedRows > 0;
}

export async function deleteWishlist(wishlistId: string, userId: string): Promise<boolean> {
  const res = await execute(
    "DELETE FROM `WISHLIST` WHERE `wishlist_id` = ? AND `user_id` = ?",
    [wishlistId, userId]
  );
  return res.affectedRows > 0;
}

export async function addGameToWishlist(
  wishlistId: string,
  userId: string,
  gameId: string,
  targetPrice?: number | null,
  priority: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM"
): Promise<void> {
  // Verify ownership
  const owns = await query("SELECT 1 FROM `WISHLIST` WHERE wishlist_id = ? AND user_id = ?", [wishlistId, userId]);
  if (owns.length === 0) {
    throw new Error("NOT_FOUND_OR_FORBIDDEN");
  }

  // Verify game exists
  const game = await query("SELECT 1 FROM `GAME` WHERE game_id = ?", [gameId]);
  if (game.length === 0) {
    throw new Error("GAME_NOT_FOUND");
  }

  await execute(
    `
    INSERT INTO \`WISHLIST_GAME\` (\`wishlist_id\`, \`game_id\`, \`target_price\`, \`priority\`, \`added_at\`)
    VALUES (?, ?, ?, ?, UTC_TIMESTAMP())
    ON DUPLICATE KEY UPDATE \`target_price\` = VALUES(\`target_price\`), \`priority\` = VALUES(\`priority\`)
    `,
    [wishlistId, gameId, targetPrice !== undefined ? targetPrice : null, priority]
  );
}

export async function updateWishlistGame(
  wishlistId: string,
  userId: string,
  gameId: string,
  targetPrice?: number | null,
  priority?: "LOW" | "MEDIUM" | "HIGH"
): Promise<boolean> {
  const owns = await query("SELECT 1 FROM `WISHLIST` WHERE wishlist_id = ? AND user_id = ?", [wishlistId, userId]);
  if (owns.length === 0) {
    throw new Error("NOT_FOUND_OR_FORBIDDEN");
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (targetPrice !== undefined) {
    updates.push("`target_price` = ?");
    params.push(targetPrice);
  }
  if (priority !== undefined) {
    updates.push("`priority` = ?");
    params.push(priority);
  }

  if (updates.length === 0) return true;

  params.push(wishlistId, gameId);
  const res = await execute(
    `UPDATE \`WISHLIST_GAME\` SET ${updates.join(", ")} WHERE \`wishlist_id\` = ? AND \`game_id\` = ?`,
    params
  );
  return res.affectedRows > 0;
}

export async function removeGameFromWishlist(wishlistId: string, userId: string, gameId: string): Promise<boolean> {
  const owns = await query("SELECT 1 FROM `WISHLIST` WHERE wishlist_id = ? AND user_id = ?", [wishlistId, userId]);
  if (owns.length === 0) {
    throw new Error("NOT_FOUND_OR_FORBIDDEN");
  }

  const res = await execute(
    "DELETE FROM `WISHLIST_GAME` WHERE `wishlist_id` = ? AND `game_id` = ?",
    [wishlistId, gameId]
  );
  return res.affectedRows > 0;
}

/**
 * F06: Wishlist games currently meeting their target prices
 * Compares current_lowest_price <= target_price
 */
export async function getWishlistDeals(userId: string): Promise<WishlistDealMatch[]> {
  const sql = `
    SELECT 
      w.wishlist_id AS wishlistId,
      w.name AS wishlistName,
      g.game_id AS gameId,
      g.title,
      g.steam_app_id AS steamAppId,
      CAST(g.base_price AS CHAR) AS basePrice,
      CAST(cur.current_lowest_price AS CHAR) AS currentLowestPrice,
      CAST(hist.historical_lowest_price AS CHAR) AS historicalLowestPrice,
      CAST(wg.target_price AS CHAR) AS targetPrice,
      wg.priority,
      COALESCE(cur.currency, 'INR') AS currency,
      CAST(ROUND(g.base_price - cur.current_lowest_price, 2) AS CHAR) AS savings
    FROM \`WISHLIST_GAME\` wg
    JOIN \`WISHLIST\` w ON wg.wishlist_id = w.wishlist_id
    JOIN \`GAME\` g ON wg.game_id = g.game_id
    JOIN \`view_game_current_lowest\` cur ON g.game_id = cur.game_id
    LEFT JOIN \`view_game_historical_lowest\` hist ON g.game_id = hist.game_id
    WHERE w.user_id = ?
      AND wg.target_price IS NOT NULL
      AND cur.current_lowest_price IS NOT NULL
      AND cur.current_lowest_price <= wg.target_price
    ORDER BY 
      CASE wg.priority
        WHEN 'HIGH' THEN 1
        WHEN 'MEDIUM' THEN 2
        WHEN 'LOW' THEN 3
        ELSE 4
      END ASC,
      (g.base_price - cur.current_lowest_price) DESC
  `;

  return query<WishlistDealMatch>(sql, [userId]);
}
