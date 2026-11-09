import "server-only";

import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE || "game_intelligence";

declare global { var mongoClientPromise: Promise<MongoClient> | undefined; }

function getClient(): Promise<MongoClient> | null {
  if (!uri) return null;
  if (!global.mongoClientPromise) global.mongoClientPromise = new MongoClient(uri).connect();
  return global.mongoClientPromise;
}

export async function getMongoDatabase(): Promise<Db | null> {
  const client = getClient();
  return client ? (await client).db(databaseName) : null;
}

export interface GameFullDetailDocument {
  gameId: string;
  longDescription: string;
  story?: string;
  features?: string[];
  systemRequirements?: { minimum?: string[]; recommended?: string[] };
  screenshots?: { url: string; alt?: string }[];
  updatedAt?: Date;
}

/** MongoDB enriches MySQL catalog data; it is never an availability dependency. */
export async function getGameFullDetails(gameId: string): Promise<GameFullDetailDocument | null> {
  try {
    const db = await getMongoDatabase();
    if (!db) return null;
    const document = await db.collection<GameFullDetailDocument>("game_details").findOne({ gameId });
    if (!document) return null;
    return { gameId: document.gameId, longDescription: document.longDescription, story: document.story, features: document.features ?? [], systemRequirements: document.systemRequirements, screenshots: document.screenshots ?? [], updatedAt: document.updatedAt };
  } catch { return null; }
}
