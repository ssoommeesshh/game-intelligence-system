import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserWishlists, createWishlist } from "@/lib/db/wishlists";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const wishlists = await getUserWishlists(user.userId);
    return NextResponse.json({ wishlists });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to retrieve wishlists" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, firstGame } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Wishlist name is required" } },
        { status: 400 }
      );
    }

    const wishlistId = await createWishlist(user.userId, name, firstGame);
    return NextResponse.json({ wishlistId, name: name.trim() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: error.message || "Failed to create wishlist" } },
      { status: 500 }
    );
  }
}
