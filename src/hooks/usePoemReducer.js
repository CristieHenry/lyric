import { useReducer } from 'react';
import { shuffleArray, generatePictoString } from '../utils/Utils';
import { SOLVED_POEM_TEXT } from '../utils/constants';

export const initialPoemState = {
  pictoSet: [],
  pictoString: '',
  currentText: '',
  poemId: null,
};

export function poemReducer(state, action) {
  switch (action.type) {
    case 'SCRAMBLE': {
      const { pictoData, count = 8 } = action.payload;

      const scrambled = shuffleArray([...pictoData]);
      const result = [];

      for (let i = 0; i < scrambled.length && result.length < count; i++) {
        const picto = scrambled[i];
        const orientations = Object.keys(picto.orientations);
        const shuffledOrientations = shuffleArray(orientations);

        for (let orientation of shuffledOrientations) {
          const meanings = picto.orientations[orientation].meanings;
          if (meanings.length > 0 && meanings[0].primary) {
            result.push({ name: picto.name, orientation });
            break;
          }
        }
      }

      const newPictoString = generatePictoString(result, pictoData);

      return {
        pictoSet: result,
        pictoString: newPictoString,
        currentText: newPictoString,
        poemId: null,
      };
    }

    case 'SOLVE': {
      const { pictoData, defaultPictoSet } = action.payload;
      const solvedString = SOLVED_POEM_TEXT;

      return {
        pictoSet: defaultPictoSet,
        pictoString: generatePictoString(defaultPictoSet, pictoData),
        currentText: solvedString,
        poemId: 'solved',
      };
    }

    case 'EDIT_TEXT': {
      return {
        ...state,
        currentText: action.payload,
      };
    }

    case 'RESET_TEXT_FROM_PICTOS': {
      const { pictoData } = action.payload;
      const newPictoString = generatePictoString(state.pictoSet, pictoData);
      return {
        ...state,
        currentText: newPictoString,
        poemId: null,
      };
    }

    case 'LOAD_FROM_LIBRARY': {
      const { pictos, text, id, pictoData } = action.payload;
      return {
        pictoSet: pictos,
        pictoString: generatePictoString(pictos, pictoData),
        currentText: text,
        poemId: id,
      };
    }

    default:
      return state;
  }
}

export function usePoemReducer() {
  return useReducer(poemReducer, initialPoemState);
}
