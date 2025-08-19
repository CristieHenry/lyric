import pictoData from '../data/picto_data.json';
import { MORTAR_WORDS, PUNCTUATION_MARKS } from './constants';

export function restorePoem(pictoSet, text) {
  // Already formatted? Return as-is
  if (Array.isArray(text) && text.every((w) => typeof w.text === 'string')) {
    return text;
  }

  if (!text || !pictoSet) return [];

  const words = text.split(/\s+/);
  const result = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const normalized = word.trim().toLowerCase();

    const isLineBreak = word === '\n' || word === '\\n';
    const isPunc = PUNCTUATION_MARKS.includes(normalized);
    const isMortar = MORTAR_WORDS.includes(normalized);
    const isPrimary = isPrimaryForIndex(word, i, pictoSet);

    const inserted = isLineBreak || isPunc || isMortar || !isPrimary;

    result.push({
      text: isLineBreak ? '\n' : word,
      inserted,
    });
  }

  return result;
}

function isPrimaryForIndex(word, index, pictoSet) {
  const entry = pictoData.find((p) => p.name === pictoSet[index]?.name);
  const orientation = pictoSet[index]?.orientation;
  const meanings = entry?.orientations?.[orientation]?.meanings || [];
  return meanings.some((m) => m.primary === word);
}
