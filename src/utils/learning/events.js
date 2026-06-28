import { LISTENING_DOMAIN, WORD_DOMAIN, getWordKey } from './itemKeys.js';

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

export function makeListenTypeLearningEventPayload(item, userAnswer, scoringResult) {
  return {
    page: 'listen-type',
    domain: LISTENING_DOMAIN,
    itemId: item?.id || '',
    eventType: 'listen_type_checked',
    result: scoringResult?.isCorrect ? 'correct' : scoringResult?.score >= 0.5 ? 'partial' : 'wrong',
    score: Number(scoringResult?.score || 0),
    userAnswer,
    targetAnswer: item?.sentence || '',
    mistakeCategories: Array.isArray(scoringResult?.mistakeCategories) ? scoringResult.mistakeCategories : [],
  };
}
