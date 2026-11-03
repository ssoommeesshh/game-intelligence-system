"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DollarSign, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle, 
  TrendingDown, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface AdminPricesClientProps {
  games: { gameId: string; title: string; basePrice: string; steamAppId: number | null }[];
  stores: { storeId: string; name: string; country: string | null }[];
  recentObservations: {
    priceId: string;
    gameTitle: string;
    storeName: string;
    price: string;
    currency: string;
    discountPercentage: number;
    recordedAt: string;
  }[];
}

export default function AdminPricesClient({
  games,
  stores,
  recentObservations: initialRecent,
}: AdminPricesClientProps) {
  const router = useRouter();
  const [selectedGameId, setSelectedGameId] = useState(games[0]?.gameId || "");
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.storeId || "");
  const [discountPercentage, setDiscountPercentage] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [recent, setRecent] = useState(initialRecent);

  const selectedGame = games.find((g) => g.gameId === selectedGameId);
  const basePriceNum = selectedGame ? parseFloat(selectedGame.basePrice) : 0;
  const calculatedSellingPrice = (basePriceNum * (1 - discountPercentage / 100)).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: selectedGameId,
          storeId: selectedStoreId,
          discountPercentage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to record price observation");
      }

      setMessage({
        type: "success",
        text: `Successfully recorded new observation: ₹${calculatedSellingPrice} (${discountPercentage}% off base price ₹${basePriceNum.toFixed(2)})!`,
      });

      // Prepend to recent list
      const storeName = stores.find((s) => s.storeId === selectedStoreId)?.name || "Store";
      setRecent((prev) => [
        {
          priceId: data.observation.priceId,
          gameTitle: selectedGame?.title || "Game",
          storeName,
          price: data.observation.calculatedPrice,
          currency: "INR",
          discountPercentage,
          recordedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        },
        ...prev.slice(0, 9),
      ]);

      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-900/60 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <span>Admin Store Discounts & Price Observations</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
            F05 &bull; ADMIN Only
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Record a new verified store price observation in MySQL. Appends to <code className="text-amber-300">PRICE_HISTORY</code> without overwriting historical records, activates the automated audit trigger, and immediately refreshes wishlist target matches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 pb-4 border-b border-slate-800">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span>Record New Price Observation</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5 text-xs">
            {/* Game Selector */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Select Game *
              </label>
              <select
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              >
                {games.map((g) => (
                  <option key={g.gameId} value={g.gameId}>
                    {g.title} &bull; Reference Base Price: ₹{parseFloat(g.basePrice).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Store Selector */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Select Storefront *
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              >
                {stores.map((s) => (
                  <option key={s.storeId} value={s.storeId}>
                    {s.name} {s.country ? `(${s.country})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Discount Slider & Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-300">
                  Discount Percentage (0% to 100%)
                </label>
                <span className="font-bold text-amber-400 text-sm">{discountPercentage}% OFF</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0% (Base Price)</span>
                <span>50% (Half Price)</span>
                <span>100% (Free)</span>
              </div>
            </div>

            {/* Live Calculation Preview Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/40 space-y-2">
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Derived Selling Price Calculation</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-slate-400">Reference Base Price:</span>
                <span className="font-semibold text-slate-300">₹{basePriceNum.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Discount Applied:</span>
                <span className="font-semibold text-amber-400">-{discountPercentage}%</span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-800 text-sm">
                <span className="font-bold text-white">Calculated Observation Price:</span>
                <span className="font-extrabold text-emerald-400 text-base">
                  ₹{calculatedSellingPrice} INR
                </span>
              </div>
            </div>

            {message && (
              <div
                className={`p-3.5 rounded-xl flex items-center space-x-2 text-xs font-semibold ${
                  message.type === "success"
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                    : "bg-rose-950/80 text-rose-300 border border-rose-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl transition shadow text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "Recording Observation..." : "Record Price Observation into MySQL"}
            </button>
          </form>
        </div>

        {/* Recent Observations Log */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2 pb-4 border-b border-slate-800">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <span>Recent Price Observations Log</span>
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Shows verified observations recorded in MySQL. Notice how each insertion preserves previous snapshots.
            </p>

            <div className="mt-4 space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {recent.map((obs) => (
                <div
                  key={obs.priceId}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition"
                >
                  <div>
                    <div className="font-bold text-white">{obs.gameTitle}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Store: <span className="text-slate-300">{obs.storeName}</span> &bull; {obs.recordedAt}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-400 text-sm">
                      ₹{parseFloat(obs.price).toFixed(2)}
                    </div>
                    {obs.discountPercentage > 0 && (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {obs.discountPercentage}% off
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Audit Trigger: <code className="text-slate-400">trg_after_price_history_insert</code></span>
            <span>Routine: <code className="text-slate-400">sp_record_price_observation</code></span>
          </div>
        </div>
      </div>
    </div>
  );
}
