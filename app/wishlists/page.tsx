import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserWishlists, getWishlistById, getWishlistDeals } from "@/lib/db/wishlists";
import { searchGames } from "@/lib/db/catalog";
import WishlistClient from "./WishlistClient";

export const dynamic = "force-dynamic";

export default async function WishlistsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/wishlists");
  }

  const [wishlists, deals, catalogRes] = await Promise.all([
    getUserWishlists(user.userId),
    getWishlistDeals(user.userId),
    searchGames({ pageSize: 50 }),
  ]);

  const initialSelected = wishlists.length > 0
    ? await getWishlistById(wishlists[0].wishlistId, user.userId)
    : null;

  const catalogGames = catalogRes.items.map((g) => ({
    gameId: g.gameId,
    title: g.title,
    basePrice: g.basePrice,
  }));

  return (
    <WishlistClient
      initialWishlists={wishlists}
      initialDeals={deals}
      initialSelectedWishlist={initialSelected}
      catalogGames={catalogGames}
    />
  );
}
