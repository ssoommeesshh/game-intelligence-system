import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getSimilarGames } from "@/lib/db/semantic";

export default async function SimilarGames({ gameId }: { gameId: string }) {
  const games = await getSimilarGames(gameId);
  if (!games.length) return null;
  return <section className="rounded-2xl border border-violet-900/60 bg-gradient-to-br from-slate-900 to-violet-950/20 p-6"><div className="mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-violet-400" /><h2 className="text-lg font-bold text-white">You may also like</h2><span className="rounded-full border border-violet-800 bg-violet-950 px-2 py-0.5 text-xs font-semibold text-violet-300">F08 · pgvector</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{games.map((game) => <Link key={game.gameId} href={`/games/${game.gameId}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-violet-600 hover:bg-slate-900"><p className="font-semibold text-white">{game.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{game.description}</p><p className="mt-3 text-xs font-medium text-violet-300">{Math.round(game.similarity * 100)}% semantic match</p></Link>)}</div></section>;
}
