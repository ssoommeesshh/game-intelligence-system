import { BookOpen, CheckCircle2, Cpu, Database } from "lucide-react";
import { getGameFullDetails } from "@/lib/db/mongodb";

export default async function GameFullDetails({ gameId }: { gameId: string }) {
  const details = await getGameFullDetails(gameId);
  if (!details) return <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-5 text-sm text-slate-400">Extended editorial content is not available for this game yet.</div>;
  return <div className="space-y-5">
    <section className="space-y-2"><h3 className="flex items-center gap-2 text-sm font-bold text-white"><BookOpen className="h-4 w-4 text-indigo-400" />Full overview</h3><p className="text-sm leading-6 text-slate-300">{details.longDescription}</p></section>
    {details.story && <section className="space-y-2"><h3 className="text-sm font-bold text-white">Story & world</h3><p className="text-sm leading-6 text-slate-300">{details.story}</p></section>}
    {(details.features?.length ?? 0) > 0 && <section className="space-y-2"><h3 className="flex items-center gap-2 text-sm font-bold text-white"><CheckCircle2 className="h-4 w-4 text-indigo-400" />Key features</h3><ul className="grid gap-2 sm:grid-cols-2">{details.features?.map((feature) => <li key={feature} className="rounded-lg bg-slate-950/70 px-3 py-2 text-xs text-slate-300">{feature}</li>)}</ul></section>}
    {details.systemRequirements && <section className="space-y-3"><h3 className="flex items-center gap-2 text-sm font-bold text-white"><Cpu className="h-4 w-4 text-indigo-400" />System requirements</h3><div className="grid gap-3 md:grid-cols-2">{(["minimum", "recommended"] as const).map((tier) => details.systemRequirements?.[tier]?.length ? <div key={tier} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="mb-2 text-xs font-semibold capitalize text-indigo-300">{tier}</p><ul className="space-y-1 text-xs text-slate-400">{details.systemRequirements[tier].map((item) => <li key={item}>{item}</li>)}</ul></div> : null)}</div></section>}
    <p className="flex items-center gap-1.5 text-[11px] text-slate-500"><Database className="h-3.5 w-3.5" />Flexible extended content from MongoDB</p>
  </div>;
}
