import StatPill from './StatPill.jsx';

export default function ProgressBadge({ progress }) {
  const stats = [
    { label: 'Level', value: progress.level },
    { label: 'EXP', value: progress.exp },
    { label: 'Streak', value: progress.streak },
    { label: 'Today progress', value: '0/4' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatPill key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
