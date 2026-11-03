import { NextRequest, NextResponse } from "next/server";
import { searchGames, getAllGenres, getAllTags } from "@/lib/db/catalog";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const genreId = searchParams.get("genreId") || undefined;
    const tagId = searchParams.get("tagId") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

    const result = await searchGames({ q, genreId, tagId, page, pageSize });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to retrieve game catalog" } },
      { status: 500 }
    );
  }
}
