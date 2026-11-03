import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameById } from "@/lib/db/catalog";
import { getGamePrices } from "@/lib/db/prices";
import { getCurrentUser } from "@/lib/auth";
import { getUserWishlists } from "@/lib/db/wishlists";
import AddToWishlistModal from "./AddToWishlistModal";
import { 
  ArrowLeft, 
  Calendar, 
  Building2, 
  Code, 
  Monitor, 
  Tag as TagIcon, 
  TrendingDown, 
  History, 
  Store as StoreIcon, 
  Clock,
  Layers
} from "lucide-react";

interface PageProps {
  params: Promise<{
    gameId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function GameDetailPage({ params }: PageProps) {
  const { gameId } = await params;
  const [game, priceData, user] = await Promise.all([
    getGameById(gameId),
    getGamePrices(gameId),
    getCurrentUser(),
  ]);

  if (!game) {
    notFound();
  }

  const userWishlists = user ? await getUserWishlists(user.userId) : [];

  const imageUrl = game.steamAppId
    ? `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.steamAppId}/header.jpg`
    : null;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/games"
          className="inline-flex items-center space-x-1.5 text-sm text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Game Catalog</span>
        </Link>
      </div>

      {/* Main Header / Hero Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Banner Image */}
          <div className="md:col-span-5 bg-slate-950 flex items-center justify-center p-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={game.title}
                className="w-full h-auto rounded-xl shadow object-cover"
              />
            ) : (
              <div className="h-64 w-full flex items-center justify-center text-slate-600 bg-slate-900/50 rounded-xl">
                No Preview Image
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {game.title}
                </h1>
                {game.metacriticScore !== null && (
                  <div
                    className={`px-3 py-1 rounded-lg text-sm font-extrabold border ${
                      game.metacriticScore >= 90
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-700"
                        : "bg-cyan-950/80 text-cyan-400 border-cyan-700"
                    }`}
                  >
                    {game.metacriticScore} Metascore
                  </div>
                )}
              </div>

              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                {game.description}
              </p>

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 text-xs text-slate-300">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block mb-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Publisher
                  </span>
                  <span className="font-semibold text-slate-200">
                    {game.publisher?.name || game.publisherName || "N/A"}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block mb-0.5 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5" /> Developers
                  </span>
                  <span className="font-semibold text-slate-200">
                    {game.developers.map((d) => d.name).join(", ") || "N/A"}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Release Date
                  </span>
                  <span className="font-semibold text-slate-200">
                    {game.releaseDate || "TBA"}
                  </span>
                </div>
              </div>

              {/* Supported Platforms */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
                  <Monitor className="w-3.5 h-3.5" /> Platforms:
                </span>
                {game.platforms.map((p) => (
                  <span
                    key={p.platformId}
                    className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {p.name}
                  </span>
                ))}
              </div>

              {/* Genres & Tags */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
                  <TagIcon className="w-3.5 h-3.5" /> Genres:
                </span>
                {game.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 text-[11px] rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                  >
                    {g}
                  </span>
                ))}
                {game.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 text-slate-400 border border-slate-700/80"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Price Action Card */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Catalog Base Price</span>
                <span className="text-xl font-bold text-white">
                  ₹{parseFloat(game.basePrice).toFixed(2)}
                </span>
              </div>

              {user ? (
                <AddToWishlistModal
                  gameId={game.gameId}
                  gameTitle={game.title}
                  wishlists={userWishlists}
                  basePrice={game.basePrice}
                />
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg border border-slate-700 transition"
                >
                  Login to Add to Wishlist
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRICE TRACKING SECTION (F03) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <span>Current Store Prices & Recorded History</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                F03 &bull; MySQL
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Distinguishing today&apos;s latest recorded store observations from historical lows in the dataset ({priceData?.currency || "INR"}).
            </p>
          </div>
        </div>

        {/* Pricing Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Reference Base Price
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              ₹{parseFloat(game.basePrice).toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Catalog standard price</span>
          </div>

          <div className="bg-slate-900 border border-emerald-900/60 rounded-xl p-4 shadow-sm bg-gradient-to-br from-slate-900 to-emerald-950/20">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Current Lowest Store Price
            </span>
            <div className="text-2xl font-extrabold text-emerald-300 mt-1">
              {priceData?.currentLowestPrice ? (
                `₹${parseFloat(priceData.currentLowestPrice).toFixed(2)}`
              ) : (
                <span className="text-sm font-normal text-slate-500">No observation</span>
              )}
            </div>
            <span className="text-[11px] text-emerald-500/80 mt-1 block">
              Calculated across latest store observations
            </span>
          </div>

          <div className="bg-slate-900 border border-cyan-900/60 rounded-xl p-4 shadow-sm bg-gradient-to-br from-slate-900 to-cyan-950/20">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
              Observed Historical Low
            </span>
            <div className="text-2xl font-extrabold text-cyan-300 mt-1">
              {priceData?.historicalLowestPrice ? (
                `₹${parseFloat(priceData.historicalLowestPrice).toFixed(2)}`
              ) : (
                <span className="text-sm font-normal text-slate-500">No observation</span>
              )}
            </div>
            <span className="text-[11px] text-cyan-500/80 mt-1 block">
              Lowest observed snapshot in our dataset
            </span>
          </div>
        </div>

        {/* Table 1: Latest Store Price Observations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <StoreIcon className="w-4 h-4 text-cyan-400" />
              <span>Latest Price by Store</span>
            </h3>
            <span className="text-xs text-slate-500">
              Resolved via SQL Window Function (ROW_NUMBER() partition)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Store</th>
                  <th className="px-6 py-3 font-semibold">Current Price</th>
                  <th className="px-6 py-3 font-semibold">Discount</th>
                  <th className="px-6 py-3 font-semibold">Observation Timestamp (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {!priceData?.currentStorePrices || priceData.currentStorePrices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-slate-500 text-xs">
                      No per-store observations recorded yet.
                    </td>
                  </tr>
                ) : (
                  priceData.currentStorePrices.map((sp) => (
                    <tr key={sp.priceId} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-3.5 font-medium text-white flex items-center space-x-2">
                        <span>{sp.storeName}</span>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-emerald-400">
                        ₹{parseFloat(sp.price).toFixed(2)}{" "}
                        <span className="text-xs font-normal text-slate-500">{sp.currency}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        {sp.discountPercentage > 0 ? (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            -{sp.discountPercentage}% OFF
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Full Price</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{sp.recordedAt}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Chronological Price History */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Chronological Price History Log</span>
            </h3>
            <span className="text-xs text-slate-500">All historical snapshots</span>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Recorded Date (UTC)</th>
                  <th className="px-6 py-3 font-semibold">Store</th>
                  <th className="px-6 py-3 font-semibold">Observed Price</th>
                  <th className="px-6 py-3 font-semibold">Discount Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {!priceData?.priceHistory || priceData.priceHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-slate-500 text-xs">
                      No historical recordings available.
                    </td>
                  </tr>
                ) : (
                  priceData.priceHistory.map((ph) => (
                    <tr key={ph.priceId} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-3 text-xs text-slate-400">{ph.recordedAt}</td>
                      <td className="px-6 py-3 text-white font-medium">{ph.storeName}</td>
                      <td className="px-6 py-3 font-semibold text-slate-200">
                        ₹{parseFloat(ph.price).toFixed(2)} {ph.currency}
                      </td>
                      <td className="px-6 py-3">
                        {ph.discountPercentage > 0 ? (
                          <span className="text-emerald-400 font-medium text-xs">
                            {ph.discountPercentage}% off
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">0%</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SOMESH'S INTEGRATION SECTION (F07 - MongoDB Full Game Details) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Full Game Content & Extended Details</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              F07 &bull; MongoDB Integration Zone
            </span>
          </div>
          <span className="text-xs text-slate-500">Owned by Somesh</span>
        </div>

        <div className="bg-slate-950/80 border border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2">
          <p className="text-sm font-medium text-slate-300">
            MongoDB Game Details Component Boundary
          </p>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            This designated section is ready to host Somesh&apos;s <code className="text-indigo-300">&lt;GameFullDetails gameId=&quot;{game.gameId}&quot; /&gt;</code> component.
            As agreed in the feature requirements, missing MongoDB documents will gracefully display here without affecting the authoritative MySQL catalog above.
          </p>
        </div>
      </div>
    </div>
  );
}
