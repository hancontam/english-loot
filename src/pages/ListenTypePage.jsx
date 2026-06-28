import { useState } from 'react';
import AudioButton from '../components/AudioButton.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import listeningItems from '../data/listeningItems.json';
import { storageRepository } from '../infrastructure/storageRepository.js';
import { makeListenTypeLearningEventPayload } from '../utils/learning/events.js';
import { LISTENING_DOMAIN } from '../utils/learning/itemKeys.js';
import { buildScoredMasteryRecord } from '../utils/learning/mastery.js';
import { scoreListenTypeAnswer } from '../utils/learning/scoringStrategies.js';

function safeItems() {
  return Array.isArray(listeningItems) ? listeningItems : [];
}

function pickNextItem(previousId = '') {
  const allItems = safeItems();
  const candidates = allItems.length > 1 ? allItems.filter((item) => item.id !== previousId) : allItems;
  const index = Math.floor(Math.random() * candidates.length);

  return candidates[index] || null;
}

const primaryButtonClass =
  'h-10 rounded-xl bg-loot-text px-5 text-sm font-medium text-loot-card transition-opacity hover:opacity-90';
const secondaryButtonClass =
  'h-10 rounded-xl border border-loot-border bg-loot-card px-5 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected';

export default function ListenTypePage() {
  const [item, setItem] = useState(() => pickNextItem());
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);

  if (!item) {
    return (
      <>
        <PageHeader
          eyebrow="Listen & Type"
          title="Nghe và gõ lại"
          description="Nghe một câu, gõ lại, rồi so sánh từng từ."
        />

        <Card>
          <p className="text-sm font-normal leading-6 text-loot-muted">Chưa có dữ liệu nghe.</p>
        </Card>
      </>
    );
  }

  function handleCheck() {
    const nextResult = scoreListenTypeAnswer({
      userAnswer: answer,
      targetAnswer: item.sentence,
      normalForm: item.normalForm,
    });

    setResult(nextResult);
    storageRepository.updateItemMastery(LISTENING_DOMAIN, item.id, (currentRecord) =>
      buildScoredMasteryRecord(currentRecord, nextResult),
    );
    storageRepository.addLearningEvent(makeListenTypeLearningEventPayload(item, answer, nextResult));

    if (!nextResult.isCorrect) {
      storageRepository.addMistake({
        type: 'listening',
        target: item.sentence,
        userAnswer: answer,
        sourceId: item.id,
        mistakeCategories: nextResult.mistakeCategories,
      });
    }
  }

  function handleNext() {
    setItem(pickNextItem(item.id));
    setAnswer('');
    setResult(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="Listen & Type"
        title="Nghe và gõ lại"
        description="Dùng giọng đọc tiếng Anh, gõ câu bạn nghe được, rồi so sánh từng từ."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-loot-muted">{item.type}</p>
              <p className="mt-2 text-sm font-normal text-loot-muted">{item.level}</p>
            </div>
            <AudioButton text={item.sentence} />
          </div>

          <label className="mt-6 block text-sm font-medium text-loot-text" htmlFor="listen-answer">
            Bạn nghe được gì?
          </label>
          <textarea
            className="mt-2 min-h-32 w-full resize-y rounded-[20px] border border-loot-border bg-loot-card p-4 text-sm font-normal leading-6 text-loot-text outline-none transition-colors placeholder:text-loot-muted focus:bg-loot-selected"
            id="listen-answer"
            placeholder="Gõ câu tiếng Anh bạn nghe được..."
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />

          <div className="mt-5 flex flex-wrap gap-3">
            <button className={primaryButtonClass} type="button" onClick={handleCheck}>
              Kiểm tra đáp án
            </button>
            <button className={secondaryButtonClass} type="button" onClick={handleNext}>
              Câu tiếp theo
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-loot-text">Kết quả</p>
          {!result ? (
            <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">
              Phần so sánh từng từ sẽ hiện ở đây sau khi kiểm tra.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm font-medium leading-6 text-loot-text">
                {result.isCorrect ? 'Chuẩn rồi. Nghe tốt đó.' : 'Chưa đúng. Đã lưu vào Mistake Book.'}
              </p>
              <div className="mt-4 space-y-2">
                {result.rows.map((row) => (
                  <div
                    key={row.key}
                    className="rounded-xl border border-loot-border bg-loot-selected p-3 text-sm font-normal text-loot-muted"
                  >
                    <span className="font-medium text-loot-text">{row.target || '(extra)'}</span>
                    {row.status === 'wrong' ? <span> / bạn gõ: {row.typed || '(thiếu)'}</span> : null}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-[20px] border border-loot-border bg-loot-card p-4">
                <p className="text-sm font-normal text-loot-muted">Nghĩa</p>
                <p className="mt-1 text-sm font-medium leading-6 text-loot-text">{item.meaning}</p>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
