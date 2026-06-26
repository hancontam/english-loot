export const DAILY_LOOT_TARGETS = {
  words: 10,
  phrases: 5,
  gamerTerms: 5,
  listeningItems: 1,
};

function safeList(value) {
  return Array.isArray(value) ? value : [];
}

function getPositiveInteger(value, fallback) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(0, Math.floor(number));
}

export function getDateKey(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return getDateKey();
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seedText) {
  let seed = hashString(seedText) || 1;

  return function seededRandom() {
    seed += 0x6d2b79f5;

    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSavedSet(value) {
  return new Set(
    safeList(value)
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function getItemKeys(item) {
  if (!item || typeof item !== 'object') {
    return [];
  }

  return [item.id, item.word, item.phrase, item.term, item.sentence, item.normalForm]
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function itemMatchesSavedSet(item, savedSet) {
  return getItemKeys(item).some((key) => savedSet.has(key));
}

function getItemWeight(item, knownSet, hardSet) {
  if (itemMatchesSavedSet(item, hardSet)) {
    return 2.5;
  }

  if (itemMatchesSavedSet(item, knownSet)) {
    return 0.35;
  }

  return 1;
}

function selectWeightedItems(items, targetCount, seedText, progress) {
  const safeItems = safeList(items);
  const count = Math.min(getPositiveInteger(targetCount, 0), safeItems.length);

  if (count === 0) {
    return [];
  }

  const random = createSeededRandom(seedText);
  const knownSet = makeSavedSet(progress?.knownWords);
  const hardSet = makeSavedSet(progress?.hardWords);

  return safeItems
    .map((item, index) => {
      const weight = getItemWeight(item, knownSet, hardSet);
      const randomValue = Math.max(random(), Number.EPSILON);

      return {
        item,
        index,
        score: randomValue ** (1 / weight),
      };
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, count)
    .map(({ item }) => item);
}

function makeCount(selectedItems, target) {
  return {
    selected: selectedItems.length,
    target,
  };
}

export function generateDailyLoot({
  words = [],
  phrases = [],
  gamerTerms = [],
  listeningItems = [],
  progress = {},
  date = new Date(),
  targets = DAILY_LOOT_TARGETS,
} = {}) {
  const dateKey = getDateKey(date);
  const safeTargets = targets && typeof targets === 'object' ? targets : DAILY_LOOT_TARGETS;
  const resolvedTargets = {
    words: getPositiveInteger(safeTargets.words, DAILY_LOOT_TARGETS.words),
    phrases: getPositiveInteger(safeTargets.phrases, DAILY_LOOT_TARGETS.phrases),
    gamerTerms: getPositiveInteger(safeTargets.gamerTerms, DAILY_LOOT_TARGETS.gamerTerms),
    listeningItems: getPositiveInteger(safeTargets.listeningItems, DAILY_LOOT_TARGETS.listeningItems),
  };

  const selectedWords = selectWeightedItems(words, resolvedTargets.words, `${dateKey}:words`, progress);
  const selectedPhrases = selectWeightedItems(phrases, resolvedTargets.phrases, `${dateKey}:phrases`, progress);
  const selectedGamerTerms = selectWeightedItems(
    gamerTerms,
    resolvedTargets.gamerTerms,
    `${dateKey}:gamerTerms`,
    progress,
  );
  const selectedListeningItems = selectWeightedItems(
    listeningItems,
    resolvedTargets.listeningItems,
    `${dateKey}:listeningItems`,
    progress,
  );

  return {
    dateKey,
    targets: resolvedTargets,
    words: selectedWords,
    phrases: selectedPhrases,
    gamerTerms: selectedGamerTerms,
    listeningItems: selectedListeningItems,
    counts: {
      words: makeCount(selectedWords, resolvedTargets.words),
      phrases: makeCount(selectedPhrases, resolvedTargets.phrases),
      gamerTerms: makeCount(selectedGamerTerms, resolvedTargets.gamerTerms),
      listeningItems: makeCount(selectedListeningItems, resolvedTargets.listeningItems),
    },
    totalSelected:
      selectedWords.length + selectedPhrases.length + selectedGamerTerms.length + selectedListeningItems.length,
    totalTarget:
      resolvedTargets.words + resolvedTargets.phrases + resolvedTargets.gamerTerms + resolvedTargets.listeningItems,
  };
}
