import { WORD_DOMAIN, getWordKey } from './itemKeys.js';

export function makeWordLearningEventPayload(item, signal) {
  return {
    page: 'word-loot',
    domain: WORD_DOMAIN,
    itemId: getWordKey(item),
    eventType: signal === 'known' ? 'self_mark_known' : 'self_mark_hard',
    result: signal,
    score: signal === 'known' ? 1 : 0,
    targetAnswer: item?.word || '',
    mistakeCategories: signal === 'hard' ? ['self_marked_hard'] : [],
  };
}
