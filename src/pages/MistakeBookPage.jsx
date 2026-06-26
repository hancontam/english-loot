import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { getProgress } from '../lib/storage.js';

export default function MistakeBookPage() {
  const progress = getProgress();

  return (
    <>
      <PageHeader
        eyebrow="Mistake Book"
        title="Sổ lỗi cá nhân"
        description="Các câu nghe sai, từ khó và lỗi ngữ pháp sẽ được gom ở đây để luyện lại."
      />

      <Card>
        {progress.mistakes.length > 0 ? (
          <ul className="space-y-3">
            {progress.mistakes.map((mistake) => (
              <li key={mistake.id} className="rounded-2xl bg-loot-selected p-4">
                <p className="text-base font-medium text-loot-text">{mistake.target}</p>
                <p className="mt-1 text-sm font-normal text-loot-muted">{mistake.type}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-normal leading-6 text-loot-muted">
            Chưa có lỗi nào. Khi bạn làm sai ở Listen & Type hoặc quiz, app sẽ lưu vào đây.
          </p>
        )}
      </Card>
    </>
  );
}
