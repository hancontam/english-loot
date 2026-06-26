import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import videos from '../data/videos.json';

export default function VideoFarmPage() {
  return (
    <>
      <PageHeader
        eyebrow="Video Farm"
        title="Nguồn nghe để cày đều"
        description="Danh sách nguồn nghe được lưu tĩnh trong JSON. Sau này có thể lọc theo TOEIC, dev English, gaming và hội thoại."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {videos.map((video) => (
          <Card key={video.id}>
            <p className="text-sm font-normal text-loot-muted">{video.topic}</p>
            <h3 className="mt-2 text-lg font-medium text-loot-text">{video.title}</h3>
            <p className="mt-2 text-sm font-normal text-loot-muted">
              {video.source} · {video.level}
            </p>
            <a
              className="mt-4 inline-flex h-10 items-center rounded-xl border border-loot-border bg-loot-card px-4 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected"
              href={video.url}
              rel="noreferrer"
              target="_blank"
            >
              Mở nguồn học
            </a>
          </Card>
        ))}
      </div>
    </>
  );
}
