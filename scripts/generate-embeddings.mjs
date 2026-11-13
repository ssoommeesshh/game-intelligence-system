import { createHash } from "node:crypto";
import mysql from "mysql2/promise";
import { MongoClient } from "mongodb";
import pg from "pg";

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set in .env.local`);
  return value;
};

const ollamaUrl = (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, "");
const model = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

async function createEmbedding(input) {
  const response = await fetch(`${ollamaUrl}/api/embed`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, input }),
  });
  if (!response.ok) throw new Error(`Ollama embedding request failed (${response.status}): ${await response.text()}`);
  const payload = await response.json();
  const embedding = payload.embeddings?.[0];
  if (!Array.isArray(embedding) || embedding.length === 0) throw new Error("Ollama returned no embedding vector");
  return embedding;
}

function vectorLiteral(values) {
  if (!values.every((value) => typeof value === "number" && Number.isFinite(value))) throw new Error("Embedding contains a non-numeric value");
  return `[${values.join(",")}]`;
}

const mysqlConnection = await mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: required("MYSQL_USER"),
  password: required("MYSQL_PASSWORD"),
  database: required("MYSQL_DATABASE"),
});
const mongo = new MongoClient(required("MONGODB_URI"));
const postgres = new pg.Pool({ connectionString: required("POSTGRES_URL") });

try {
  await mongo.connect();
  const [catalog] = await mysqlConnection.query(`
    SELECT g.game_id AS gameId, g.title, g.description,
      GROUP_CONCAT(DISTINCT genre.name ORDER BY genre.name SEPARATOR ', ') AS genres,
      GROUP_CONCAT(DISTINCT tag.name ORDER BY tag.name SEPARATOR ', ') AS tags
    FROM GAME g
    LEFT JOIN GAME_GENRE gg ON gg.game_id = g.game_id
    LEFT JOIN GENRE genre ON genre.genre_id = gg.genre_id
    LEFT JOIN GAME_TAG gt ON gt.game_id = g.game_id
    LEFT JOIN TAG tag ON tag.tag_id = gt.tag_id
    GROUP BY g.game_id, g.title, g.description
    ORDER BY g.game_id
  `);
  const documents = await mongo.db(process.env.MONGODB_DATABASE || "game_intelligence")
    .collection("game_details")
    .find({}, { projection: { _id: 0, gameId: 1, longDescription: 1, story: 1, features: 1 } })
    .toArray();
  const detailByGame = new Map(documents.map((document) => [document.gameId, document]));

  let generated = 0;
  let unchanged = 0;
  for (const game of catalog) {
    const details = detailByGame.get(game.gameId);
    const source = [
      `Title: ${game.title}`,
      `Catalog description: ${game.description}`,
      details?.longDescription && `Extended description: ${details.longDescription}`,
      details?.story && `Story: ${details.story}`,
      details?.features?.length && `Features: ${details.features.join(", ")}`,
      game.genres && `Genres: ${game.genres}`,
      game.tags && `Tags: ${game.tags}`,
    ].filter(Boolean).join("\n").slice(0, 7000);
    const sourceHash = createHash("sha256").update(source).digest("hex");
    const existing = await postgres.query("SELECT source_hash, embedding_model FROM game_embeddings WHERE game_id = $1", [game.gameId]);
    if (existing.rows[0]?.source_hash === sourceHash && existing.rows[0]?.embedding_model === model) {
      unchanged += 1;
      continue;
    }
    const embedding = await createEmbedding(source);
    await postgres.query(`
      INSERT INTO game_embeddings (game_id, embedding, embedding_model, source_hash, source_updated_at, updated_at)
      VALUES ($1, $2::vector, $3, $4, NOW(), NOW())
      ON CONFLICT (game_id) DO UPDATE SET embedding = EXCLUDED.embedding, embedding_model = EXCLUDED.embedding_model,
        source_hash = EXCLUDED.source_hash, source_updated_at = NOW(), updated_at = NOW()
    `, [game.gameId, vectorLiteral(embedding), model, sourceHash]);
    generated += 1;
    console.log(`Embedded ${game.gameId}: ${game.title}`);
  }
  console.log(`Finished: ${generated} generated, ${unchanged} unchanged, ${catalog.length} catalog games.`);
} finally {
  await Promise.allSettled([mysqlConnection.end(), mongo.close(), postgres.end()]);
}
