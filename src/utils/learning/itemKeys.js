export const WORD_DOMAIN = 'word';
export const PHRASE_DOMAIN = 'phrase';
export const GAMER_DOMAIN = 'gamer';
export const LISTENING_DOMAIN = 'listening';

function cleanKeyPart(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function makeLearningItemKey(domain, itemId) {
  const domainKey = cleanKeyPart(domain);
  const itemKey = cleanKeyPart(itemId);

  if (!domainKey || !itemKey) {
    return '';
  }

  return `${domainKey}:${itemKey}`;
}

export function getWordKey(item) {
  return item?.id || item?.word || '';
}

export function getWordMasteryKey(item) {
  return makeLearningItemKey(WORD_DOMAIN, getWordKey(item));
}
