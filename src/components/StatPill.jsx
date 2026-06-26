export default function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-loot-border bg-loot-card px-4 py-3">
      <p className="text-sm font-normal text-loot-muted">{label}</p>
      <p className="mt-1 text-base font-medium text-loot-text">{value}</p>
    </div>
  );
}
