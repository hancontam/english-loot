import { useLocation } from 'react-router-dom';
import LineIcon from './LineIcon.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppLayout({ children, routes }) {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname) ?? routes[0];

  return (
    <div className="min-h-screen bg-loot-page p-4 text-loot-text md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1440px] flex-col overflow-hidden rounded-[32px] border border-loot-border bg-loot-card shadow-shell lg:flex-row lg:rounded-[40px]">
        <Sidebar routes={routes} />

        <section className="flex min-w-0 flex-1 flex-col bg-loot-card">
          <header className="flex h-16 shrink-0 items-center border-b border-loot-border px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-base font-medium" aria-label="Breadcrumb">
              <span className="text-loot-muted">Home</span>
              <span className="grid h-6 w-6 place-items-center text-loot-muted" aria-hidden="true">
                <LineIcon name="chevronRight" />
              </span>
              <span className="text-loot-text">{currentRoute.label}</span>
            </nav>
          </header>

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </section>
      </div>
    </div>
  );
}
