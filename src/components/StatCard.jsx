export default function StatCard({ icon: Icon, label, value, hint }) {
  return <div className="card p-5">
    <div className="flex items-start justify-between"><div><p className="muted">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div><div className="rounded-xl bg-slate-100 p-3"><Icon size={21}/></div></div>
    {hint && <p className="mt-3 text-xs text-slate-500">{hint}</p>}
  </div>;
}