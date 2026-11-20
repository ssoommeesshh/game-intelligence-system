"use client";

import { getGameImageUrl } from "@/lib/gameImage";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  Plus, 
  Trash2, 
  Edit2, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Tag, 
  ArrowRight,
  TrendingDown,
  Layers
} from "lucide-react";
import { WishlistSummary, WishlistDetail, WishlistDealMatch } from "@/lib/db/wishlists";

interface WishlistClientProps {
  initialWishlists: WishlistSummary[];
  initialDeals: WishlistDealMatch[];
  initialSelectedWishlist: WishlistDetail | null;
  catalogGames: { gameId: string; title: string; basePrice: string }[];
}

export default function WishlistClient({
  initialWishlists,
  initialDeals,
  initialSelectedWishlist,
  catalogGames,
}: WishlistClientProps) {
  const router = useRouter();
  const [wishlists, setWishlists] = useState(initialWishlists);
  const [deals, setDeals] = useState(initialDeals);
  const [currentWishlist, setCurrentWishlist] = useState<WishlistDetail | null>(
    initialSelectedWishlist
  );

  // Modals & form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [createWithGame, setCreateWithGame] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(catalogGames[0]?.gameId || "");
  const [firstGameTarget, setFirstGameTarget] = useState("");
  const [firstGamePriority, setFirstGamePriority] = useState<"LOW" | "MEDIUM" | "HIGH">("HIGH");

  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Switch active wishlist tab
  const handleSelectWishlist = async (wishlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/wishlists/${wishlistId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to load wishlist");
      setCurrentWishlist(data.wishlist);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create Wishlist (with optional multi-step transaction)
  const handleCreateWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const payload: any = { name: newWishlistName.trim() };
      if (createWithGame && selectedGameId) {
        payload.firstGame = {
          gameId: selectedGameId,
          targetPrice: firstGameTarget ? parseFloat(firstGameTarget) : null,
          priority: firstGamePriority,
        };
      }

      const res = await fetch("/api/wishlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to create wishlist");

      setShowCreateModal(false);
      setNewWishlistName("");
      setCreateWithGame(false);
      router.refresh();
      // Reload wishlist
      handleSelectWishlist(data.wishlistId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Rename Wishlist
  const handleRenameWishlist = async (wishlistId: string) => {
    if (!renameText.trim()) return;
    try {
      const res = await fetch(`/api/wishlists/${wishlistId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameText.trim() }),
      });
      if (!res.ok) throw new Error("Failed to rename wishlist");

      setWishlists((prev) =>
        prev.map((w) => (w.wishlistId === wishlistId ? { ...w, name: renameText.trim() } : w))
      );
      if (currentWishlist?.wishlistId === wishlistId) {
        setCurrentWishlist({ ...currentWishlist, name: renameText.trim() });
      }
      setRenameId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete Wishlist
  const handleDeleteWishlist = async (wishlistId: string) => {
    if (!confirm("Are you sure you want to delete this entire wishlist?")) return;
    try {
      const res = await fetch(`/api/wishlists/${wishlistId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete wishlist");

      const remaining = wishlists.filter((w) => w.wishlistId !== wishlistId);
      setWishlists(remaining);
      if (remaining.length > 0) {
        handleSelectWishlist(remaining[0].wishlistId);
      } else {
        setCurrentWishlist(null);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Remove Game from Wishlist
  const handleRemoveGame = async (gameId: string) => {
    if (!currentWishlist) return;
    try {
      const res = await fetch(`/api/wishlists/${currentWishlist.wishlistId}/games/${gameId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove game");

      setCurrentWishlist({
        ...currentWishlist,
        games: currentWishlist.games.filter((g) => g.gameId !== gameId),
      });
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Update Game Target / Priority
  const handleUpdateGame = async (
    gameId: string,
    targetPrice: string | null,
    priority: "LOW" | "MEDIUM" | "HIGH"
  ) => {
    if (!currentWishlist) return;
    try {
      const res = await fetch(`/api/wishlists/${currentWishlist.wishlistId}/games/${gameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
          priority,
        }),
      });
      if (!res.ok) throw new Error("Failed to update wishlist game");

      setCurrentWishlist({
        ...currentWishlist,
        games: currentWishlist.games.map((g) =>
          g.gameId === gameId ? { ...g, targetPrice, priority } : g
        ),
      });
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: TARGET PRICE DEALS (F06) */}
      <div className="bg-gradient-to-r from-pink-950/40 via-slate-900 to-slate-900 border border-pink-900/60 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-pink-900/40">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-pink-400" />
              <span>Target-Price Matches</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-700">
                F06 &bull; Active Deals
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Games in your personal wishlists whose current lowest price meets or is below your target price (current &le; target).
            </p>
          </div>
          <span className="text-sm font-bold text-pink-400 bg-pink-950/80 px-3 py-1 rounded-lg border border-pink-800">
            {deals.length} Matches Found
          </span>
        </div>

        {deals.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No games currently meet their target prices in your wishlists.
            <p className="text-slate-500 mt-1">
              (Admins can record new store discounts under <Link href="/admin/prices" className="text-cyan-400 underline">Admin Pricing</Link> to trigger deals!)
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {deals.map((deal) => {
              const imgUrl = getGameImageUrl(deal.gameId, deal.steamAppId);

              return (
                <div
                  key={`${deal.wishlistId}-${deal.gameId}`}
                  className="bg-slate-950 border border-pink-900/50 rounded-xl overflow-hidden hover:border-pink-600/80 transition flex flex-col justify-between shadow"
                >
                  {imgUrl && (
                    <div className="h-32 bg-slate-900 relative">
                      <img src={imgUrl} alt={deal.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-pink-900/90 text-pink-200 border border-pink-700">
                        {deal.wishlistName}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700">
                        Target Met!
                      </div>
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <Link
                        href={`/games/${deal.gameId}`}
                        className="font-bold text-sm text-white hover:text-cyan-400 transition line-clamp-1"
                      >
                        {deal.title}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {deal.priority} PRIORITY
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          Save ₹{parseFloat(deal.savings).toFixed(2)} off base
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Current Price</span>
                        <span className="font-extrabold text-emerald-400 text-sm">
                          ₹{parseFloat(deal.currentLowestPrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Your Target</span>
                        <span className="font-bold text-slate-300">
                          ₹{parseFloat(deal.targetPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/games/${deal.gameId}`}
                      className="w-full py-1.5 text-center text-xs font-semibold rounded bg-pink-950/80 hover:bg-pink-900 text-pink-300 border border-pink-800 transition block"
                    >
                      View Price Comparison
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: PERSONAL WISHLISTS (F04) */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-500 fill-current" />
              <span>Personal Wishlists Management</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                F04 &bull; MySQL
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Protected by server-side owner checks. Demonstrates multi-step transactions with rollback protection.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Wishlist</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wishlist Tabs */}
        {wishlists.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            <p>You have no wishlists created yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 inline-flex items-center space-x-1 text-cyan-400 font-semibold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create one now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {wishlists.map((w) => (
                <button
                  key={w.wishlistId}
                  onClick={() => handleSelectWishlist(w.wishlistId)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition border flex items-center space-x-2 ${
                    currentWishlist?.wishlistId === w.wishlistId
                      ? "bg-cyan-950/80 border-cyan-500 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span>{w.name}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                    {w.gameCount}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Wishlist Details & Games Table */}
            {currentWishlist && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
                {/* Wishlist Header Action Bar */}
                <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950">
                  <div className="flex items-center space-x-3">
                    {renameId === currentWishlist.wishlistId ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={renameText}
                          onChange={(e) => setRenameText(e.target.value)}
                          className="px-2.5 py-1 text-xs bg-slate-900 border border-cyan-500 rounded text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleRenameWishlist(currentWishlist.wishlistId)}
                          className="px-2 py-1 text-[11px] bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setRenameId(null)}
                          className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-base font-bold text-white flex items-center space-x-2">
                          <span>{currentWishlist.name}</span>
                        </h3>
                        <button
                          onClick={() => {
                            setRenameId(currentWishlist.wishlistId);
                            setRenameText(currentWishlist.name);
                          }}
                          className="text-slate-500 hover:text-slate-300 transition"
                          title="Rename wishlist"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500">
                      Created: {currentWishlist.createdAt}
                    </span>
                    <button
                      onClick={() => handleDeleteWishlist(currentWishlist.wishlistId)}
                      className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-900/60 transition ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Wishlist</span>
                    </button>
                  </div>
                </div>

                {/* Wishlist Games Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Game</th>
                        <th className="px-6 py-3 font-semibold">Current Lowest</th>
                        <th className="px-6 py-3 font-semibold">Target Price</th>
                        <th className="px-6 py-3 font-semibold">Priority</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {currentWishlist.games.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                            No games added to this wishlist yet.
                            <div className="mt-2">
                              <Link
                                href="/games"
                                className="text-cyan-400 font-semibold hover:underline inline-flex items-center space-x-1"
                              >
                                <span>Browse the Catalog to add games</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentWishlist.games.map((g) => {
                          const isMet =
                            g.targetPrice !== null &&
                            g.currentLowestPrice !== null &&
                            parseFloat(g.currentLowestPrice) <= parseFloat(g.targetPrice);

                          return (
                            <tr key={g.gameId} className="hover:bg-slate-800/40 transition">
                              <td className="px-6 py-3.5 font-bold text-white flex items-center space-x-2">
                                <Link
                                  href={`/games/${g.gameId}`}
                                  className="hover:text-cyan-400 transition"
                                >
                                  {g.title}
                                </Link>
                              </td>

                              <td className="px-6 py-3.5 font-bold text-emerald-400">
                                {g.currentLowestPrice ? (
                                  `₹${parseFloat(g.currentLowestPrice).toFixed(2)}`
                                ) : (
                                  <span className="text-slate-500 font-normal">No price</span>
                                )}
                              </td>

                              <td className="px-6 py-3.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  defaultValue={g.targetPrice || ""}
                                  onBlur={(e) =>
                                    handleUpdateGame(g.gameId, e.target.value || null, g.priority)
                                  }
                                  placeholder="Set target..."
                                  className="w-24 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                                />
                              </td>

                              <td className="px-6 py-3.5">
                                <select
                                  defaultValue={g.priority}
                                  onChange={(e) =>
                                    handleUpdateGame(
                                      g.gameId,
                                      g.targetPrice,
                                      e.target.value as any
                                    )
                                  }
                                  className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                                >
                                  <option value="LOW">LOW</option>
                                  <option value="MEDIUM">MEDIUM</option>
                                  <option value="HIGH">HIGH</option>
                                </select>
                              </td>

                              <td className="px-6 py-3.5">
                                {isMet ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                                    Target Met
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[10px]">Above Target</span>
                                )}
                              </td>

                              <td className="px-6 py-3.5 text-right">
                                <button
                                  onClick={() => handleRemoveGame(g.gameId)}
                                  className="text-slate-500 hover:text-rose-400 transition"
                                  title="Remove from wishlist"
                                >
                                  <Trash2 className="w-4 h-4 inline" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE WISHLIST MODAL (Demonstrating Multi-step Transaction) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Create New Wishlist</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports single creation or multi-step transactional creation with initial game membership.
            </p>

            <form onSubmit={handleCreateWishlist} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Wishlist Name *
                </label>
                <input
                  type="text"
                  required
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  placeholder="e.g., Summer Backlog, Strategy Must-Haves"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Transaction Demonstration Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createWithGame}
                    onChange={(e) => setCreateWithGame(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <span className="font-semibold text-cyan-400">
                    Add first game atomically (SQL Transaction Demo)
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5 ml-5">
                  Executes <code className="text-slate-400">sp_create_wishlist_with_first_game</code> within a single atomic MySQL transaction.
                </p>
              </div>

              {createWithGame && (
                <div className="space-y-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Choose First Game
                    </label>
                    <select
                      value={selectedGameId}
                      onChange={(e) => setSelectedGameId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    >
                      {catalogGames.map((g) => (
                        <option key={g.gameId} value={g.gameId}>
                          {g.title} (₹{parseFloat(g.basePrice).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Target Price (INR)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={firstGameTarget}
                        onChange={(e) => setFirstGameTarget(e.target.value)}
                        placeholder="Target amount..."
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Priority
                      </label>
                      <select
                        value={firstGamePriority}
                        onChange={(e) => setFirstGamePriority(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Wishlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
