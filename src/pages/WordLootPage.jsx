import AudioButton from '../components/AudioButton.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import words from '../data/words.json';

export default function WordLootPage() {
  return (
    <>
      <PageHeader
        eyebrow="Word Loot"
        title="Từ vựng TOEIC theo ngữ cảnh"
        description="Mỗi card có nghĩa tiếng Việt, ví dụ tiếng Anh, bản dịch tự nhiên và trap words để tránh nghe nhầm."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {words.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium text-loot-text">{item.word}</h3>
                <p className="mt-1 text-sm font-normal text-loot-muted">
                  {item.topic} · TOEIC {item.level}
                </p>
              </div>
              <AudioButton text={item.word} />
            </div>
            <p className="mt-4 text-base font-medium text-loot-text">{item.meaning}</p>
            <p className="mt-3 text-sm font-normal leading-6 text-loot-muted">{item.example}</p>
            <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{item.translation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.traps.map((trap) => (
                <span
                  key={trap}
                  className="rounded-[40px] border border-loot-border bg-loot-selected px-3 py-1 text-sm font-normal text-loot-muted"
                >
                  {trap}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
