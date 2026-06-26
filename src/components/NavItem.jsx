import { NavLink } from 'react-router-dom';
import LineIcon from './LineIcon.jsx';

export default function NavItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition-colors',
          isActive ? 'bg-loot-selected text-loot-text' : 'bg-transparent text-loot-muted hover:bg-loot-selected hover:text-loot-text',
        ].join(' ')
      }
    >
      <span className="grid h-6 w-6 place-items-center">
        <LineIcon name={icon} />
      </span>
      <span>{label}</span>
    </NavLink>
  );
}
