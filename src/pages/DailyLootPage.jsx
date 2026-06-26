import Card from '../components/Card.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import MascotBubble from '../components/MascotBubble.jsx';
import ProgressBadge from '../components/ProgressBadge.jsx';
import gamerTerms from '../data/gamerTerms.json';
import listeningItems from '../data/listeningItems.json';
import phrases from '../data/phrases.json';
import words from '../data/words.json';
import { getProgress } from '../lib/storage.js';

const featureCards = [
  {
    title: 'Word Loot',
    description: 'TOEIC words in context with meaning, examples, and trap words.',
    count: '10 words',
    icon: 'word',
    to: '/word-loot',
  },
  {
    title: 'Real Talk',
    description: 'Daily phrases, chat shortcuts, and common reduced speech.',
    count: '5 phrases',
    icon: 'talk',
    to: '/real-talk',
  },
  {
    title: 'Gamer Comms',
    description: 'Clean Valorant and voice chat terms for real match situations.',
    count: '5 comms',
    icon: 'game',
    to: '/gamer-comms',
  },
  {
    title: 'Listen & Type',
    description: 'One short listening challenge using English text to speech.',
    count: '1 challenge',
    icon: 'listen',
    to: '/listen-type',
  },
];

export default function DailyLootPage() {
  const progress = getProgress();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-[640px]">
            <p className="text-sm font-normal text-loot-muted">Daily Loot</p>
            <h1 className="mt-2 text-lg font-medium text-loot-text">Today&apos;s Loot</h1>
            <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">
              TOEIC, Real Talk, Gamer English, Listening
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="h-10 rounded-xl bg-loot-text px-5 text-sm font-medium text-loot-card transition-opacity hover:opacity-90"
                type="button"
              >
                Start today
              </button>
              <button
                className="h-10 rounded-xl border border-loot-border bg-loot-card px-5 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected"
                type="button"
              >
                Review plan
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[24px] border border-loot-border bg-loot-selected p-4">
            <MascotBubble />
            <div>
              <p className="text-sm font-medium text-loot-text">Soft reward</p>
              <p className="mt-1 text-sm font-normal text-loot-muted">Keep the daily loop calm and small.</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ProgressBadge progress={progress} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((item) => (
          <FeatureCard
            key={item.title}
            count={item.count}
            description={item.description}
            icon={item.icon}
            title={item.title}
            to={item.to}
          />
        ))}
      </div>

      <Card className="p-5">
        <p className="text-sm font-medium text-loot-text">Static content ready</p>
        <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">
          Current sample pool: {words.length} words, {phrases.length} real talk phrases, {gamerTerms.length} gamer
          comms, and {listeningItems.length} listening items.
        </p>
      </Card>
    </div>
  );
}
