import "server-only";
import { Pool } from "pg";
import { getGamesByIds, type GameSummary } from "./catalog";

declare global { var semanticPool: Pool | undefined; }

function getPool(): Pool | null {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) return null;
  if (!global.semanticPool) global.semanticPool = new Pool({ connectionString });
  return global.semanticPool;
}

export interface SimilarGame extends GameSummary { similarity: number; }

/** pgvector provides the ranking; MySQL hydrates canonical catalog records in that order. */
export async function getSimilarGames(gameId: string, limit = 6): Promise<SimilarGame[]> {
  const pool = getPool();
  if (!pool) return [];
  const safeLimit = Math.min(Math.max(Math.floor(limit) || 6, 1), 12);
  try {
    const result = await pool.query<{ game_id: string; similarity: string | number }>(`
      SELECT candidate.game_id, 1 - (candidate.embedding <=> source.embedding) AS similarity
      FROM game_embeddings AS source JOIN game_embeddings AS candidate ON candidate.game_id <> source.game_id
      WHERE source.game_id = $1 ORDER BY candidate.embedding <=> source.embedding LIMIT $2`, [gameId, safeLimit]);
    const games = await getGamesByIds(result.rows.map((row) => row.game_id));
    const scores = new Map(result.rows.map((row) => [row.game_id, Number(row.similarity)]));
    return games.map((game) => ({ ...game, similarity: scores.get(game.gameId) ?? 0 }));
  } catch { return []; }
}
