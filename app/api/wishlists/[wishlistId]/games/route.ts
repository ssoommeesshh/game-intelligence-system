import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { addGameToWishlist } from "@/lib/db/wishlists";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ wishlistId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { wishlistId } = await params;
    const body = await request.json();
    const { gameId, targetPrice, priority } = body;

    if (!gameId || typeof gameId !== "string") {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "gameId is required" } },
        { status: 400 }
      );
    }

    if (priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "priority must be LOW, MEDIUM, or HIGH" } },
        { status: 400 }
      );
    }

    const parsedTargetPrice = targetPrice !== undefined && targetPrice !== null && targetPrice !== ""
      ? parseFloat(targetPrice)
      : null;

    if (parsedTargetPrice !== null && (isNaN(parsedTargetPrice) || parsedTargetPrice < 0)) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "targetPrice must be a non-negative number" } },
        { status: 400 }
      );
    }

    await addGameToWishlist(wishlistId, user.userId, gameId, parsedTargetPrice, priority || "MEDIUM");

    return NextResponse.json({ success: true, message: "Game added to wishlist" }, { status: 201 });
  } catch (error: any) {
    if (error.message === "NOT_FOUND_OR_FORBIDDEN") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Wishlist not found or access denied" } },
        { status: 403 }
      );
    }
    if (error.message === "GAME_NOT_FOUND") {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Game does not exist" } },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to add game to wishlist" } },
      { status: 500 }
    );
  }
}
