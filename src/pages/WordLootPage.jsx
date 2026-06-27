import { useState } from 'react';
import AudioButton from '../components/AudioButton.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import words from '../data/words.json';
import { getProgress, markWordHard, markWordKnown } from '../lib/storage.js';

function safeWords() {
  return Array.isArray(words) ? words : [];
}

function getWordKey(item) {
  return item?.id || item?.word || '';
}

function makeSavedSet(list) {
  return new Set(
    (Array.isArray(list) ? list : [])
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function wordMatchesSet(item, savedSet) {
  const keys = [item?.id, item?.word]
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return keys.some((key) => savedSet.has(key));
}

function getWordStatus(item, progress) {
  if (wordMatchesSet(item, makeSavedSet(progress.hardWords))) {
    return 'hard';
  }

  if (wordMatchesSet(item, makeSavedSet(progress.knownWords))) {
    return 'known';
  }

  return 'new';
}

function getStatusLabel(status) {
  if (status === 'hard') {
    return 'từ khó';
  }

  if (status === 'known') {
    return 'đã biết';
  }

  return 'mới';
}

function getWordWeight(item, progress) {
  const status = getWordStatus(item, progress);

  if (status === 'hard') {
    return 2.5;
  }

  if (status === 'known') {
    return 0.35;
  }

  return 1;
}

function pickWeightedWord(progress, previousWordKey = '') {
  const allWords = safeWords();
  const candidates =
    allWords.length > 1 ? allWords.filter((item) => getWordKey(item) !== previousWordKey) : allWords;
  const weightedWords = candidates.map((item) => ({
    item,
    weight: getWordWeight(item, progress),
  }));
  const totalWeight = weightedWords.reduce((total, entry) => total + entry.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const entry of weightedWords) {
    cursor -= entry.weight;

    if (cursor <= 0) {
      return entry.item;
    }
  }

  return weightedWords[0]?.item || null;
}

const primaryButtonClass =
  'h-10 rounded-xl bg-loot-text px-5 text-sm font-medium text-loot-card transition-opacity hover:opacity-90';
const secondaryButtonClass =
  'h-10 rounded-xl border border-loot-border bg-loot-card px-5 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected';
const selectedButtonClass =
  'h-10 rounded-xl border border-loot-border bg-loot-selected px-5 text-sm font-medium text-loot-text';

export default function WordLootPage() {
  const [progress, setProgress] = useState(() => getProgress());
  const [currentWord, setCurrentWord] = useState(() => pickWeightedWord(getProgress()));
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
    const nextProgress = markWordKnown(currentWordKey);
    setProgress(nextProgress);
    setIsRevealed(true);
  }

  function handleHard() {
    const nextProgress = markWordHard(currentWordKey);
    setProgress(nextProgress);
    setIsRevealed(true);
  }

  function handleNext() {
    const latestProgress = getProgress();
    setProgress(latestProgress);
    setCurrentWord(pickWeightedWord(latestProgress, currentWordKey));
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
