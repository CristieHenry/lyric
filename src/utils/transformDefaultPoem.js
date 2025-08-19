// src/utils/transformDefaultPoem.js

import pictoData from '../data/picto_data.json';
import solvedCubeData from '../data/solved_cube_data.json';

/**
 * If passed a face name (string), returns the canonical poem for that face.
 * If passed an array of { name, orientation } pairs, returns a list of
 * primary‐meaning words for each pictogram in the order given.
 *
 * @param {string | {name: string, orientation: string}[]} faceOrSequence
 * @returns {{ text: string, inserted: boolean }[]}
 */
export default function transformDefaultPoem(faceOrSequence) {
  // CASE 1: faceName string → canonical hard‑coded poem
  if (typeof faceOrSequence === 'string') {
    switch (faceOrSequence) {
      case 'front':
        return [
          { text: 'who', inserted: false },
          { text: 'walks', inserted: false },
          { text: '\n', inserted: true },
          { text: 'the', inserted: true },
          { text: 'changing', inserted: false },
          { text: 'path', inserted: false },
          { text: 'of', inserted: true },
          { text: '\n', inserted: true },
          { text: 'life', inserted: false },
          { text: 'alone', inserted: false },
          { text: '?', inserted: true },
          { text: '\n', inserted: true },
          { text: 'everyone', inserted: false },
          { text: '…', inserted: true },
          { text: 'no\u00A0one', inserted: false },
          { text: '.', inserted: true },
        ];
      case 'back':
        return [
          { text: 'when', inserted: false },
          { text: 'we', inserted: false },
          { text: 'see', inserted: false },
          { text: '\n', inserted: true },
          { text: 'each\u00A0other', inserted: false },
          { text: 'clearly', inserted: false },
          { text: ',', inserted: true },
          { text: '\n', inserted: true },
          { text: 'our', inserted: false },
          { text: 'hearts', inserted: false },
          { text: 'break', inserted: false },
          { text: '.', inserted: true },
        ];
      case 'left':
        return [
          { text: 'how', inserted: false },
          { text: 'everything', inserted: false },
          { text: 'ends', inserted: false },
          { text: '\n', inserted: true },
          { text: 'we', inserted: false },
          { text: 'know', inserted: false },
          { text: ',', inserted: true },
          { text: '\n', inserted: true },
          { text: 'still', inserted: false },
          { text: 'we', inserted: false },
          { text: 'begin', inserted: false },
          { text: '.', inserted: true },
        ];

      case 'right':
        return [
          { text: 'what', inserted: false },
          { text: 'could\u00A0be', inserted: false },
          { text: 'better', inserted: false },
          { text: '\n', inserted: true },
          { text: 'than', inserted: true },
          { text: 'to', inserted: true },
          { text: 'sit', inserted: false },
          { text: 'in', inserted: true },
          { text: 'the', inserted: true },
          { text: 'sun', inserted: false },
          { text: '\n', inserted: true },
          { text: 'and', inserted: true },
          { text: 'feel', inserted: false },
          { text: 'the', inserted: true },
          { text: 'soft', inserted: false },
          { text: 'wind', inserted: false },
          { text: '?', inserted: true },
        ];
      case 'top':
        return [
          { text: 'why', inserted: false },
          { text: 'am', inserted: true },
          { text: 'I', inserted: false },
          { text: 'afraid', inserted: false },
          { text: '\n', inserted: true },
          { text: 'to', inserted: true },
          { text: 'live', inserted: false },
          { text: '?', inserted: true },
          { text: 'because', inserted: false },
          { text: '\n', inserted: true },
          { text: 'I', inserted: false },
          { text: 'am', inserted: true },
          { text: 'afraid', inserted: false },
          { text: 'to', inserted: true },
          { text: 'die', inserted: false },
          { text: '.', inserted: true },
        ];
      case 'bottom':
        return [
          { text: 'where', inserted: false },
          { text: 'they', inserted: false },
          { text: 'stood', inserted: false },
          { text: ',', inserted: true },
          { text: '\n', inserted: true },
          { text: 'kissing', inserted: false },
          { text: 'or', inserted: true },
          { text: 'arguing', inserted: false },
          { text: '\n', inserted: true },
          { text: 'on', inserted: true },
          { text: 'the', inserted: true },
          { text: 'shore', inserted: false },
          { text: ',', inserted: true },
          { text: '\n', inserted: true },
          { text: 'sea', inserted: false },
          { text: 'puddles', inserted: false },
          { text: '.', inserted: true },
        ];
      default:
        return [];
    }
  }

  // CASE 2: array of pictograms → dynamic mapping to primary meanings
  if (Array.isArray(faceOrSequence)) {
    return faceOrSequence.map((item) => {
      // find the picto entry
      const entry = pictoData.find((p) => p.name === item.name);
      // get the meanings array for this orientation
      const meanings = entry?.orientations?.[item.orientation]?.meanings || [];
      // pick the first (primary) meaning, or fallback to the picto name
      const primary = meanings[0]?.primary ?? item.name;
      return { text: primary, inserted: false };
    });
  }

  // Fallback: empty
  return [];
}
