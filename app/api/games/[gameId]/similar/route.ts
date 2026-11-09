import { NextRequest, NextResponse } from "next/server";
import { getSimilarGames } from "@/lib/db/semantic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit"));
  const games = await getSimilarGames(gameId, requestedLimit || 6);
  return NextResponse.json({ items: games, source: "pgvector" });
}
