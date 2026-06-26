import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import phrases from '../data/phrases.json';

export default function RealTalkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Real Talk"
        title="Cụm đời thường và reduced speech"
        description="Không học từng từ rời rạc. Mỗi cụm đi kèm ngữ cảnh, ví dụ và bản dịch tự nhiên."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {phrases.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-medium text-loot-text">{item.phrase}</h3>
              <span className="rounded-[40px] border border-loot-border bg-loot-selected px-3 py-1 text-sm font-normal text-loot-muted">
                {item.level}
              </span>
            </div>
            <p className="mt-2 text-sm font-normal text-loot-muted">Full form: {item.full}</p>
            <p className="mt-3 text-base font-medium text-loot-text">{item.meaning}</p>
            <p className="mt-3 text-sm font-normal leading-6 text-loot-muted">{item.example}</p>
            <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{item.translation}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
