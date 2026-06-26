import AudioButton from '../components/AudioButton.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import listeningItems from '../data/listeningItems.json';

export default function ListenTypePage() {
  const item = listeningItems[0];

  return (
    <>
      <PageHeader
        eyebrow="Listen & Type"
        title="Nghe rồi gõ lại"
        description="Bước này mới đặt khung màn hình. Bước sau sẽ thêm so sánh đáp án và lưu lỗi vào Mistake Book."
      />

      <Card className="max-w-2xl">
        <p className="text-sm font-medium text-loot-muted">{item.type}</p>
        <div className="mt-4">
          <AudioButton text={item.sentence} />
        </div>
        <label className="mt-5 block text-sm font-medium text-loot-text" htmlFor="listen-answer">
          Bạn nghe được gì?
        </label>
        <textarea
          className="mt-2 min-h-28 w-full rounded-2xl border border-loot-border bg-loot-card p-3 text-loot-text placeholder:text-loot-placeholder"
          id="listen-answer"
          placeholder="Gõ câu tiếng Anh bạn nghe được..."
        />
      </Card>
    </>
  );
}
