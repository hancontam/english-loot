import { getWordKey } from './itemKeys.js';
import { clampMastery, getWordMasteryRecord, getWordStatus, isReviewDue } from './mastery.js';

export function safeWordList(list) {
  return Array.isArray(list) ? list : [];
}

export function getWordWeight(item, progress, now = new Date()) {
  const status = getWordStatus(item, progress);
  const masteryRecord = getWordMasteryRecord(item, progress);
  const mastery = clampMastery(masteryRecord.mastery);
  const isDue = isReviewDue(masteryRecord, now);
  const isNew = Number(masteryRecord.exposureCount) === 0;
  let weight = 1;

  if (isDue) {
    weight += 4;
  }

  if (status === 'hard') {
    weight += 5;
  }

  if (mastery < 30) {
    weight += 4;
  } else if (mastery < 50) {
    weight += 2;
  } else if (mastery < 70) {
    weight += 0.75;
  }

  if (isNew) {
    weight += 1.1;
  }

  if (status === 'known' && !isDue) {
    weight *= 0.2;
  }

  return Math.max(0.15, weight);
}

export function pickWeightedWord(list, progress, previousWordKey = '') {
  const allWords = safeWordList(list);
  const candidates =
    allWords.length > 1 ? allWords.filter((item) => getWordKey(item) !== previousWordKey) : allWords;
  const now = new Date();
  const weightedWords = candidates.map((item) => ({
    item,
    weight: getWordWeight(item, progress, now),
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
