const STORAGE_KEY = 'englishLootProgress';

export const defaultProgress = {
  streak: 0,
  exp: 0,
  level: 1,
  knownWords: [],
  hardWords: [],
  mistakes: [],
  bossScores: [],
  dailyLootHistory: [],
};

function cloneProgress(progress) {
  return JSON.parse(JSON.stringify(progress));
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function toNumber(value, fallback, minimum = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(minimum, Math.floor(number));
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(value) {
  return [
    ...new Set(
      toArray(value)
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function addUniqueString(list, value) {
  const key = typeof value === 'string' ? value.trim() : '';

  if (!key) {
    return uniqueStrings(list);
  }

  return [...new Set([...uniqueStrings(list), key])];
}

function removeString(list, value) {
  const key = typeof value === 'string' ? value.trim() : '';

  if (!key) {
    return uniqueStrings(list);
  }

  return uniqueStrings(list).filter((item) => item !== key);
}

function makeMistakeId() {
  return `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeMistake(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return {
    id: typeof value.id === 'string' && value.id.trim() ? value.id.trim() : makeMistakeId(),
    type: typeof value.type === 'string' && value.type.trim() ? value.type.trim() : 'practice',
    target: typeof value.target === 'string' && value.target.trim() ? value.target.trim() : 'Unknown target',
    userAnswer: typeof value.userAnswer === 'string' ? value.userAnswer.trim() : '',
    sourceId: typeof value.sourceId === 'string' ? value.sourceId.trim() : '',
    createdAt: typeof value.createdAt === 'string' && value.createdAt.trim() ? value.createdAt : new Date().toISOString(),
  };
}

function sanitizeMistakes(value) {
  return toArray(value).map(sanitizeMistake).filter(Boolean);
}

function sanitizeBossScore(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const total = toNumber(value.total, 0);
  const score = toNumber(value.score, 0);
  const percent = total > 0 ? Math.round((score / total) * 100) : toNumber(value.percent, 0);

  return {
    id: typeof value.id === 'string' && value.id.trim() ? value.id.trim() : `boss-${Date.now()}`,
    score,
    total,
    percent,
    createdAt: typeof value.createdAt === 'string' && value.createdAt.trim() ? value.createdAt : new Date().toISOString(),
  };
}

function sanitizeBossScores(value) {
  return toArray(value).map(sanitizeBossScore).filter(Boolean);
}

export function sanitizeProgress(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};

  return {
    streak: toNumber(source.streak, defaultProgress.streak),
    exp: toNumber(source.exp, defaultProgress.exp),
    level: toNumber(source.level, defaultProgress.level, 1),
    knownWords: uniqueStrings(source.knownWords),
    hardWords: uniqueStrings(source.hardWords),
    mistakes: sanitizeMistakes(source.mistakes),
    bossScores: sanitizeBossScores(source.bossScores),
    dailyLootHistory: toArray(source.dailyLootHistory),
  };
}

export function readProgress() {
  if (!canUseLocalStorage()) {
    return cloneProgress(defaultProgress);
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return cloneProgress(defaultProgress);
    }

    return sanitizeProgress(JSON.parse(saved));
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage cleanup failures and fall back safely.
    }

    return cloneProgress(defaultProgress);
  }
}

export function writeProgress(nextProgress) {
  const progress = sanitizeProgress(nextProgress);

  if (!canUseLocalStorage()) {
    return progress;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Keep the app usable even if localStorage is full or blocked.
  }

  return progress;
}

export function updateProgress(updater) {
  const currentProgress = readProgress();
  const nextProgress =
    typeof updater === 'function' ? updater(currentProgress) : { ...currentProgress, ...updater };

  return writeProgress({ ...currentProgress, ...nextProgress });
}

export function resetProgress() {
  if (canUseLocalStorage()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage cleanup failures and return a clean default.
    }
  }

  return cloneProgress(defaultProgress);
}

export const getProgress = readProgress;
export const saveProgress = writeProgress;

export function markWordKnown(wordId) {
  const key = typeof wordId === 'string' ? wordId.trim() : '';

  if (!key) {
    return readProgress();
  }

  return updateProgress((currentProgress) => ({
    knownWords: addUniqueString(currentProgress.knownWords, key),
    hardWords: removeString(currentProgress.hardWords, key),
  }));
}

export function markWordHard(wordId) {
  const key = typeof wordId === 'string' ? wordId.trim() : '';

  if (!key) {
    return readProgress();
  }

  return updateProgress((currentProgress) => ({
    knownWords: removeString(currentProgress.knownWords, key),
    hardWords: addUniqueString(currentProgress.hardWords, key),
  }));
}

export function addMistake(mistake) {
  const nextMistake = sanitizeMistake(mistake);

  if (!nextMistake) {
    return readProgress();
  }

  return updateProgress((currentProgress) => ({
    mistakes: [
      nextMistake,
      ...sanitizeMistakes(currentProgress.mistakes).filter(
        (savedMistake) =>
          savedMistake.type !== nextMistake.type ||
          savedMistake.target !== nextMistake.target ||
          savedMistake.userAnswer !== nextMistake.userAnswer ||
          savedMistake.sourceId !== nextMistake.sourceId,
      ),
    ],
  }));
}

export function removeMistake(mistakeId) {
  const key = typeof mistakeId === 'string' ? mistakeId.trim() : '';

  if (!key) {
    return readProgress();
  }

  return updateProgress((currentProgress) => ({
    mistakes: toArray(currentProgress.mistakes).filter((mistake) => mistake?.id !== key),
  }));
}

export function clearMistakes() {
  return updateProgress({ mistakes: [] });
}

export function saveBossScore(score) {
  const total = toNumber(score?.total, 0);
  const value = toNumber(score?.score, 0);
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  const nextScore = {
    id: `boss-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    score: value,
    total,
    percent,
    createdAt: new Date().toISOString(),
  };

  return updateProgress((currentProgress) => ({
    bossScores: [nextScore, ...toArray(currentProgress.bossScores)].slice(0, 10),
  }));
}
