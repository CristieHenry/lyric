// src/utils/styleConstants.js
const tan = '#fdf0d9';
const darkBrown = '#363323';
const darkOlive = '#59533f';
const mediumOlive = '#746b54';
const burgundy = 'rgb(176, 57, 67)';

export const ARROW_DEFAULT_COLOR = darkBrown;
export const ARROW_DEFAULT_OPACITY = 0;
export const ARROW_HOVER_COLOR = darkBrown;
export const ARROW_HOVER_OPACITY = 1 / 3;

export const ARROW_HORIZ_WIDTH = 64;
export const ARROW_HORIZ_HEIGHT = 32;
export const ARROW_VERT_WIDTH = 32;
export const ARROW_VERT_HEIGHT = 64;
export const INSERTION_POINT = {
  string: '▾',
  fontSize: 18,
  hScale: 0.8,
  color: 'rgba(116, 107, 84, 0.31)',
  background: 'unset',
  translateY: -3,
  hover: {
    color: tan,
    background: burgundy,
  },
};

export const EDITOR_TEXT = {
  primaryWord: {
    color: darkBrown,
    background: 'unset',
    hover: {
      color: tan,
      background: mediumOlive,
    },
  },
  mortarWord: {
    color: burgundy,
    background: 'unset',
    hover: {
      color: tan,
      background: burgundy,
    },
  },
  punctuation: {
    color: burgundy,
    background: 'unset',
    hover: {
      color: tan,
      background: burgundy,
    },
  },
};

export const LIBRARY_CARD = {
  minWidth: 320,
  maxWidth: 400,
  height: 292,
  poemFontSize: 22,
  numberFontSize: 22,
  borderRadius: 8,
  poemMaxHeight: 160,
};

export const COLORS = {
  backgroundLight: tan,
  backgroundDark: darkBrown,
  secondaryLight: mediumOlive,
  secondaryDark: darkOlive,
  faceFront: 'gray',
  buttonBackground: 'none',
  buttonBackgroundDisabled: '#e5b2ab',
  buttonText: darkBrown,
  buttonTextDisabled: 'blue',
  backdropOverlay: 'rgba(0, 0, 0, 0.3)',
  debug: 'dodgerBlue',
  insertedText: '#c1404a',
};

export const SIZES = {
  cellSize: 160,
  gapSize: 4,
  cubeFaceSize: 160 * 3 + 4 * 2,
  navBarHeight: 72,
  buttonPadding: '16px 32px',
  buttonHeight: 72,
  fontSize: 24,
  editorPictoSize: 96,
};

export const ROUNDING = {
  mainCubePicto: 20,
};

export const STYLE_BLOCKS = {
  fonts: {
    primary: {
      fontFamily: '"Zilla Slab", serif',
      fontWeight: 300,
      fontStyle: 'normal',
      fontSize: SIZES.fontSize,
      lineHeight: 1.6,
      color: COLORS.backgroundDark,
    },
  },
  buttons: {
    primary: {
      height: 72,
      padding: '0 32px',
      background: 'gray',
    },
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    topCenterColumn: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  cube: {
    cellSize: 128,
    cellGap: 4,
    outerPadding: 6,
    cubePaddingTop: 124,
    cubePaddingBottom: 222,
  },
  pictogramCell: {
    background: COLORS.pictoBackground,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZES.cellSize,
    height: SIZES.cellSize,
  },
  cubeFaceGrid: {
    display: 'grid',
    gridTemplateColumns: `repeat(3, ${SIZES.cellSize}px)`,
    gridTemplateRows: `repeat(3, ${SIZES.cellSize}px)`,
    gap: `${SIZES.gapSize}px`,
    width: SIZES.cubeFaceSize,
    height: SIZES.cubeFaceSize,
  },
  centerCell: {
    background: COLORS.centerBackground,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZES.cellSize,
    height: SIZES.cellSize,
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    background: COLORS.disabledButton,
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: COLORS.backdropOverlay,
    zIndex: 99,
  },
};
