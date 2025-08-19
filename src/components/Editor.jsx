import React, { useReducer, useRef, useEffect, useState } from 'react';
import { restorePoem } from '../utils/restorePoem';
import pictoData from '../data/picto_data.json';
import {
  MORTAR_WORDS,
  PUNCTUATION_MARKS,
  DEFAULT_CUBE,
} from '../utils/constants';
import Button from './Button';
import {
  COLORS,
  SIZES,
  INSERTION_POINT,
  EDITOR_TEXT,
} from '../utils/styleConstants';
import transformDefaultPoem from '../utils/transformDefaultPoem';
import getPublicPath from '../utils/getPublicPath';

const appDefaultFrontPoemString = transformDefaultPoem('front')
  .map((w) => (w.text === '\n' ? '\\n' : w.text))
  .join(' ');

const MENU_OFFSET_X = -23;
const MENU_OFFSET_Y = 4;
const MENU_PADDING_X = 26;
const MENU_FONT_SIZE = 22;
const MENU_PADDING_Y = 12;
const MENU_LINE_HEIGHT = MENU_FONT_SIZE * 1.8;
const MENU_MAX_LINES = 7;
const COLUMN_GAP = 32;
const MENU_ITEM_BASELINE_SHIFT = -2;

export default function Editor({
  initialPictoSet,
  faceName,
  initialText,
  onSave,
  onSaveACopy,
  onClose,
  filterMode,
  onFilterChange,
}) {
  const [state, dispatch] = useReducer(reducer, null, () =>
    initEditorState(
      initialPictoSet,
      initialText,
      faceName,
      appDefaultFrontPoemString
    )
  );
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const wordRefs = useRef([]);
  const menuRef = useRef();

  // State to manage hover: { type: 'word' | 'insertPoint', index: number } | null
  const [hoveredItem, setHoveredItem] = useState(null);

  const {
    words,
    hasUnsavedChanges,
    menuIndex,
    menuOptions,
    menuType,
    pictoSet,
  } = state;

  useEffect(() => {
    if (words) {
    }
  }, [words]);

  const visibleRows = Math.min(menuOptions.length, MENU_MAX_LINES);

  function handleSave() {
    const text = words.map((w) => w.text).join(' ');
    dispatch({ type: 'SAVE' });
    onSave(text);
    onFilterChange('user');
  }

  function handleSaveACopy() {
    const text = words.map((w) => w.text).join(' ');
    dispatch({ type: 'SAVE' });
    onSaveACopy(text);
    onFilterChange('user');
  }

  function handleWordClick(index) {
    const word = words[index];
    const lower = word.text.toLowerCase();
    positionMenuAtWord(index);

    if (word.inserted) {
      if (word.text === '\n') {
        dispatch({
          type: 'SHOW_MENU',
          index,
          options: ['delete'],
          menuType: 'inserted',
        });
      } else if (MORTAR_WORDS.includes(lower)) {
        const alts = MORTAR_WORDS.filter((w) => w !== lower);
        dispatch({
          type: 'SHOW_MENU',
          index,
          options: [...alts, 'delete'],
          menuType: 'inserted',
        });
      } else if (PUNCTUATION_MARKS.includes(lower)) {
        const alts = PUNCTUATION_MARKS.filter((p) => p !== lower);
        dispatch({
          type: 'SHOW_MENU',
          index,
          options: [...alts, 'delete'],
          menuType: 'inserted',
        });
      } else {
        // Should not happen if MORTAR_WORDS and PUNCTUATION_MARKS cover all non-line-break inserted=true cases
        dispatch({
          type: 'SHOW_MENU',
          index,
          options: ['delete'],
          menuType: 'inserted',
        });
      }
    } else {
      // Primary word
      const altOptions = getAlternateWords(index, words, pictoSet);
      dispatch({
        type: 'SHOW_MENU',
        index,
        options: altOptions,
        menuType: 'replace',
      });
    }
  }

  function handleInsertPointClick(index) {
    const prevWord = index > 0 ? words[index - 1] : null;
    const nextWord = index < words.length ? words[index] : null;

    if (
      !nextWord &&
      prevWord?.text &&
      PUNCTUATION_MARKS.includes(prevWord.text.toLowerCase())
    ) {
      return;
    }

    let consecMortars = 0;
    for (let i = index - 1; i >= 0; i--) {
      if (MORTAR_WORDS.includes(words[i].text.toLowerCase())) consecMortars++;
      else break;
    }
    for (let i = index; i < words.length; i++) {
      if (MORTAR_WORDS.includes(words[i].text.toLowerCase())) consecMortars++;
      else break;
    }
    const allowedMortars = consecMortars < 2 ? MORTAR_WORDS : [];

    const isAdjBreak =
      (prevWord?.inserted && prevWord.text === '\n') ||
      (nextWord?.inserted && nextWord.text === '\n');
    if (isAdjBreak) {
      const targetIndex = prevWord?.text === '\n' ? index - 1 : index;
      positionMenuAtWord(targetIndex);
      dispatch({
        type: 'SHOW_MENU',
        index: targetIndex,
        options: [...allowedMortars, ...PUNCTUATION_MARKS, '\n', 'delete'],
        menuType: 'insert',
      });
      return;
    }

    positionMenuAtWord(index);

    const prev = prevWord?.text.toLowerCase();
    const next = nextWord?.text.toLowerCase();
    const prevMortar = MORTAR_WORDS.includes(prev);
    const nextMortar = MORTAR_WORDS.includes(next);
    const prevPunc = PUNCTUATION_MARKS.includes(prev);
    const nextPunc = PUNCTUATION_MARKS.includes(next);

    let options = [];
    if (index === 0) {
      options = [...allowedMortars];
    } else if (
      !prevMortar &&
      !prevPunc &&
      !prevWord?.inserted &&
      !nextWord?.inserted
    ) {
      options = [...allowedMortars, ...PUNCTUATION_MARKS, '\n'];
    } else if (nextPunc) {
      options = [...allowedMortars, '\n'];
    } else if (prevPunc) {
      options = [...allowedMortars, '\n'];
    } else if (nextMortar && prevMortar) {
      options = [...PUNCTUATION_MARKS, '\n'];
    } else if (nextMortar || prevMortar) {
      options = [...PUNCTUATION_MARKS, '\n', ...allowedMortars];
    } else if (!nextWord && !prevPunc && !prevMortar && !prevWord?.inserted) {
      options = [...PUNCTUATION_MARKS];
    } else {
      options = [...allowedMortars, ...PUNCTUATION_MARKS, '\n'];
    }

    dispatch({ type: 'SHOW_MENU', index, options, menuType: 'insert' });
  }

  function positionMenuAtWord(index) {
    const el = wordRefs.current[index];
    if (el) {
      const { bottom, left } = el.getBoundingClientRect();
      setMenuPos({
        top: bottom + MENU_OFFSET_Y + window.scrollY,
        left: left + MENU_OFFSET_X + window.scrollX,
      });
    }
  }

  function handleOptionClick(option) {
    const idx = menuIndex;
    if (menuType === 'replace') {
      dispatch({ type: 'REPLACE_WORD', index: idx, newWord: option });
    } else if (menuType === 'insert') {
      if (option === 'delete') {
        dispatch({ type: 'DELETE', index: idx });
      } else {
        dispatch({
          type: 'INSERT',
          index: idx,
          value: option === '\n' ? '\n' : option,
        });
      }
    } else if (menuType === 'inserted') {
      if (option === 'delete') {
        dispatch({ type: 'DELETE', index: idx });
      } else {
        dispatch({
          type: 'REPLACE_WORD',
          index: idx,
          newWord: option === '\n' ? '\n' : option,
        });
      }
    }
    dispatch({ type: 'HIDE_MENU' });
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        dispatch({ type: 'HIDE_MENU' });
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const getWordStyle = (word, index) => {
    const isHovered =
      hoveredItem?.type === 'word' && hoveredItem?.index === index;
    let styleConfig;

    if (word.inserted) {
      if (PUNCTUATION_MARKS.includes(word.text.toLowerCase())) {
        styleConfig = EDITOR_TEXT.punctuation;
      } else {
        // Assume other inserted are mortar words (line breaks are handled differently)
        styleConfig = EDITOR_TEXT.mortarWord;
      }
    } else {
      styleConfig = EDITOR_TEXT.primaryWord;
    }

    return {
      ...(word.inserted ? styles.insertedBase : styles.wordBase), // Use new base styles
      color: isHovered ? styleConfig.hover.color : styleConfig.color,
      backgroundColor: isHovered
        ? styleConfig.hover.background
        : styleConfig.background,
      // Add any other shared properties like padding, border-radius if defined in constants
    };
  };

  const getInsertPointStyle = (index) => {
    const isHovered =
      hoveredItem?.type === 'insertPoint' && hoveredItem?.index === index;
    return {
      ...styles.insertPointBase, // Use new base style
      color: isHovered ? INSERTION_POINT.hover.color : INSERTION_POINT.color,
      backgroundColor: isHovered
        ? INSERTION_POINT.hover.background
        : INSERTION_POINT.background,
      fontSize: INSERTION_POINT.fontSize,
      transform: `translateY(${INSERTION_POINT.translateY}px) scaleX(${
        INSERTION_POINT.hScale || 1
      })`,
    };
  };

  return (
    <div style={styles.wrapper}>
      <NavBar
        onClose={onClose}
        onSave={handleSave}
        onSaveACopy={handleSaveACopy}
        canSave={hasUnsavedChanges}
        currentPoemId={initialText?.id}
      />
      <div style={styles.container}>
        <div style={styles.pictos}>
          {pictoSet &&
            pictoSet.map((p, i) => (
              <div key={i} style={styles.picto}>
                <img
                  src={getPublicPath(`pictos/${p.name}.png`)}
                  alt={p.name}
                  style={{
                    width: SIZES.editorPictoSize,
                    height: SIZES.editorPictoSize,
                    transform: `rotate(${
                      p.orientation === 'right'
                        ? 90
                        : p.orientation === 'down'
                        ? 180
                        : p.orientation === 'left'
                        ? 270
                        : 0
                    }deg)`,
                  }}
                />
              </div>
            ))}
        </div>

        <div style={styles.poem}>
          <span
            style={getInsertPointStyle(-1)} // Unique index for the first insert point
            onClick={() => handleInsertPointClick(0)}
            onMouseEnter={() =>
              setHoveredItem({ type: 'insertPoint', index: -1 })
            }
            onMouseLeave={() => setHoveredItem(null)}
          >
            {INSERTION_POINT.string}
          </span>
          {words &&
            words.map((word, i) => (
              <span key={i}>
                {word.text === '\n' ? (
                  <br />
                ) : (
                  <span
                    ref={(el) => (wordRefs.current[i] = el)}
                    style={getWordStyle(word, i)}
                    onClick={() => handleWordClick(i)}
                    onMouseEnter={() =>
                      setHoveredItem({ type: 'word', index: i })
                    }
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {word.text}
                  </span>
                )}
                <span
                  style={getInsertPointStyle(i)} // Index matches following word
                  onClick={() => handleInsertPointClick(i + 1)}
                  onMouseEnter={() =>
                    setHoveredItem({ type: 'insertPoint', index: i })
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {INSERTION_POINT.string}
                </span>
              </span>
            ))}
        </div>

        {menuOptions && menuOptions.length > 0 && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              top: menuPos.top,
              left: menuPos.left,
              background: COLORS.secondaryLight,
              color: COLORS.backgroundLight,
              borderRadius: 8,
              paddingTop: `${MENU_PADDING_Y}px`,
              paddingBottom: `${MENU_PADDING_Y}px`,
              paddingLeft: `${MENU_PADDING_X}px`,
              paddingRight: `${MENU_PADDING_X}px`,
              fontSize: `${MENU_FONT_SIZE}px`,
              lineHeight: `${MENU_LINE_HEIGHT}px`,
              display: 'grid',
              gridAutoFlow: 'column',
              gridTemplateRows: `repeat(${visibleRows}, ${MENU_LINE_HEIGHT}px)`,
              gridAutoColumns: 'max-content',
              columnGap: COLUMN_GAP,
              boxSizing: 'border-box',
              overflowY: visibleRows === MENU_MAX_LINES ? 'auto' : 'hidden',
            }}
          >
            {menuOptions.map((opt, i) => (
              <div
                key={i}
                style={styles.menuItem}
                onClick={() => handleOptionClick(opt)}
              >
                {opt === '\n' ? '[line break]' : opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Simplified base styles, as color/background are now dynamic
const styles = {
  wrapper: {
    width: '100vw',
    height: '100vh',
    background: COLORS.backgroundLight,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    gap: 40,
  },
  pictos: {
    display: 'flex',
    gap: 6,
    background: COLORS.secondaryLight,
    padding: 10,
    borderRadius: 24,
  },
  picto: {
    background: COLORS.backgroundLight,
    height: SIZES.editorPictoSize,
    width: SIZES.editorPictoSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  poem: {
    font: 'inherit', // Should inherit from App.jsx's primary font style
    lineHeight: '32px', // Or from a constant
    maxWidth: 700, // Or from a constant
  },
  wordBase: {
    // Base style for primary (non-inserted) words
    marginRight: 8, // Or from a constant
    cursor: 'pointer',
    padding: '2px 4px', // Added some padding for better background visibility
    borderRadius: '3px', // Added border radius
  },
  insertedBase: {
    // Base style for inserted words (mortars/punctuation)
    marginRight: 8, // Or from a constant
    cursor: 'pointer',
    padding: '2px 4px', // Added some padding
    borderRadius: '3px', // Added border radius
  },
  insertPointBase: {
    // Base style for insertion points
    marginRight: 8, // Or from a constant
    cursor: 'pointer',
    display: 'inline-block', // Important for transform
    padding: '0 2px', // Added some padding
    borderRadius: '3px', // Added border radius
    userSelect: 'none', // Prevent text selection of the symbol
  },
  menuItem: {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transform: `translateY(${MENU_ITEM_BASELINE_SHIFT}px)`,
  },
  navBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'REPLACE_WORD':
      return {
        ...state,
        words: state.words.map((w, i) =>
          i === action.index ? { ...w, text: action.newWord } : w
        ),
        hasUnsavedChanges: true,
      };
    case 'INSERT':
      return {
        ...state,
        words: [
          ...state.words.slice(0, action.index),
          { text: action.value, inserted: true },
          ...state.words.slice(action.index),
        ],
        hasUnsavedChanges: true,
      };
    case 'DELETE': {
      const newWords = [...state.words];
      newWords.splice(action.index, 1);
      return {
        ...state,
        words: newWords,
        hasUnsavedChanges: true,
      };
    }
    case 'SAVE':
      return { ...state, hasUnsavedChanges: false };
    case 'SHOW_MENU':
      return {
        ...state,
        menuIndex: action.index,
        menuOptions: action.options,
        menuType: action.menuType,
      };
    case 'HIDE_MENU':
      return {
        ...state,
        menuIndex: null,
        menuOptions: [],
        menuType: null,
      };
    default:
      return state;
  }
}

function initEditorState(
  initialPictoSet,
  initialTextObj,
  faceName,
  appDefaultFrontPoemStr
) {
  const rawText = initialTextObj.text;
  const incomingId = initialTextObj.id;

  if (incomingId === null && rawText === '' && faceName) {
    return {
      words: transformDefaultPoem(faceName),
      pictoSet: initialPictoSet,
      hasUnsavedChanges: true,
      menuIndex: null,
      menuOptions: [],
      menuType: null,
    };
  } else if (
    incomingId === null &&
    faceName === 'front' &&
    initialPictoSet &&
    DEFAULT_CUBE.pictograms &&
    JSON.stringify(initialPictoSet) ===
      JSON.stringify(DEFAULT_CUBE.pictograms) &&
    rawText === appDefaultFrontPoemStr
  ) {
    return {
      words: transformDefaultPoem('front'),
      pictoSet: initialPictoSet,
      hasUnsavedChanges: true,
      menuIndex: null,
      menuOptions: [],
      menuType: null,
    };
  }

  const words = restorePoem(initialPictoSet || [], rawText || '');

  return {
    words,
    pictoSet: initialPictoSet,
    hasUnsavedChanges: incomingId == null,
    menuIndex: null,
    menuOptions: [],
    menuType: null,
  };
}

function getAlternateWords(index, words, pictoSet) {
  const currentWord = words && words[index]?.text;
  if (!currentWord) return [];

  let pictogramIndex = 0;
  if (words) {
    for (let i = 0; i < index; i++) {
      if (words[i] && !words[i].inserted) pictogramIndex++;
    }
  }

  const picto = pictoSet && pictoSet[pictogramIndex];
  if (!picto) {
    return [];
  }

  const { name, orientation } = picto;
  const entry = pictoData.find((p) => p.name === name);
  const meanings = entry?.orientations?.[orientation]?.meanings || [];
  return meanings
    .flatMap((m) => [m.primary, ...m.secondary])
    .filter((w) => w !== currentWord);
}

function NavBar({ onClose, onSave, onSaveACopy, canSave, currentPoemId }) {
  const isExistingPoem = !!currentPoemId;
  const showSaveACopy = canSave && isExistingPoem;
  return (
    <div style={styles.navBar}>
      <Button label='Close' onClick={onClose} />
      <div style={{ flex: 1 }} />
      <Button label='Save' onClick={onSave} disabled={!canSave} />
      {showSaveACopy && <Button label='Save a copy' onClick={onSaveACopy} />}
    </div>
  );
}
