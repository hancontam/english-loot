const icons = {
  daily: (
    <>
      <path d="M5.5 10.5h13v8a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5v-8Z" />
      <path d="M4.5 7.5h15v3h-15v-3Z" />
      <path d="M12 7.5V20" />
      <path d="M9 7.5C7.4 6.2 7.4 4.5 8.8 4.2c1.2-.3 2.2 1 3.2 3.3" />
      <path d="M15 7.5c1.6-1.3 1.6-3 .2-3.3-1.2-.3-2.2 1-3.2 3.3" />
    </>
  ),
  word: (
    <>
      <path d="M5.5 5.5h5a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2h-5v-11Z" />
      <path d="M18.5 5.5h-5a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h5v-11Z" />
    </>
  ),
  talk: (
    <>
      <path d="M6.5 6.5h11a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2H12l-4 3v-3H6.5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2Z" />
      <path d="M8.5 10.5h7" />
      <path d="M8.5 13h4" />
    </>
  ),
  game: (
    <>
      <path d="M7.5 9.5h9a4 4 0 0 1 3.8 5.2l-.6 1.9a2 2 0 0 1-3.3.8l-1.7-1.7H9.3l-1.7 1.7a2 2 0 0 1-3.3-.8l-.6-1.9a4 4 0 0 1 3.8-5.2Z" />
      <path d="M8 12.5v3" />
      <path d="M6.5 14h3" />
      <path d="M15.5 13.5h.1" />
      <path d="M17.5 15h.1" />
    </>
  ),
  listen: (
    <>
      <path d="M5 13.5v-2a7 7 0 0 1 14 0v2" />
      <path d="M7.5 13h-1A1.5 1.5 0 0 0 5 14.5v2A1.5 1.5 0 0 0 6.5 18h1v-5Z" />
      <path d="M16.5 13h1a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-1v-5Z" />
    </>
  ),
  mistake: (
    <>
      <path d="M7 4.5h7.5L18 8v10.5A1.5 1.5 0 0 1 16.5 20h-9A1.5 1.5 0 0 1 6 18.5V6A1.5 1.5 0 0 1 7.5 4.5Z" />
      <path d="M14.5 4.5V8H18" />
      <path d="M9 12h6" />
      <path d="M9 15h4" />
    </>
  ),
  boss: (
    <>
      <path d="M5 17.5h14" />
      <path d="M6.5 17.5 5.5 8l4 3 2.5-5 2.5 5 4-3-1 9.5" />
    </>
  ),
  video: (
    <>
      <path d="M5.5 7.5h13a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16V9a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="m10.5 10 4 2.5-4 2.5v-5Z" />
    </>
  ),
  chevronRight: <path d="m9.5 6.5 5 5.5-5 5.5" />,
};

export default function LineIcon({ name, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-6 w-6 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      {icons[name] ?? icons.daily}
    </svg>
  );
}
