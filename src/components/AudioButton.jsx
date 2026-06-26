import LineIcon from './LineIcon.jsx';

export default function AudioButton({ text }) {
  const play = () => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      className="inline-flex h-10 items-center gap-2 rounded-xl bg-loot-text px-4 text-sm font-medium text-loot-card transition-opacity hover:opacity-90"
      type="button"
      onClick={play}
      title="Play English audio"
    >
      <LineIcon name="listen" />
      Nghe
    </button>
  );
}
