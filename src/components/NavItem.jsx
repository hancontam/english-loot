import { NavLink } from 'react-router-dom';
import LineIcon from './LineIcon.jsx';

export default function NavItem({ icon, isCollapsed = false, label, onNavigate, to }) {
  return (
    <NavLink
      aria-label={label}
      title={isCollapsed ? label : undefined}
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition-colors',
          isCollapsed ? 'lg:justify-center lg:px-0' : '',
          isActive
            ? 'bg-loot-selected text-loot-text'
            : 'bg-transparent text-loot-muted hover:bg-loot-selected hover:text-loot-text',
        ].join(' ')
      }
    >
      <span className="grid h-6 w-6 place-items-center">
        <LineIcon name={icon} />
      </span>
      <span className={isCollapsed ? 'lg:hidden' : ''}>{label}</span>
    </NavLink>
  );
}
