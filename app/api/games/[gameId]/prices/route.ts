import { NextRequest, NextResponse } from "next/server";
import { getGamePrices } from "@/lib/db/prices";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    if (!gameId || gameId.trim().length === 0) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Game ID is required" } },
        { status: 400 }
      );
    }

    const priceData = await getGamePrices(gameId);
    if (!priceData) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Game not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json(priceData);
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to retrieve prices" } },
      { status: 500 }
    );
  }
}
