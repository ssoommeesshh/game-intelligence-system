import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateWishlistGame, removeGameFromWishlist } from "@/lib/db/wishlists";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ wishlistId: string; gameId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { wishlistId, gameId } = await params;
    const body = await request.json();
    const { targetPrice, priority } = body;

    let parsedTargetPrice: number | null | undefined = undefined;
    if (targetPrice !== undefined) {
      if (targetPrice === null || targetPrice === "") {
        parsedTargetPrice = null;
      } else {
        const num = parseFloat(targetPrice);
        if (isNaN(num) || num < 0) {
          return NextResponse.json(
            { error: { code: "INVALID_INPUT", message: "targetPrice must be non-negative" } },
            { status: 400 }
          );
        }
        parsedTargetPrice = num;
      }
    }

    if (priority !== undefined && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "priority must be LOW, MEDIUM, or HIGH" } },
        { status: 400 }
      );
    }

    const updated = await updateWishlistGame(wishlistId, user.userId, gameId, parsedTargetPrice, priority);
    if (!updated) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Wishlist entry not found or access denied" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to update wishlist entry" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ wishlistId: string; gameId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { wishlistId, gameId } = await params;
    const removed = await removeGameFromWishlist(wishlistId, user.userId, gameId);
    if (!removed) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Wishlist entry not found or access denied" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Game removed from wishlist" });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to remove game from wishlist" } },
      { status: 500 }
    );
  }
}
