import { classifyListenTypeMistake, classifyMultipleChoiceMistake } from './mistakeTaxonomy.js';

const ACCEPTANCE_THRESHOLD = 0.9;

const CONTRACTION_REPLACEMENTS = [
  [/\b(i)'?m\b/g, 'i am'],
  [/\b(you|we|they)'?re\b/g, '$1 are'],
  [/\b(he|she|it|that|there)'?s\b/g, '$1 is'],
  [/\b(i|you|we|they|he|she|it)'?ll\b/g, '$1 will'],
  [/\b(i|you|we|they|he|she|it)'?ve\b/g, '$1 have'],
  [/\b(i|you|we|they|he|she|it)'?d\b/g, '$1 would'],
  [/\bcan'?t\b/g, 'cannot'],
  [/\bcant\b/g, 'cannot'],
  [/\bwon'?t\b/g, 'will not'],
  [/\bshan'?t\b/g, 'shall not'],
  [/\b(\w+)n'?t\b/g, '$1 not'],
  [/\blemme\b/g, 'let me'],
  [/\bgimme\b/g, 'give me'],
  [/\bwanna\b/g, 'want to'],
  [/\bgonna\b/g, 'going to'],
  [/\bhow\s+bout\b/g, 'how about'],
];

function getEditDistance(left, right) {
  if (left === right) {
    return 0;
  }

  if (!left) {
    return right.length;
  }

  if (!right) {
    return left.length;
  }

  const previousRow = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previousDiagonal = previousRow[0];
    previousRow[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const temp = previousRow[rightIndex];
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      previousRow[rightIndex] = Math.min(
        previousRow[rightIndex] + 1,
        previousRow[rightIndex - 1] + 1,
        previousDiagonal + substitutionCost,
      );
      previousDiagonal = temp;
    }
  }

  return previousRow[right.length];
}

function isLikelyTypo(target, typed) {
  if (!target || !typed || target === typed) {
    return false;
  }

  if (Math.min(target.length, typed.length) < 4) {
    return false;
  }

  return getEditDistance(target, typed) <= 1;
}

function countBagMatches(targetWords, answerWords) {
  const counts = new Map();

  targetWords.forEach((word) => {
    counts.set(word, (counts.get(word) || 0) + 1);
  });

  return answerWords.reduce((total, word) => {
    const remaining = counts.get(word) || 0;

    if (remaining <= 0) {
      return total;
    }

    counts.set(word, remaining - 1);
    return total + 1;
  }, 0);
}

function buildRows(targetWords, answerWords) {
  const maxLength = Math.max(targetWords.length, answerWords.length);

  return Array.from({ length: maxLength }, (_, index) => {
    const target = targetWords[index] || '';
    const typed = answerWords[index] || '';
    const isCorrect = Boolean(target && typed && target === typed);
    const isTypo = !isCorrect && isLikelyTypo(target, typed);

    return {
      key: `${index}-${target}-${typed}`,
      target,
      typed,
      status: isCorrect ? 'correct' : 'wrong',
      matchType: isCorrect ? 'exact' : isTypo ? 'typo' : 'miss',
    };
  });
}

function scoreCandidate({ userAnswer, targetAnswer, rawTarget = '', normalForm = '' }) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedTargetAnswer = normalizeAnswer(targetAnswer);
  const targetWords = normalizedTargetAnswer.split(' ').filter(Boolean);
  const answerWords = normalizedUserAnswer.split(' ').filter(Boolean);
  const rows = buildRows(targetWords, answerWords);
  const maxLength = Math.max(targetWords.length, answerWords.length, 1);
  const exactPositionCount = rows.filter((row) => row.matchType === 'exact').length;
  const typoPositionCount = rows.filter((row) => row.matchType === 'typo').length;
  const bagMatchCount = countBagMatches(targetWords, answerWords);
  const softPositionScore = (exactPositionCount + typoPositionCount * 0.75) / maxLength;
  const bagScore = bagMatchCount / maxLength;
  const sameWordsWrongOrder =
    targetWords.length === answerWords.length && targetWords.length > 0 && bagMatchCount === targetWords.length;
  const score =
    normalizedUserAnswer && normalizedUserAnswer === normalizedTargetAnswer
      ? 1
      : Math.max(softPositionScore, sameWordsWrongOrder ? bagScore * 0.85 : bagScore * 0.75);

  return {
    score: Number(score.toFixed(2)),
    wordAccuracy: Number(bagScore.toFixed(2)),
    normalizedUserAnswer,
    normalizedTargetAnswer,
    targetWords,
    answerWords,
    rows,
    exactPositionCount,
    bagMatchCount,
    mistakeCategories: classifyListenTypeMistake({
      targetWords,
      answerWords,
      rows,
      rawTarget,
      normalForm,
      bagMatchCount,
      exactPositionCount,
    }),
  };
}

export function normalizeAnswer(value) {
  let text = String(value || '')
    .toLowerCase()
    .replace(/[\u2018\u2019`]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .trim();

  CONTRACTION_REPLACEMENTS.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });

  return text
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function scoreMultipleChoiceAnswer({ userAnswer, targetAnswer, domain = '', hasTrap = false } = {}) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedTargetAnswer = normalizeAnswer(targetAnswer);
  const isCorrect = normalizedUserAnswer === normalizedTargetAnswer;

  return {
    isCorrect,
    score: isCorrect ? 1 : 0,
    wordAccuracy: isCorrect ? 1 : 0,
    normalizedUserAnswer,
    normalizedTargetAnswer,
    mistakeCategories: isCorrect ? [] : classifyMultipleChoiceMistake({ domain, hasTrap }),
    details: {
      strategy: 'multiple-choice',
    },
  };
}

export function scoreListenTypeAnswer({
  userAnswer = '',
  targetAnswer = '',
  normalForm = '',
  acceptanceThreshold = ACCEPTANCE_THRESHOLD,
} = {}) {
  const candidates = [
    {
      label: 'targetAnswer',
      value: targetAnswer,
    },
    normalForm && normalForm !== targetAnswer
      ? {
          label: 'normalForm',
          value: normalForm,
        }
      : null,
  ].filter((candidate) => candidate?.value);
  const scoredCandidates = candidates.map((candidate) => ({
    ...scoreCandidate({
      userAnswer,
      targetAnswer: candidate.value,
      rawTarget: targetAnswer,
      normalForm,
    }),
    matchedAgainst: candidate.label,
  }));
  const best = scoredCandidates.sort(
    (left, right) => right.score - left.score || right.wordAccuracy - left.wordAccuracy,
  )[0] || scoreCandidate({ userAnswer, targetAnswer: '' });
  const isCorrect = best.score >= acceptanceThreshold;

  return {
    isCorrect,
    score: best.score,
    wordAccuracy: best.wordAccuracy,
    normalizedUserAnswer: best.normalizedUserAnswer,
    normalizedTargetAnswer: best.normalizedTargetAnswer,
    mistakeCategories: isCorrect ? [] : best.mistakeCategories,
    rows: best.rows,
    details: {
      strategy: 'listen-type',
      acceptanceThreshold,
      matchedAgainst: best.matchedAgainst || 'targetAnswer',
      targetWords: best.targetWords,
      answerWords: best.answerWords,
      exactPositionCount: best.exactPositionCount,
      bagMatchCount: best.bagMatchCount,
    },
  };
}

export function scoreSelfMarkAnswer(signal) {
  const normalizedSignal = String(signal || '').trim().toLowerCase();

  return {
    isCorrect: normalizedSignal === 'known',
    score: normalizedSignal === 'known' ? 1 : 0,
    result: normalizedSignal === 'known' ? 'known' : 'hard',
    mistakeCategories: normalizedSignal === 'hard' ? ['self_marked_hard'] : [],
    details: {
      strategy: 'self-mark',
    },
  };
}
