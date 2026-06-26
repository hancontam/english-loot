const STORAGE_KEY = 'englishLootProgress';

export const defaultProgress = {
  streak: 0,
  exp: 0,
  level: 1,
  knownWords: [],
  hardWords: [],
  mistakes: [],
  bossScores: [],
};

export function getProgress() {
  if (typeof window === 'undefined') {
    return defaultProgress;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(nextProgress) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultProgress, ...nextProgress }));
}

export function resetProgress() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
