import AppLogo from "./AppLogo.jsx";
import NavItem from "./NavItem.jsx";

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

export default function Sidebar({ isCollapsed = false, routes }) {
  return (
    <aside
      className={[
        "flex w-full shrink-0 flex-col border-b border-loot-border p-6 transition-[width,padding] duration-200 lg:border-b-0 lg:border-r",
        isCollapsed ? "lg:w-20 lg:p-4" : "lg:w-[260px] lg:p-8",
      ].join(" ")}
    >
      <div
        className={[
          "mb-8 flex items-start gap-3",
          isCollapsed ? "lg:justify-center" : "",
        ].join(" ")}
      >
        <AppLogo />
        <div className={isCollapsed ? "lg:hidden" : ""}>
          <p className="text-lg font-medium text-loot-text">English Loot</p>
          <p className="mt-2 text-sm font-normal leading-5 text-loot-muted">
            TOEIC, Real Talk & Gamer English
          </p>
        </div>
      </div>

      <nav
        className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        aria-label="Main navigation"
      >
        {routes.map((route) => (
          <NavItem
            key={route.path}
            icon={routeIcons[route.path]}
            isCollapsed={isCollapsed}
            label={route.label}
            to={route.path}
          />
        ))}
      </nav>

      <p
        className={[
          "mt-4 text-xs font-normal leading-5 text-loot-muted lg:mt-auto lg:pt-4",
          isCollapsed ? "lg:hidden" : "",
        ].join(" ")}
      >
        &copy; 2026 English Loot. Designed by @hancontam.
      </p>
    </aside>
  );
}
