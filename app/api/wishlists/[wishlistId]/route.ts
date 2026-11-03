import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getWishlistById, updateWishlistName, deleteWishlist } from "@/lib/db/wishlists";

export async function GET(
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
    const wishlist = await getWishlistById(wishlistId, user.userId);
    if (!wishlist) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Wishlist not found or access denied" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ wishlist });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to fetch wishlist" } },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Wishlist name is required" } },
        { status: 400 }
      );
    }

    const updated = await updateWishlistName(wishlistId, user.userId, name);
    if (!updated) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Wishlist not found or access denied" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, name: name.trim() });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to update wishlist" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const deleted = await deleteWishlist(wishlistId, user.userId);
    if (!deleted) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Wishlist not found or access denied" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Wishlist deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to delete wishlist" } },
      { status: 500 }
    );
  }
}
