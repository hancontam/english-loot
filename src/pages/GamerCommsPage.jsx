import { useMemo, useState } from 'react';
import AudioButton from '../components/AudioButton.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import gamerTerms from '../data/gamerTerms.json';
import { addMistake } from '../lib/storage.js';

function safeTerms() {
  return Array.isArray(gamerTerms) ? gamerTerms : [];
}

function pickNextTerm(previousId = '') {
  const allTerms = safeTerms();
  const candidates = allTerms.length > 1 ? allTerms.filter((item) => item.id !== previousId) : allTerms;
  const index = Math.floor(Math.random() * candidates.length);

  return candidates[index] || null;
}

function makeQuizOptions(currentTerm) {
  const meanings = safeTerms()
    .map((item) => item.meaning)
    .filter(Boolean);
  const wrongMeanings = meanings.filter((meaning) => meaning !== currentTerm.meaning).slice(0, 2);

  return [currentTerm.meaning, ...wrongMeanings].sort((left, right) => left.localeCompare(right));
}

const primaryButtonClass =
  'h-10 rounded-xl bg-loot-text px-5 text-sm font-medium text-loot-card transition-opacity hover:opacity-90';
const secondaryButtonClass =
  'h-10 rounded-xl border border-loot-border bg-loot-card px-5 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected';

export default function GamerCommsPage() {
  const [currentTerm, setCurrentTerm] = useState(() => pickNextTerm());
  const [isRevealed, setIsRevealed] = useState(false);
  const [quizResult, setQuizResult] = useState('');
  const quizOptions = useMemo(() => (currentTerm ? makeQuizOptions(currentTerm) : []), [currentTerm]);

  if (!currentTerm) {
    return (
      <>
        <PageHeader
          eyebrow="Gamer Comms"
          title="Short comms, right moment"
          description="Practice clean match calls and chat phrases in context."
        />

        <Card>
          <p className="text-sm font-normal leading-6 text-loot-muted">No gamer comms data is ready yet.</p>
        </Card>
      </>
    );
  }

  function handleQuiz(answer) {
    if (answer === currentTerm.meaning) {
      setQuizResult('Correct. That comm is ready for match chat.');
      return;
    }

    addMistake({
      type: 'gamer-comms',
      target: `${currentTerm.term} = ${currentTerm.meaning}`,
      userAnswer: answer,
      sourceId: currentTerm.id,
    });
    setQuizResult('Not yet. Saved to Mistake Book for review.');
  }

  function handleNext() {
    setCurrentTerm(pickNextTerm(currentTerm.id));
    setIsRevealed(false);
    setQuizResult('');
  }

  return (
    <>
      <PageHeader
        eyebrow="Gamer Comms"
        title="Short comms, right moment"
        description="Practice Valorant, voice chat, and quick game English with tiny context checks."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-medium text-loot-text">{currentTerm.term}</h3>
                <span className="rounded-[40px] border border-loot-border bg-loot-selected px-3 py-1 text-sm font-normal text-loot-muted">
                  {currentTerm.category}
                </span>
              </div>
              <p className="mt-2 text-sm font-normal text-loot-muted">Say it fast, keep it clean.</p>
            </div>
            <AudioButton text={`${currentTerm.term}. ${currentTerm.example}`} />
          </div>

          <div className="mt-6 rounded-[20px] border border-loot-border bg-loot-selected p-5">
            <p className="text-sm font-medium text-loot-text">Game example</p>
            <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{currentTerm.example}</p>
          </div>

          {isRevealed ? (
            <div className="mt-4 rounded-[20px] border border-loot-border bg-loot-card p-5">
              <p className="text-sm font-normal text-loot-muted">Meaning</p>
              <p className="mt-1 text-base font-medium text-loot-text">{currentTerm.meaning}</p>
              <p className="mt-3 text-sm font-normal leading-6 text-loot-muted">{currentTerm.translation}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button className={secondaryButtonClass} type="button" onClick={() => setIsRevealed((value) => !value)}>
              {isRevealed ? 'Hide meaning' : 'Reveal meaning'}
            </button>
            <button className={primaryButtonClass} type="button" onClick={handleNext}>
              Next comm
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-loot-text">Mini quiz</p>
          <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">
            Choose the best meaning for this comm.
          </p>
          <div className="mt-4 space-y-3">
            {quizOptions.map((option) => (
              <button key={option} className={`${secondaryButtonClass} h-auto min-h-10 w-full py-2`} type="button" onClick={() => handleQuiz(option)}>
                {option}
              </button>
            ))}
          </div>
          {quizResult ? <p className="mt-4 text-sm font-medium leading-6 text-loot-text">{quizResult}</p> : null}
        </Card>
      </div>
    </>
  );
}
