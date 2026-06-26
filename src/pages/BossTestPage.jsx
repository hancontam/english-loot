import { useMemo, useState } from 'react';
import AudioButton from '../components/AudioButton.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import gamerTerms from '../data/gamerTerms.json';
import listeningItems from '../data/listeningItems.json';
import phrases from '../data/phrases.json';
import words from '../data/words.json';
import { addMistake, getProgress, saveBossScore } from '../lib/storage.js';

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cycleItems(items, count) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => items[index % items.length]);
}

function makeOptions(answer, pool) {
  return [answer, ...pool.filter((item) => item && item !== answer).slice(0, 3)].sort((left, right) =>
    left.localeCompare(right),
  );
}

function buildQuestions() {
  const wordMeanings = words.map((item) => item.meaning).filter(Boolean);
  const phraseFullForms = phrases.map((item) => item.full).filter(Boolean);
  const gamerMeanings = gamerTerms.map((item) => item.meaning).filter(Boolean);

  return [
    ...cycleItems(words, 5).map((item, index) => ({
      id: `word-${index}-${item.id}`,
      type: 'boss-word',
      label: 'TOEIC word',
      prompt: `What does "${item.word}" mean?`,
      answer: item.meaning,
      options: makeOptions(item.meaning, wordMeanings),
      sourceId: item.id,
    })),
    ...cycleItems(listeningItems, 5).map((item, index) => ({
      id: `listen-${index}-${item.id}`,
      type: 'boss-listening',
      label: 'Listen & Type',
      prompt: 'Type the sentence you hear.',
      answer: item.sentence,
      audioText: item.sentence,
      sourceId: item.id,
      inputMode: 'text',
    })),
    ...cycleItems(phrases, 5).map((item, index) => ({
      id: `phrase-${index}-${item.id}`,
      type: 'boss-real-talk',
      label: 'Real Talk',
      prompt: `Full form of "${item.phrase}"`,
      answer: item.full,
      options: makeOptions(item.full, phraseFullForms),
      sourceId: item.id,
    })),
    ...cycleItems(gamerTerms, 5).map((item, index) => ({
      id: `gamer-${index}-${item.id}`,
      type: 'boss-gamer-comms',
      label: 'Gamer Comms',
      prompt: `Meaning of "${item.term}"`,
      answer: item.meaning,
      options: makeOptions(item.meaning, gamerMeanings),
      sourceId: item.id,
    })),
  ];
}

function getBestScore(scores) {
  return (Array.isArray(scores) ? scores : []).reduce((best, score) => {
    if (!best || Number(score.percent) > Number(best.percent)) {
      return score;
    }

    return best;
  }, null);
}

const primaryButtonClass =
  'h-10 rounded-xl bg-loot-text px-5 text-sm font-medium text-loot-card transition-opacity hover:opacity-90';
const secondaryButtonClass =
  'h-10 rounded-xl border border-loot-border bg-loot-card px-5 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected';

export default function BossTestPage() {
  const questions = useMemo(() => buildQuestions(), []);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(() => getProgress());
  const bestScore = getBestScore(progress.bossScores);

  function setAnswer(questionId, value) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  }

  function handleSubmit() {
    let score = 0;
    const checkedQuestions = questions.map((question) => {
      const userAnswer = answers[question.id] || '';
      const isCorrect = normalizeText(userAnswer) === normalizeText(question.answer);

      if (isCorrect) {
        score += 1;
      } else {
        addMistake({
          type: question.type,
          target: question.answer,
          userAnswer,
          sourceId: question.sourceId,
        });
      }

      return {
        ...question,
        userAnswer,
        isCorrect,
      };
    });

    const nextProgress = saveBossScore({ score, total: questions.length });
    setProgress(nextProgress);
    setResult({
      score,
      total: questions.length,
      questions: checkedQuestions,
    });
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="Weekly Boss"
        title="Boss Test"
        description="A 20-question mixed check from TOEIC words, Listen & Type, Real Talk, and Gamer Comms."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-loot-muted">
                  {index + 1}. {question.label}
                </p>
                {question.audioText ? <AudioButton text={question.audioText} /> : null}
              </div>
              <p className="mt-3 text-base font-medium text-loot-text">{question.prompt}</p>

              {question.inputMode === 'text' ? (
                <input
                  className="mt-4 h-10 w-full rounded-xl border border-loot-border bg-loot-card px-3 text-sm font-normal text-loot-text outline-none focus:bg-loot-selected"
                  placeholder="Type your answer..."
                  value={answers[question.id] || ''}
                  onChange={(event) => setAnswer(question.id, event.target.value)}
                />
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      className={
                        answers[question.id] === option
                          ? 'min-h-10 rounded-xl border border-loot-border bg-loot-selected px-4 py-2 text-sm font-medium text-loot-text'
                          : 'min-h-10 rounded-xl border border-loot-border bg-loot-card px-4 py-2 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected'
                      }
                      type="button"
                      onClick={() => setAnswer(question.id, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {result ? (
                <p className="mt-4 text-sm font-medium text-loot-text">
                  {result.questions.find((item) => item.id === question.id)?.isCorrect
                    ? 'Correct'
                    : `Answer: ${question.answer}`}
                </p>
              ) : null}
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <p className="text-sm font-medium text-loot-text">Score</p>
          {result ? (
            <p className="mt-2 text-lg font-medium text-loot-text">
              {result.score}/{result.total}
            </p>
          ) : (
            <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">Submit when all answers are ready.</p>
          )}
          <p className="mt-4 text-sm font-normal leading-6 text-loot-muted">
            Best score: {bestScore ? `${bestScore.score}/${bestScore.total} (${bestScore.percent}%)` : 'not yet'}
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <button className={primaryButtonClass} type="button" onClick={handleSubmit}>
              Submit test
            </button>
            <button className={secondaryButtonClass} type="button" onClick={handleReset}>
              Reset answers
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
