import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import gamerTerms from '../data/gamerTerms.json';

export default function GamerCommsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gamer Comms"
        title="Comms ngắn, nói đúng lúc"
        description="Học các cụm Valorant, voice chat và chat nhanh để nghe hiểu đồng đội tốt hơn."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {gamerTerms.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-medium text-loot-text">{item.term}</h3>
              <span className="rounded-[40px] border border-loot-border bg-loot-selected px-3 py-1 text-sm font-normal text-loot-muted">
                {item.category}
              </span>
            </div>
            <p className="mt-3 text-base font-medium text-loot-text">{item.meaning}</p>
            <p className="mt-3 text-sm font-normal leading-6 text-loot-muted">{item.example}</p>
            <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{item.translation}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
