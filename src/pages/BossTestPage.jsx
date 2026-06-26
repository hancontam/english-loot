import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function BossTestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Weekly Boss"
        title="Boss Test"
        description="Trang này sẽ là bài kiểm tra tuần: từ vựng TOEIC, nghe và gõ lại, Real Talk, Gamer Comms."
      />

      <Card>
        <p className="text-lg font-medium text-loot-text">MVP bước sau</p>
        <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">
          Hiện tại route đã sẵn sàng. Ở bước Boss Test, app sẽ trộn câu hỏi từ các file JSON và lưu điểm cao nhất bằng
          localStorage.
        </p>
      </Card>
    </>
  );
}
