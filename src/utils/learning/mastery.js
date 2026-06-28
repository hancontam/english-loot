import { getWordMasteryKey } from './itemKeys.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export function makeSavedSet(list) {
  return new Set(
    (Array.isArray(list) ? list : [])
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function wordMatchesSet(item, savedSet) {
  const keys = [item?.id, item?.word]
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return keys.some((key) => savedSet.has(key));
}

export function clampMastery(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS).toISOString();
}

export function getWordStatus(item, progress) {
  if (wordMatchesSet(item, makeSavedSet(progress.hardWords))) {
    return 'hard';
  }

  if (wordMatchesSet(item, makeSavedSet(progress.knownWords))) {
    return 'known';
  }

  return 'new';
}

export function makeFallbackWordMasteryRecord(item, progress) {
  const status = getWordStatus(item, progress);

  if (status === 'known') {
    return {
      mastery: 70,
      exposureCount: 1,
      nextReviewAt: '',
    };
  }

  if (status === 'hard') {
    return {
      mastery: 25,
      exposureCount: 1,
      nextReviewAt: new Date(0).toISOString(),
    };
  }

  return {
    mastery: 20,
    exposureCount: 0,
    nextReviewAt: '',
  };
}

export function getWordMasteryRecord(item, progress) {
  const key = getWordMasteryKey(item);
  const savedRecord = key ? progress?.itemMastery?.[key] : null;

  if (savedRecord) {
    return savedRecord;
  }

  return makeFallbackWordMasteryRecord(item, progress);
}

export function isReviewDue(record, now = new Date()) {
  if (!record?.nextReviewAt) {
    return false;
  }

  const reviewDate = new Date(record.nextReviewAt);

  if (Number.isNaN(reviewDate.getTime())) {
    return false;
  }

  return reviewDate.getTime() <= now.getTime();
}

export function getKnownReviewDelay(mastery) {
  if (mastery >= 80) {
    return 14;
  }

  if (mastery >= 60) {
    return 7;
  }

  if (mastery >= 40) {
    return 3;
  }

  return 1;
}

export function buildScoredMasteryRecord(
  currentRecord,
  scoringResult,
  {
    correctIncrease = 10,
    partialDecrease = 2,
    wrongDecrease = 12,
    partialThreshold = 0.5,
  } = {},
  now = new Date(),
) {
  const score = Number(scoringResult?.score || 0);
  const isCorrect = Boolean(scoringResult?.isCorrect);
  const beforeRecord = currentRecord || {};

  if (isCorrect) {
    const nextMastery = clampMastery(Number(beforeRecord.mastery || 20) + correctIncrease);
    const intervalDays = getKnownReviewDelay(nextMastery);

    return {
      ...beforeRecord,
      mastery: nextMastery,
      exposureCount: Number(beforeRecord.exposureCount || 0) + 1,
      correctCount: Number(beforeRecord.correctCount || 0) + 1,
      currentCorrectStreak: Number(beforeRecord.currentCorrectStreak || 0) + 1,
      lastSeenAt: now.toISOString(),
      nextReviewAt: addDays(now, intervalDays),
      intervalDays,
      lastResult: 'correct',
      mistakeCategories: [],
    };
  }

  const isPartial = score >= partialThreshold;
  const nextMastery = clampMastery(
    Number(beforeRecord.mastery || 20) - (isPartial ? partialDecrease : wrongDecrease),
  );

  return {
    ...beforeRecord,
    mastery: nextMastery,
    exposureCount: Number(beforeRecord.exposureCount || 0) + 1,
    wrongCount: Number(beforeRecord.wrongCount || 0) + 1,
    currentCorrectStreak: 0,
    lastSeenAt: now.toISOString(),
    nextReviewAt: isPartial ? addDays(now, 1) : now.toISOString(),
    intervalDays: isPartial ? 1 : 0,
    lastResult: isPartial ? 'partial' : 'wrong',
    mistakeCategories: Array.isArray(scoringResult?.mistakeCategories) ? scoringResult.mistakeCategories : [],
  };
}

export function buildWordMasteryRecord(item, signal, progressSnapshot, now = new Date()) {
  const beforeRecord = getWordMasteryRecord(item, progressSnapshot);

  if (signal === 'known') {
    const nextMastery = clampMastery(Math.max(beforeRecord.mastery + 8, 70));
    const intervalDays = getKnownReviewDelay(nextMastery);

    return {
      ...beforeRecord,
      mastery: nextMastery,
      exposureCount: Number(beforeRecord.exposureCount || 0) + 1,
      correctCount: Number(beforeRecord.correctCount || 0) + 1,
      currentCorrectStreak: Number(beforeRecord.currentCorrectStreak || 0) + 1,
      lastSeenAt: now.toISOString(),
      nextReviewAt: addDays(now, intervalDays),
      intervalDays,
      lastResult: 'known',
    };
  }

  const nextMastery = clampMastery(Math.min(beforeRecord.mastery - 8, 25));

  return {
    ...beforeRecord,
    mastery: nextMastery,
    exposureCount: Number(beforeRecord.exposureCount || 0) + 1,
    wrongCount: Number(beforeRecord.wrongCount || 0) + 1,
    currentCorrectStreak: 0,
    lastSeenAt: now.toISOString(),
    nextReviewAt: now.toISOString(),
    intervalDays: 0,
    lastResult: 'hard',
    mistakeCategories: ['self_marked_hard'],
  };
}
