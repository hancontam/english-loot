import { useState } from 'react';
import AudioButton from '../components/AudioButton.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import words from '../data/words.json';
import { makeWordLearningEventPayload } from '../utils/learning/events.js';
import { WORD_DOMAIN, getWordKey } from '../utils/learning/itemKeys.js';
import { buildWordMasteryRecord, getWordStatus } from '../utils/learning/mastery.js';
import { pickWeightedWord } from '../utils/learning/selectors.js';
import {
  addLearningEvent,
  getProgress,
  markWordHard,
  markWordKnown,
  updateItemMastery,
} from '../lib/storage.js';

function getStatusLabel(status) {
  if (status === 'hard') {
    return 'từ khó';
  }

  if (status === 'known') {
    return 'đã biết';
  }

  return 'mới';
}

const primaryButtonClass =
  'h-10 rounded-xl bg-loot-text px-5 text-sm font-medium text-loot-card transition-opacity hover:opacity-90';
const secondaryButtonClass =
  'h-10 rounded-xl border border-loot-border bg-loot-card px-5 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected';
const selectedButtonClass =
  'h-10 rounded-xl border border-loot-border bg-loot-selected px-5 text-sm font-medium text-loot-text';

export default function WordLootPage() {
  const [progress, setProgress] = useState(() => getProgress());
  const [currentWord, setCurrentWord] = useState(() => pickWeightedWord(words, getProgress()));
  const [isRevealed, setIsRevealed] = useState(false);

  if (!currentWord) {
    return (
      <>
        <PageHeader
          eyebrow="Word Loot"
          title="Từ vựng TOEIC theo ngữ cảnh"
          description="Mỗi card có nghĩa tiếng Việt, ví dụ tiếng Anh, bản dịch tự nhiên và trap words để tránh nghe nhầm."
        />

        <Card>
          <p className="text-sm font-normal leading-6 text-loot-muted">Chưa có dữ liệu từ vựng.</p>
        </Card>
      </>
    );
  }

  const currentStatus = getWordStatus(currentWord, progress);
  const currentWordKey = getWordKey(currentWord);
  const audioText = [currentWord.word, currentWord.example].filter(Boolean).join('. ');

  function handleKnown() {
    const progressBefore = getProgress();

    markWordKnown(currentWordKey);
    updateItemMastery(WORD_DOMAIN, currentWordKey, () =>
      buildWordMasteryRecord(currentWord, 'known', progressBefore),
    );
    const nextProgress = addLearningEvent(makeWordLearningEventPayload(currentWord, 'known'));

    setProgress(nextProgress);
    setIsRevealed(true);
  }

  function handleHard() {
    const progressBefore = getProgress();

    markWordHard(currentWordKey);
    updateItemMastery(WORD_DOMAIN, currentWordKey, () =>
      buildWordMasteryRecord(currentWord, 'hard', progressBefore),
    );
    const nextProgress = addLearningEvent(makeWordLearningEventPayload(currentWord, 'hard'));

    setProgress(nextProgress);
    setIsRevealed(true);
  }

  function handleNext() {
    const latestProgress = getProgress();
    setProgress(latestProgress);
    setCurrentWord(pickWeightedWord(words, latestProgress, currentWordKey));
    setIsRevealed(false);
  }

  return (
    <>
      <PageHeader
        eyebrow="Word Loot"
        title="Từ vựng TOEIC theo ngữ cảnh"
        description="Mỗi card có nghĩa tiếng Việt, ví dụ tiếng Anh, bản dịch tự nhiên và trap words để tránh nghe nhầm."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-normal text-loot-muted">
                {currentWord.topic} - TOEIC {currentWord.level}
              </p>
              <h3 className="mt-2 text-lg font-medium text-loot-text">{currentWord.word}</h3>
            </div>
            <AudioButton text={audioText} />
          </div>

          {isRevealed ? (
            <div className="mt-6 rounded-[20px] border border-loot-border bg-loot-selected p-5">
              <p className="text-base font-medium text-loot-text">{currentWord.meaning}</p>
              <p className="mt-3 text-sm font-normal leading-6 text-loot-muted">{currentWord.example}</p>
              <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{currentWord.translation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(currentWord.traps || []).map((trap) => (
                  <span
                    key={trap}
                    className="rounded-[40px] border border-loot-border bg-loot-card px-3 py-1 text-sm font-normal text-loot-muted"
                  >
                    {trap}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[20px] border border-loot-border bg-loot-selected p-5">
              <p className="text-sm font-medium text-loot-text">Thử đoán trước, rồi mở nghĩa.</p>
              <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">
                Nghe từ và đoán nghĩa từ trí nhớ trước khi mở đáp án.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button className={secondaryButtonClass} type="button" onClick={() => setIsRevealed((value) => !value)}>
              {isRevealed ? 'Ẩn nghĩa' : 'Mở nghĩa'}
            </button>
            <button
              aria-pressed={currentStatus === 'hard'}
              className={currentStatus === 'hard' ? selectedButtonClass : secondaryButtonClass}
              type="button"
              onClick={handleHard}
            >
              Từ khó
            </button>
            <button
              aria-pressed={currentStatus === 'known'}
              className={currentStatus === 'known' ? selectedButtonClass : primaryButtonClass}
              type="button"
              onClick={handleKnown}
            >
              Đã biết
            </button>
            <button className={secondaryButtonClass} type="button" onClick={handleNext}>
              Thẻ tiếp theo
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-loot-text">Tiến độ đã lưu</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[20px] border border-loot-border bg-loot-selected p-4">
              <p className="text-sm font-normal text-loot-muted">Từ đã biết</p>
              <p className="mt-1 text-base font-medium text-loot-text">{progress.knownWords.length}</p>
            </div>
            <div className="rounded-[20px] border border-loot-border bg-loot-selected p-4">
              <p className="text-sm font-normal text-loot-muted">Từ khó</p>
              <p className="mt-1 text-base font-medium text-loot-text">{progress.hardWords.length}</p>
            </div>
            <div className="rounded-[20px] border border-loot-border bg-loot-selected p-4">
              <p className="text-sm font-normal text-loot-muted">Thẻ hiện tại</p>
              <p className="mt-1 text-base font-medium text-loot-text">{getStatusLabel(currentStatus)}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
