export const MISTAKE_CATEGORIES = {
  missing_word: {
    id: 'missing_word',
    label: 'Missing word',
  },
  extra_word: {
    id: 'extra_word',
    label: 'Extra word',
  },
  word_order: {
    id: 'word_order',
    label: 'Word order',
  },
  reduced_speech: {
    id: 'reduced_speech',
    label: 'Reduced speech',
  },
  spelling_or_typo: {
    id: 'spelling_or_typo',
    label: 'Spelling or typo',
  },
  sound_confusion: {
    id: 'sound_confusion',
    label: 'Sound confusion',
  },
  meaning_confusion: {
    id: 'meaning_confusion',
    label: 'Meaning confusion',
  },
  trap_word_confusion: {
    id: 'trap_word_confusion',
    label: 'Trap word confusion',
  },
  gamer_context: {
    id: 'gamer_context',
    label: 'Gamer context',
  },
  acronym_confusion: {
    id: 'acronym_confusion',
    label: 'Acronym confusion',
  },
  boss_pressure: {
    id: 'boss_pressure',
    label: 'Boss pressure',
  },
};

const REDUCED_SPEECH_PATTERNS = [
  /\bwanna\b/i,
  /\bgonna\b/i,
  /\blemme\b/i,
  /\bgimme\b/i,
  /\bhow\s+bout\b/i,
  /\bkinda\b/i,
  /\bsorta\b/i,
];

function uniqueCategories(categories) {
  return [...new Set(categories.filter(Boolean))];
}

export function getMistakeCategoryLabel(categoryId) {
  return MISTAKE_CATEGORIES[categoryId]?.label || categoryId;
}

export function hasReducedSpeech(value) {
  const text = String(value || '');

  return REDUCED_SPEECH_PATTERNS.some((pattern) => pattern.test(text));
}

export function classifyListenTypeMistake({
  targetWords = [],
  answerWords = [],
  rows = [],
  rawTarget = '',
  normalForm = '',
  bagMatchCount = 0,
  exactPositionCount = 0,
} = {}) {
  const categories = [];
  const targetLength = targetWords.length;
  const answerLength = answerWords.length;
  const maxLength = Math.max(targetLength, answerLength, 1);

  if (answerLength < targetLength) {
    categories.push(MISTAKE_CATEGORIES.missing_word.id);
  }

  if (answerLength > targetLength) {
    categories.push(MISTAKE_CATEGORIES.extra_word.id);
  }

  if (bagMatchCount >= Math.min(targetLength, answerLength) && exactPositionCount < bagMatchCount) {
    categories.push(MISTAKE_CATEGORIES.word_order.id);
  }

  if (rows.some((row) => row.matchType === 'typo')) {
    categories.push(MISTAKE_CATEGORIES.spelling_or_typo.id);
  }

  if (hasReducedSpeech(rawTarget) || hasReducedSpeech(normalForm)) {
    categories.push(MISTAKE_CATEGORIES.reduced_speech.id);
  }

  if (categories.length === 0 || exactPositionCount / maxLength < 0.5) {
    categories.push(MISTAKE_CATEGORIES.sound_confusion.id);
  }

  return uniqueCategories(categories);
}

export function classifyMultipleChoiceMistake({ domain = '', hasTrap = false } = {}) {
  if (domain === 'gamer') {
    return [MISTAKE_CATEGORIES.gamer_context.id];
  }

  if (hasTrap) {
    return [MISTAKE_CATEGORIES.trap_word_confusion.id];
  }

  return [MISTAKE_CATEGORIES.meaning_confusion.id];
}
