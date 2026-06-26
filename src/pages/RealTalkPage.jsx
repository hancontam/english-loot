import { useMemo, useState } from 'react';
import AudioButton from '../components/AudioButton.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import phrases from '../data/phrases.json';
import { addMistake } from '../lib/storage.js';

function safePhrases() {
  return Array.isArray(phrases) ? phrases : [];
}

function pickNextPhrase(previousId = '') {
  const allPhrases = safePhrases();
  const candidates = allPhrases.length > 1 ? allPhrases.filter((item) => item.id !== previousId) : allPhrases;
  const index = Math.floor(Math.random() * candidates.length);

  return candidates[index] || null;
}

function makeQuizOptions(currentPhrase) {
  const answers = safePhrases()
    .map((item) => item.full)
    .filter(Boolean);
  const wrongAnswers = answers.filter((answer) => answer !== currentPhrase.full).slice(0, 2);

  return [currentPhrase.full, ...wrongAnswers].sort((left, right) => left.localeCompare(right));
}

const primaryButtonClass =
  'h-10 rounded-xl bg-loot-text px-5 text-sm font-medium text-loot-card transition-opacity hover:opacity-90';
const secondaryButtonClass =
  'h-10 rounded-xl border border-loot-border bg-loot-card px-5 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected';

export default function RealTalkPage() {
  const [currentPhrase, setCurrentPhrase] = useState(() => pickNextPhrase());
  const [isRevealed, setIsRevealed] = useState(false);
  const [quizResult, setQuizResult] = useState('');
  const quizOptions = useMemo(
    () => (currentPhrase ? makeQuizOptions(currentPhrase) : []),
    [currentPhrase],
  );

  if (!currentPhrase) {
    return (
      <>
        <PageHeader
          eyebrow="Real Talk"
          title="Real talk and reduced speech"
          description="Learn phrases in context, then repeat them until they feel natural."
        />

        <Card>
          <p className="text-sm font-normal leading-6 text-loot-muted">No phrase data is ready yet.</p>
        </Card>
      </>
    );
  }

  function handleQuiz(answer) {
    if (answer === currentPhrase.full) {
      setQuizResult('Correct. This phrase is starting to stick.');
      return;
    }

    addMistake({
      type: 'real-talk',
      target: `${currentPhrase.phrase} = ${currentPhrase.full}`,
      userAnswer: answer,
      sourceId: currentPhrase.id,
    });
    setQuizResult('Not yet. Saved to Mistake Book for review.');
  }

  function handleNext() {
    setCurrentPhrase(pickNextPhrase(currentPhrase.id));
    setIsRevealed(false);
    setQuizResult('');
  }

  return (
    <>
      <PageHeader
        eyebrow="Real Talk"
        title="Real talk and reduced speech"
        description="Learn each phrase in context, listen to it, then check the full form with a tiny quiz."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-medium text-loot-text">{currentPhrase.phrase}</h3>
                <span className="rounded-[40px] border border-loot-border bg-loot-selected px-3 py-1 text-sm font-normal text-loot-muted">
                  {currentPhrase.level}
                </span>
              </div>
              <p className="mt-2 text-sm font-normal text-loot-muted">{currentPhrase.context}</p>
            </div>
            <AudioButton text={`${currentPhrase.phrase}. ${currentPhrase.example}`} />
          </div>

          <div className="mt-6 rounded-[20px] border border-loot-border bg-loot-selected p-5">
            <p className="text-sm font-medium text-loot-text">Example</p>
            <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{currentPhrase.example}</p>
          </div>

          {isRevealed ? (
            <div className="mt-4 rounded-[20px] border border-loot-border bg-loot-card p-5">
              <p className="text-sm font-normal text-loot-muted">Full form</p>
              <p className="mt-1 text-base font-medium text-loot-text">{currentPhrase.full}</p>
              <p className="mt-3 text-sm font-normal text-loot-muted">{currentPhrase.meaning}</p>
              <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">{currentPhrase.translation}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button className={secondaryButtonClass} type="button" onClick={() => setIsRevealed((value) => !value)}>
              {isRevealed ? 'Hide answer' : 'Reveal answer'}
            </button>
            <button className={primaryButtonClass} type="button" onClick={handleNext}>
              Next phrase
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-loot-text">Mini quiz</p>
          <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">
            Choose the full form for this phrase.
          </p>
          <div className="mt-4 space-y-3">
            {quizOptions.map((option) => (
              <button key={option} className={`${secondaryButtonClass} w-full justify-center`} type="button" onClick={() => handleQuiz(option)}>
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
