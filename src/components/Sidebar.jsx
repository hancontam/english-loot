import NavItem from './NavItem.jsx';

const routeIcons = {
  '/': 'daily',
  '/word-loot': 'word',
  '/real-talk': 'talk',
  '/gamer-comms': 'game',
  '/listen-type': 'listen',
  '/mistake-book': 'mistake',
  '/boss-test': 'boss',
  '/video-farm': 'video',
};

export default function Sidebar({ routes }) {
  return (
    <aside className="w-full shrink-0 border-b border-loot-border p-6 lg:w-[260px] lg:border-b-0 lg:border-r lg:p-8">
      <div className="mb-8">
        <p className="text-lg font-medium text-loot-text">English Loot</p>
        <p className="mt-2 text-sm font-normal leading-5 text-loot-muted">TOEIC, Real Talk & Gamer English</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Main navigation">
        {routes.map((route) => (
          <NavItem key={route.path} icon={routeIcons[route.path]} label={route.label} to={route.path} />
        ))}
      </nav>
    </aside>
  );
}
