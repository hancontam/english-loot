export default function Card({ children, className = '' }) {
  return (
    <section className={`rounded-[24px] border border-loot-border bg-loot-card p-5 ${className}`}>
      {children}
    </section>
  );
}
