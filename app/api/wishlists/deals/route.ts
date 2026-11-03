import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getWishlistDeals } from "@/lib/db/wishlists";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required to view target matches" } },
        { status: 401 }
      );
    }

    const deals = await getWishlistDeals(user.userId);
    return NextResponse.json({ deals });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to retrieve target price matches" } },
      { status: 500 }
    );
  }
}
