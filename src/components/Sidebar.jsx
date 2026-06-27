import AppLogo from "./AppLogo.jsx";
import NavItem from "./NavItem.jsx";

function DrawerCloseIcon() {
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
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

const routeIcons = {
  "/": "daily",
  "/word-loot": "word",
  "/real-talk": "talk",
  "/gamer-comms": "game",
  "/listen-type": "listen",
  "/mistake-book": "mistake",
  "/boss-test": "boss",
  "/video-farm": "video",
};

export default function Sidebar({ isCollapsed = false, isDrawer = false, onClose, onNavigate, routes }) {
  const shouldCollapse = !isDrawer && isCollapsed;

  return (
    <aside
      className={[
        "shrink-0 flex-col bg-loot-card",
        isDrawer
          ? "flex h-full w-[280px] rounded-r-[32px] border-r border-loot-border p-6"
          : "hidden border-r border-loot-border transition-[width,padding] duration-200 lg:flex",
        shouldCollapse ? "lg:w-20 lg:p-4" : "",
        !isDrawer && !shouldCollapse ? "lg:w-[260px] lg:p-8" : "",
      ].join(" ")}
    >
      <div
        className={[
          "mb-8 flex items-start gap-3",
          shouldCollapse ? "lg:justify-center" : "",
        ].join(" ")}
      >
        <AppLogo />
        <div className={shouldCollapse ? "lg:hidden" : ""}>
          <p className="text-lg font-medium text-loot-text">English Loot</p>
          <p className="mt-2 text-sm font-normal leading-5 text-loot-muted">
            TOEIC, Real Talk & Gamer English
          </p>
        </div>
        {isDrawer ? (
          <button
            aria-label="Close sidebar"
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-transparent text-loot-muted transition-colors hover:bg-loot-selected hover:text-loot-text"
            title="Close sidebar"
            type="button"
            onClick={onClose}
          >
            <DrawerCloseIcon />
          </button>
        ) : null}
      </div>

      <nav
        className={isDrawer ? "flex flex-col gap-2" : "flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"}
        aria-label="Main navigation"
      >
        {routes.map((route) => (
          <NavItem
            key={route.path}
            icon={routeIcons[route.path]}
            isCollapsed={shouldCollapse}
            label={route.label}
            to={route.path}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <p
        className={[
          "text-xs font-normal leading-5 text-loot-muted",
          isDrawer ? "mt-auto pt-4" : "mt-4 lg:mt-auto lg:pt-4",
          shouldCollapse ? "lg:hidden" : "",
        ].join(" ")}
      >
        &copy; 2026 English Loot. Designed by @hancontam.
      </p>
    </aside>
  );
}
