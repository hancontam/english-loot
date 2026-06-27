export const WORD_DOMAIN = 'word';

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
