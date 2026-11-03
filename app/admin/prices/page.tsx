import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAllStores, getAllGamesForAdmin } from "@/lib/db/admin";
import { query } from "@/lib/db/mysql";
import AdminPricesClient from "./AdminPricesClient";

export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/admin/prices");
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="bg-slate-900 border border-rose-900/60 rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
        <h2 className="text-xl font-bold text-rose-400">Access Denied (403 Forbidden)</h2>
        <p className="text-xs text-slate-400 mt-2">
          Your current account (<span className="text-white font-semibold">{user.email}</span>) has the <code className="text-cyan-300">USER</code> role. Only users with the <code className="text-amber-300">ADMIN</code> role can access the price recording console.
        </p>
        <p className="text-xs text-slate-500 mt-4">
          To test administrative operations, log in with an ADMIN demo account such as <code className="text-white">sreejith@example.com</code> or <code className="text-white">somesh@example.com</code>.
        </p>
      </div>
    );
  }

  const [games, stores, recentObservations] = await Promise.all([
    getAllGamesForAdmin(),
    getAllStores(),
    query<any>(
      `
      SELECT 
        ph.price_id AS priceId,
        g.title AS gameTitle,
        s.name AS storeName,
        CAST(ph.price AS CHAR) AS price,
        ph.currency,
        CAST(ph.discount_percentage AS DOUBLE) AS discountPercentage,
        DATE_FORMAT(ph.recorded_at, '%Y-%m-%d %H:%i:%s') AS recordedAt
      FROM \`PRICE_HISTORY\` ph
      JOIN \`GAME\` g ON ph.game_id = g.game_id
      JOIN \`STORE\` s ON ph.store_id = s.store_id
      ORDER BY ph.recorded_at DESC, ph.price_id DESC
      LIMIT 10
      `
    ),
  ]);

  return (
    <AdminPricesClient
      games={games}
      stores={stores}
      recentObservations={recentObservations}
    />
  );
}
