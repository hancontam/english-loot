import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LineIcon from './LineIcon.jsx';
import Sidebar from './Sidebar.jsx';

const SIDEBAR_COLLAPSED_KEY = 'english-loot-sidebar-collapsed';

function getInitialSidebarCollapsed() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function SidebarToggleIcon({ isCollapsed }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M9 5v14" />
      {isCollapsed ? (
        <>
          <path d="M12 12h4" />
          <path d="m14 10 2 2-2 2" />
        </>
      ) : (
        <>
          <path d="M16 12h-4" />
          <path d="m14 10-2 2 2 2" />
        </>
      )}
    </svg>
  );
}

export default function AppLayout({ children, routes }) {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(getInitialSidebarCollapsed);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const currentRoute = routes.find((route) => route.path === location.pathname) ?? { label: 'Not Found' };

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed));
    } catch {
      // Keep the toggle usable even when localStorage is unavailable.
    }
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-loot-page p-4 text-loot-text md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1440px] flex-col overflow-hidden rounded-[32px] border border-loot-border bg-loot-card shadow-shell lg:flex-row lg:rounded-[40px]">
        <Sidebar routes={routes} isCollapsed={isSidebarCollapsed} />

        <section className="flex min-w-0 flex-1 flex-col bg-loot-card">
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-loot-border px-6 lg:px-8">
            <button
              aria-label="Open sidebar"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-transparent text-loot-muted transition-colors hover:bg-loot-selected hover:text-loot-text lg:hidden"
              title="Open sidebar"
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <SidebarToggleIcon isCollapsed />
            </button>

            <button
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-pressed={isSidebarCollapsed}
              className="hidden h-8 w-8 shrink-0 place-items-center rounded-xl bg-transparent text-loot-muted transition-colors hover:bg-loot-selected hover:text-loot-text lg:grid"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              type="button"
              onClick={() => setIsSidebarCollapsed((value) => !value)}
            >
              <SidebarToggleIcon isCollapsed={isSidebarCollapsed} />
            </button>

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

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close sidebar"
            className="absolute inset-0 h-full w-full bg-[rgb(24_24_24_/_0.24)]"
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative h-full w-[280px] max-w-full">
            <Sidebar
              isDrawer
              routes={routes}
              onClose={() => setIsMobileSidebarOpen(false)}
              onNavigate={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
