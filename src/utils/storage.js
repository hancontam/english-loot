const STORAGE_KEY = 'englishLootProgress';
const STORAGE_SCHEMA_VERSION = 2;
const MAX_ACTIVITY_EVENTS = 1000;

export const defaultProgress = {
  schemaVersion: STORAGE_SCHEMA_VERSION,
  streak: 0,
  exp: 0,
  level: 1,
  knownWords: [],
  hardWords: [],
  mistakes: [],
  bossScores: [],
  dailyLootHistory: [],
  itemMastery: {},
  activityLog: [],
  dailyStats: {},
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

function toFiniteNumber(value, fallback, minimum = 0, maximum = Number.POSITIVE_INFINITY) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, number));
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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

function cleanString(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function sanitizeIsoString(value, fallback = '') {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return value;
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

function makeLearningEventId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function makeItemKey(domain, itemId) {
  const domainKey = cleanString(domain);
  const itemKey = cleanString(itemId);

  if (!itemKey && domainKey.includes(':')) {
    return domainKey;
  }

  if (!domainKey || !itemKey) {
    return '';
  }

  return `${domainKey}:${itemKey}`;
}

function parseItemKey(value) {
  const key = cleanString(value);
  const separatorIndex = key.indexOf(':');

  if (separatorIndex <= 0 || separatorIndex === key.length - 1) {
    return {
      domain: '',
      itemId: '',
    };
  }

  return {
    domain: key.slice(0, separatorIndex),
    itemId: key.slice(separatorIndex + 1),
  };
}

function resolveItemMasteryArgs(domain, itemId, updater) {
  const parsedSingleKey = parseItemKey(domain);

  if (parsedSingleKey.domain && parsedSingleKey.itemId && typeof itemId !== 'string') {
    return {
      key: makeItemKey(parsedSingleKey.domain, parsedSingleKey.itemId),
      domain: parsedSingleKey.domain,
      itemId: parsedSingleKey.itemId,
      updater: itemId,
    };
  }

  const key = makeItemKey(domain, itemId);
  const parsedKey = parseItemKey(key);

  return {
    key,
    domain: parsedKey.domain,
    itemId: parsedKey.itemId,
    updater,
  };
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

function createDefaultMasteryRecord(domain, itemId) {
  return {
    domain,
    itemId,
    mastery: 20,
    exposureCount: 0,
    correctCount: 0,
    wrongCount: 0,
    currentCorrectStreak: 0,
    lastSeenAt: '',
    nextReviewAt: '',
    intervalDays: 0,
    ease: 2,
    lastResult: '',
    mistakeCategories: [],
  };
}

function sanitizeMasteryRecord(value, fallbackKey = '') {
  if (!isPlainObject(value)) {
    return null;
  }

  const parsedKey = parseItemKey(fallbackKey);
  const domain = cleanString(value.domain, parsedKey.domain);
  const itemId = cleanString(value.itemId, parsedKey.itemId);

  if (!domain || !itemId) {
    return null;
  }

  return {
    ...createDefaultMasteryRecord(domain, itemId),
    mastery: Math.round(toFiniteNumber(value.mastery, 20, 0, 100)),
    exposureCount: toNumber(value.exposureCount, 0),
    correctCount: toNumber(value.correctCount, 0),
    wrongCount: toNumber(value.wrongCount, 0),
    currentCorrectStreak: toNumber(value.currentCorrectStreak, 0),
    lastSeenAt: sanitizeIsoString(value.lastSeenAt),
    nextReviewAt: sanitizeIsoString(value.nextReviewAt),
    intervalDays: toNumber(value.intervalDays, 0),
    ease: toFiniteNumber(value.ease, 2, 1, 5),
    lastResult: cleanString(value.lastResult),
    mistakeCategories: uniqueStrings(value.mistakeCategories),
  };
}

function sanitizeItemMastery(value) {
  if (!isPlainObject(value)) {
    return {};
  }

  return Object.entries(value).reduce((records, [key, record]) => {
    const nextRecord = sanitizeMasteryRecord(record, key);

    if (!nextRecord) {
      return records;
    }

    return {
      ...records,
      [makeItemKey(nextRecord.domain, nextRecord.itemId)]: nextRecord,
    };
  }, {});
}

function sanitizeLearningEvent(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    id: cleanString(value.id, makeLearningEventId()),
    createdAt: sanitizeIsoString(value.createdAt, new Date().toISOString()),
    page: cleanString(value.page),
    domain: cleanString(value.domain),
    itemId: cleanString(value.itemId),
    eventType: cleanString(value.eventType, 'learning_event'),
    result: cleanString(value.result),
    score: toFiniteNumber(value.score, 0, 0, 1),
    userAnswer: typeof value.userAnswer === 'string' ? value.userAnswer.trim() : '',
    targetAnswer: typeof value.targetAnswer === 'string' ? value.targetAnswer.trim() : '',
    mistakeCategories: uniqueStrings(value.mistakeCategories),
  };
}

function sanitizeActivityLog(value) {
  return toArray(value).map(sanitizeLearningEvent).filter(Boolean).slice(0, MAX_ACTIVITY_EVENTS);
}

function sanitizeDailyStat(value) {
  const source = isPlainObject(value) ? value : {};

  return {
    events: toNumber(source.events, 0),
    correct: toNumber(source.correct, 0),
    wrong: toNumber(source.wrong, 0),
    expEarned: toNumber(source.expEarned, 0),
    completedLootItems: toNumber(source.completedLootItems, 0),
  };
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function sanitizeDateKey(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDateKey(value);
  }

  const key = cleanString(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
    return key;
  }

  const date = key ? new Date(key) : new Date();

  if (Number.isNaN(date.getTime())) {
    return formatDateKey(new Date());
  }

  return formatDateKey(date);
}

function sanitizeDailyStats(value) {
  if (!isPlainObject(value)) {
    return {};
  }

  return Object.entries(value).reduce((stats, [dateKey, stat]) => {
    const key = sanitizeDateKey(dateKey);

    return {
      ...stats,
      [key]: sanitizeDailyStat(stat),
    };
  }, {});
}

export function sanitizeProgress(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};

  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    streak: toNumber(source.streak, defaultProgress.streak),
    exp: toNumber(source.exp, defaultProgress.exp),
    level: toNumber(source.level, defaultProgress.level, 1),
    knownWords: uniqueStrings(source.knownWords),
    hardWords: uniqueStrings(source.hardWords),
    mistakes: sanitizeMistakes(source.mistakes),
    bossScores: sanitizeBossScores(source.bossScores),
    dailyLootHistory: toArray(source.dailyLootHistory),
    itemMastery: sanitizeItemMastery(source.itemMastery),
    activityLog: sanitizeActivityLog(source.activityLog),
    dailyStats: sanitizeDailyStats(source.dailyStats),
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

export const progressRepository = {
  read: readProgress,
  write: writeProgress,
  update: updateProgress,
  reset: resetProgress,
};

export function getItemMastery(domain, itemId) {
  const key = makeItemKey(domain, itemId);

  if (!key) {
    return null;
  }

  return readProgress().itemMastery[key] || null;
}

export function updateItemMastery(domain, itemId, updater) {
  const resolved = resolveItemMasteryArgs(domain, itemId, updater);

  if (!resolved.key || !resolved.domain || !resolved.itemId) {
    return readProgress();
  }

  return updateProgress((currentProgress) => {
    const currentRecords = sanitizeItemMastery(currentProgress.itemMastery);
    const currentRecord =
      currentRecords[resolved.key] || createDefaultMasteryRecord(resolved.domain, resolved.itemId);
    const nextRecord =
      typeof resolved.updater === 'function'
        ? resolved.updater(currentRecord)
        : { ...currentRecord, ...resolved.updater };
    const cleanRecord = sanitizeMasteryRecord(
      {
        ...currentRecord,
        ...nextRecord,
        domain: resolved.domain,
        itemId: resolved.itemId,
      },
      resolved.key,
    );

    return {
      itemMastery: {
        ...currentRecords,
        [resolved.key]: cleanRecord || currentRecord,
      },
    };
  });
}

export function addLearningEvent(event) {
  const nextEvent = sanitizeLearningEvent(event);

  if (!nextEvent) {
    return readProgress();
  }

  return updateProgress((currentProgress) => ({
    activityLog: [nextEvent, ...sanitizeActivityLog(currentProgress.activityLog)].slice(
      0,
      MAX_ACTIVITY_EVENTS,
    ),
  }));
}

export function getLearningEvents({ limit } = {}) {
  const events = readProgress().activityLog;
  const safeLimit = Number.isFinite(Number(limit)) ? Math.max(0, Math.floor(Number(limit))) : 0;

  return safeLimit > 0 ? events.slice(0, safeLimit) : events;
}

export function getDailyStats(dateKey = new Date()) {
  const key = sanitizeDateKey(dateKey);

  return readProgress().dailyStats[key] || sanitizeDailyStat();
}

export function updateDailyStats(dateKey = new Date(), updater = {}) {
  const key = sanitizeDateKey(dateKey);

  return updateProgress((currentProgress) => {
    const currentStats = sanitizeDailyStat(currentProgress.dailyStats?.[key]);
    const nextStats =
      typeof updater === 'function' ? updater(currentStats) : { ...currentStats, ...updater };

    return {
      dailyStats: {
        ...sanitizeDailyStats(currentProgress.dailyStats),
        [key]: sanitizeDailyStat(nextStats),
      },
    };
  });
}

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
