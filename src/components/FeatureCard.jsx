import { Link } from 'react-router-dom';
import Card from './Card.jsx';
import LineIcon from './LineIcon.jsx';

export default function FeatureCard({ count, description, icon, title, to }) {
  return (
    <Card className="flex flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-loot-border bg-loot-selected text-loot-text">
          <LineIcon name={icon} />
        </span>
        <span className="rounded-[40px] border border-loot-border bg-loot-card px-3 py-1 text-sm font-medium text-loot-muted">
          {count}
        </span>
      </div>

      <div>
        <h3 className="text-base font-medium text-loot-text">{title}</h3>
        <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{description}</p>
      </div>

      <Link
        className="mt-auto inline-flex h-10 w-full items-center justify-center rounded-xl border border-loot-border bg-loot-card px-4 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected"
        to={to}
      >
        Open
      </Link>
    </Card>
  );
}
