CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS game_embeddings (game_id VARCHAR(36) PRIMARY KEY, embedding vector(3) NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
-- Demo vectors: replace these with output from the chosen embedding pipeline.
INSERT INTO game_embeddings (game_id, embedding) VALUES
  ('gam-001', '[0.91,0.12,0.34]'), ('gam-002', '[0.78,0.16,0.41]'), ('gam-003', '[0.74,0.19,0.58]'), ('gam-004', '[0.54,0.35,0.61]'), ('gam-005', '[0.71,0.24,0.63]'), ('gam-006', '[0.65,0.49,0.32]'), ('gam-007', '[0.61,0.44,0.42]'), ('gam-008', '[0.49,0.52,0.48]'), ('gam-009', '[0.28,0.87,0.31]'), ('gam-010', '[0.72,0.27,0.52]'), ('gam-011', '[0.32,0.63,0.58]'), ('gam-012', '[0.37,0.41,0.76]')
ON CONFLICT (game_id) DO UPDATE SET embedding = EXCLUDED.embedding, updated_at = NOW();
CREATE INDEX IF NOT EXISTS game_embeddings_cosine_idx ON game_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);
