import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordAdminPriceObservation } from "@/lib/db/admin";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required to record price observations" } },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Administrative privilege required" } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { gameId, storeId, discountPercentage } = body;

    if (!gameId || typeof gameId !== "string") {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "gameId is required" } },
        { status: 400 }
      );
    }

    if (!storeId || typeof storeId !== "string") {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "storeId is required" } },
        { status: 400 }
      );
    }

    const discount = parseFloat(discountPercentage);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "discountPercentage must be a number between 0 and 100" } },
        { status: 400 }
      );
    }

    const result = await recordAdminPriceObservation({
      gameId,
      storeId,
      discountPercentage: discount,
    });

    return NextResponse.json({ success: true, observation: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: error.message || "Failed to record price observation" } },
      { status: 500 }
    );
  }
}
