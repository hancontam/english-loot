import StatPill from './StatPill.jsx';

export default function ProgressBadge({ progress = {}, todayProgress = '0/4' }) {
  const stats = [
    { label: 'Level', value: progress.level ?? 1 },
    { label: 'EXP', value: progress.exp ?? 0 },
    { label: 'Streak', value: progress.streak ?? 0 },
    { label: 'Today progress', value: todayProgress },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatPill key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
