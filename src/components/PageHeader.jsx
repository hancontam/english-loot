export default function PageHeader({ title, description, eyebrow }) {
  return (
    <div className="mb-5 max-w-[640px]">
      {eyebrow ? <p className="text-sm font-medium text-loot-muted">{eyebrow}</p> : null}
      <h2 className="mt-1 text-lg font-medium text-loot-text">{title}</h2>
      <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{description}</p>
    </div>
  );
}
