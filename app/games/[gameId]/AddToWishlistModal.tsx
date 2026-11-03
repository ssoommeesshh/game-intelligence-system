"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Plus, Check, AlertCircle } from "lucide-react";

interface WishlistSummary {
  wishlistId: string;
  name: string;
  createdAt: string;
  gameCount: number;
}

interface AddToWishlistModalProps {
  gameId: string;
  gameTitle: string;
  wishlists: WishlistSummary[];
  basePrice: string;
}

export default function AddToWishlistModal({
  gameId,
  gameTitle,
  wishlists,
  basePrice,
}: AddToWishlistModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWishlistId, setSelectedWishlistId] = useState(
    wishlists[0]?.wishlistId || ""
  );
  const [targetPrice, setTargetPrice] = useState(
    (parseFloat(basePrice) * 0.7).toFixed(2)
  );
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWishlistId) {
      setStatusMessage({ type: "error", text: "Please select a wishlist." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/wishlists/${selectedWishlistId}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
          priority,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to add game");
      }

      setStatusMessage({ type: "success", text: "Game added to wishlist successfully!" });
      setTimeout(() => {
        setIsOpen(false);
        setStatusMessage(null);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs rounded-xl shadow transition"
      >
        <Heart className="w-4 h-4 fill-current" />
        <span>Add to Wishlist</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-500 fill-current" />
              <span>Add to Wishlist</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Set personal target price and priority for <span className="text-white font-semibold">{gameTitle}</span>.
            </p>

            {wishlists.length === 0 ? (
              <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <p className="text-xs text-slate-400">You don&apos;t have any wishlists yet.</p>
                <a
                  href="/wishlists"
                  className="mt-2 inline-block text-xs font-semibold text-cyan-400 hover:underline"
                >
                  Create your first wishlist &rarr;
                </a>
              </div>
            ) : (
              <form onSubmit={handleAdd} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Select Target Wishlist
                  </label>
                  <select
                    value={selectedWishlistId}
                    onChange={(e) => setSelectedWishlistId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    {wishlists.map((w) => (
                      <option key={w.wishlistId} value={w.wishlistId}>
                        {w.name} ({w.gameCount} games)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Target Price (INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Enter target price..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Base price is ₹{parseFloat(basePrice).toFixed(2)}. When current price &le; target, it alerts as a match!
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["LOW", "MEDIUM", "HIGH"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPriority(lvl)}
                        className={`py-2 rounded-lg font-bold border transition ${
                          priority === lvl
                            ? lvl === "HIGH"
                              ? "bg-pink-950/80 border-pink-500 text-pink-300"
                              : lvl === "MEDIUM"
                              ? "bg-amber-950/80 border-amber-500 text-amber-300"
                              : "bg-slate-800 border-slate-500 text-slate-300"
                            : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {statusMessage && (
                  <div
                    className={`p-3 rounded-lg flex items-center space-x-2 text-xs font-medium ${
                      statusMessage.type === "success"
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                        : "bg-rose-950/80 text-rose-300 border border-rose-800"
                    }`}
                  >
                    {statusMessage.type === "success" ? (
                      <Check className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition shadow disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Save to Wishlist"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
