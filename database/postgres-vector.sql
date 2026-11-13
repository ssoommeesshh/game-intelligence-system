-- F08 semantic-discovery store. Run against POSTGRES_URL before generating vectors.
CREATE EXTENSION IF NOT EXISTS vector;

-- The flexible vector dimension means the configured embedding model creates
-- the values. No demonstration vectors are stored in this schema.
CREATE TABLE IF NOT EXISTS game_embeddings (
  game_id VARCHAR(36) PRIMARY KEY,
  embedding vector NOT NULL,
  embedding_model TEXT NOT NULL,
  source_hash CHAR(64) NOT NULL,
  source_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safe migration from the original vector(3) demo table.
DROP INDEX IF EXISTS game_embeddings_cosine_idx;
ALTER TABLE game_embeddings ALTER COLUMN embedding TYPE vector USING embedding::vector;
ALTER TABLE game_embeddings ADD COLUMN IF NOT EXISTS embedding_model TEXT;
ALTER TABLE game_embeddings ADD COLUMN IF NOT EXISTS source_hash CHAR(64);
ALTER TABLE game_embeddings ADD COLUMN IF NOT EXISTS source_updated_at TIMESTAMPTZ;
