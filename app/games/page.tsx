import Link from "next/link";
import { searchGames, getAllGenres, getAllTags } from "@/lib/db/catalog";
import { Search, Filter, Tag as TagIcon, Sparkles, ExternalLink } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    genreId?: string;
    tagId?: string;
    page?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function GamesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const genreId = params.genreId || "";
  const tagId = params.tagId || "";
  const page = parseInt(params.page || "1", 10);
  const pageSize = 12;

  const [catalogResult, genres, tags] = await Promise.all([
    searchGames({ q, genreId, tagId, page, pageSize }),
    getAllGenres(),
    getAllTags(),
  ]);

  const { items: games, total, totalPages } = catalogResult;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <span>Relational Game Catalog</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
            F02 &bull; MySQL
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Browse authoritative catalog records stored in MySQL, with multi-table joins across publishers, genres, tags, and current price observations.
        </p>

        {/* Filter Controls Form */}
        <form method="GET" action="/games" className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search games by title..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              name="genreId"
              defaultValue={genreId}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.genreId} value={g.genreId}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              name="tagId"
              defaultValue={tagId}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t.tagId} value={t.tagId}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1 flex space-x-2">
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 px-3 rounded-lg text-sm transition shadow-sm"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Catalog Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">{games.length}</span> of{" "}
          <span className="font-semibold text-white">{total}</span> games
          {(q || genreId || tagId) && (
            <Link href="/games" className="ml-3 text-cyan-400 hover:underline text-xs">
              Clear filters
            </Link>
          )}
        </div>
        <div>
          Page {page} of {totalPages || 1}
        </div>
      </div>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400">No games found matching the selected search criteria.</p>
          <Link href="/games" className="mt-3 inline-block text-cyan-400 text-sm hover:underline">
            Reset filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const imageUrl = game.steamAppId
              ? `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.steamAppId}/header.jpg`
              : null;

            return (
              <div
                key={game.gameId}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col group shadow-sm hover:shadow-md"
              >
                {/* Game Banner Image */}
                <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-slate-600 text-sm font-medium flex items-center space-x-1">
                      <Sparkles className="w-4 h-4" />
                      <span>{game.title}</span>
                    </div>
                  )}

                  {game.metacriticScore !== null && (
                    <div
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold border ${
                        game.metacriticScore >= 90
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-700/80"
                          : game.metacriticScore >= 75
                          ? "bg-cyan-950/80 text-cyan-400 border-cyan-700/80"
                          : "bg-amber-950/80 text-amber-400 border-amber-700/80"
                      }`}
                    >
                      {game.metacriticScore} MC
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/games/${game.gameId}`}
                        className="font-bold text-lg text-white hover:text-cyan-400 transition line-clamp-1"
                      >
                        {game.title}
                      </Link>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {game.publisherName ? `By ${game.publisherName}` : "Independent"}
                      {game.releaseDate && ` &bull; ${game.releaseDate.substring(0, 4)}`}
                    </p>

                    <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>

                    {/* Genres & Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {game.genres.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {g}
                        </span>
                      ))}
                      {game.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-950/40 text-cyan-300/80 border border-cyan-900/40"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                        Current Lowest
                      </div>
                      <div className="text-sm font-bold text-emerald-400">
                        {game.currentLowestPrice ? (
                          <span>
                            ₹{parseFloat(game.currentLowestPrice).toFixed(2)}{" "}
                            {parseFloat(game.currentLowestPrice) < parseFloat(game.basePrice) && (
                              <span className="text-xs line-through text-slate-500 font-normal ml-1">
                                ₹{parseFloat(game.basePrice).toFixed(2)}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs font-normal">
                            No price observation
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/games/${game.gameId}`}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white border border-slate-700 transition"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <Link
            href={`/games?q=${encodeURIComponent(q)}&genreId=${encodeURIComponent(
              genreId
            )}&tagId=${encodeURIComponent(tagId)}&page=${Math.max(1, page - 1)}`}
            className={`px-3 py-1.5 rounded-md text-sm border ${
              page <= 1
                ? "pointer-events-none text-slate-600 border-slate-800"
                : "text-slate-300 border-slate-700 hover:bg-slate-800"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/games?q=${encodeURIComponent(q)}&genreId=${encodeURIComponent(
                genreId
              )}&tagId=${encodeURIComponent(tagId)}&page=${p}`}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                p === page
                  ? "bg-cyan-600 text-white border-cyan-500 font-bold"
                  : "text-slate-300 border-slate-700 hover:bg-slate-800"
              }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={`/games?q=${encodeURIComponent(q)}&genreId=${encodeURIComponent(
              genreId
            )}&tagId=${encodeURIComponent(tagId)}&page=${Math.min(totalPages, page + 1)}`}
            className={`px-3 py-1.5 rounded-md text-sm border ${
              page >= totalPages
                ? "pointer-events-none text-slate-600 border-slate-800"
                : "text-slate-300 border-slate-700 hover:bg-slate-800"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
