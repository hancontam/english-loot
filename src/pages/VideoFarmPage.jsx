import { useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import videos from '../data/videos.json';

function getUniqueValues(key) {
  return [
    ...new Set(
      (Array.isArray(videos) ? videos : [])
        .map((video) => video[key])
        .filter(Boolean),
    ),
  ];
}

const selectClass =
  'h-10 rounded-xl border border-loot-border bg-loot-card px-3 text-sm font-medium text-loot-text outline-none transition-colors hover:bg-loot-selected focus:bg-loot-selected';

export default function VideoFarmPage() {
  const [topic, setTopic] = useState('all');
  const [level, setLevel] = useState('all');
  const topics = useMemo(() => getUniqueValues('topic'), []);
  const levels = useMemo(() => getUniqueValues('level'), []);
  const filteredVideos = useMemo(
    () =>
      (Array.isArray(videos) ? videos : []).filter((video) => {
        const topicMatches = topic === 'all' || video.topic === topic;
        const levelMatches = level === 'all' || video.level === level;

        return topicMatches && levelMatches;
      }),
    [level, topic],
  );

  return (
    <>
      <PageHeader
        eyebrow="Video Farm"
        title="Nguồn nghe"
        description="Lọc nguồn nghe theo trình độ và chủ đề, rồi mở nguồn để luyện mỗi ngày."
      />

      <Card className="mb-4 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-loot-muted">Chủ đề</span>
            <select className={`${selectClass} mt-2 w-full`} value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="all">Tất cả chủ đề</option>
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-loot-muted">Trình độ</span>
            <select className={`${selectClass} mt-2 w-full`} value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">Tất cả trình độ</option>
              {levels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {filteredVideos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredVideos.map((video) => (
            <Card key={video.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[40px] border border-loot-border bg-loot-selected px-3 py-1 text-sm font-normal text-loot-muted">
                  {video.topic}
                </span>
                <span className="rounded-[40px] border border-loot-border bg-loot-card px-3 py-1 text-sm font-normal text-loot-muted">
                  {video.level}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-loot-text">{video.title}</h3>
              <p className="mt-2 text-sm font-normal text-loot-muted">Nguồn: {video.source}</p>
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
      ) : (
        <Card>
          <p className="text-sm font-normal leading-6 text-loot-muted">Không có nguồn nghe phù hợp với bộ lọc này.</p>
        </Card>
      )}
    </>
  );
}
