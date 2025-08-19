import React, { useState, useMemo } from 'react'; // Import useMemo
import {
  COLORS,
  LIBRARY_CARD,
  SIZES,
  STYLE_BLOCKS,
} from '../utils/styleConstants';
import Button from './Button';
import getPublicPath from '../utils/getPublicPath';

const CARD_PADDING_LEFT = 8;
const CARD_HOVER_COLOR = 'rgba(0, 0, 0, 0.04)';
const PICTO_WRAPPER_COLOR = '#d8cab2';
const POEM_LINE_HEIGHT = 1.66;
const POEM_GAP = 8;
const POEM_PADDING_RIGHT = 60;
const POEM_PADDING_TOP = 4;
const PICTO_SIZE = 2;

const styles = {
  wrapper: {
    padding: '80px 0 80px 0', // Added bottom padding for the fixed filter buttons
    width: '100vw',
    minHeight: '100vh', // Use minHeight
    boxSizing: 'border-box',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${LIBRARY_CARD.minWidth}px, ${LIBRARY_CARD.maxWidth}px))`,
    gap: '8px',
    justifyContent: 'center',
    width: '100%', // Use 100% to respect padding on wrapper if any
    padding: '0 16px', // Added some horizontal padding to the grid
    boxSizing: 'border-box',
  },
  card: {
    position: 'relative',
    height: LIBRARY_CARD.height,
    padding: '6px',
    borderRadius: 16,
    // background for hover is handled inline in Card component
  },
  cardInset: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  iconContainer: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    display: 'flex',
    gap: '2px',
    opacity: 0, // Will be controlled by Card's hover state
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    padding: '10px 12px',
    cursor: 'pointer',
  },
  pictogramRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    padding: 6,
    background: PICTO_WRAPPER_COLOR,
    borderRadius: 12,
    marginTop: 'auto', // Added to push to bottom if poem text is short
  },
  pictogramBox: {
    // User's original style for pictogramBox
    width: PICTO_SIZE,
    height: 'auto',
    aspectRatio: '1/1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // These two width/height will override the PICTO_SIZE ones if PICTO_SIZE isn't a valid CSS unit for it
    width: '100%',
    height: '100%',
    background: COLORS.backgroundLight,
    borderRadius: 8,
  },
  titleBar: {
    position: 'fixed', // User's original
    top: 0,
    left: 0,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    zIndex: 10, // Ensure it's above cards
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  // outer, inner, frame are related to Dialog positioning, kept as is from user's file
  outer: {
    /* ... */
  },
  inner: {
    /* ... */
  },
  frame: {
    /* ... */
  },
  dialogBackdrop: {
    // Added for better dialog appearance
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: COLORS.backdropOverlay,
    zIndex: 99,
  },
  dialogWrapper: {
    // User's original, ensure zIndex is high enough
    display: 'flex',
    flexDirection: 'column',
    width: '420px',
    background: COLORS.backgroundLight,
    padding: '12px',
    lineHeight: '1.8',
    gap: '16px',
    zIndex: 100, // Above backdrop
    borderRadius: 8,
    position: 'relative', // Needed if frame is for centering
  },
  message: {
    padding: '12px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '8px',
  },
  dialogButton: {
    // Changed name from 'button' to avoid conflict
    background: COLORS.backgroundLight, // User's original style for dialog buttons
    padding: '16px 32px',
    pointerEvents: 'auto',
    cursor: 'pointer',
  },
  filterButtonContainer: {
    // NEW: For the bottom filter buttons
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0',
    // background: COLORS.backgroundLight, // Or a theme background
    zIndex: 10,
    gap: '10px',
    // boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  emptyLibraryMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    textAlign: 'center',
  },
};

const Card = ({ cardObj, onSelect, onDelete }) => {
  // Removed onView as it's not used
  const [hovered, setHovered] = useState(false);
  const orientationMap = { up: 0, right: 1, down: 2, left: 3 };

  return (
    <div
      style={{
        ...styles.card,
        background: hovered ? CARD_HOVER_COLOR : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(cardObj, 'view')} // Make whole card clickable for view
    >
      <div style={styles.cardInset}>
        <div style={{ ...styles.iconContainer, opacity: hovered ? 1 : 0 }}>
          <button
            title='Edit poem'
            onClick={(e) => {
              e.stopPropagation();
              onSelect(cardObj, 'edit');
            }}
            style={styles.iconButton}
          >
            <span className='material-icons'>edit</span>
          </button>
          {/* Conditionally render delete button only for user poems */}
          {cardObj.isUserPoem && (
            <button
              title='Delete poem'
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cardObj.id);
              }} // Pass ID to onDelete
              style={styles.iconButton}
            >
              <span className='material-icons'>delete</span>
            </button>
          )}
        </div>
        <span
          id='serial number'
          style={{
            padding: `${POEM_PADDING_TOP}px 0 0 ${CARD_PADDING_LEFT}px`,
            fontSize: LIBRARY_CARD.numberFontSize,
          }}
        >
          {cardObj.serialNumber}
        </span>
        <p
          id='poem'
          style={{
            whiteSpace: 'pre-line',
            flexGrow: 1,
            padding: `${POEM_GAP}px ${POEM_PADDING_RIGHT}px 0 ${CARD_PADDING_LEFT}px`,
            fontSize: LIBRARY_CARD.poemFontSize,
            lineHeight: POEM_LINE_HEIGHT,
            // User requested poem scrolling feature to be kept
            overflowY: 'auto',
            maxHeight: LIBRARY_CARD.poemMaxHeight,
          }}
        >
          {cardObj.displayedText}
        </p>
        <div
          style={styles.pictogramRow}
          // Removed onClick from here as whole card is clickable for view
        >
          {cardObj.pictograms.map((p, idx) => (
            <div
              key={idx}
              style={{
                // This uses user's original pictogramBox style
                ...styles.pictogramBox,
                transform: `rotate(${orientationMap[p.orientation] * 90}deg)`,
              }}
            >
              <img
                src={getPublicPath(`pictos/${p.name}.png`)}
                alt={p.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NavBar = ({ onBack }) => (
  <div id='nav-wrapper' style={styles.titleBar}>
    <Button label='Viewer' leadingIcon='arrow_back' onClick={onBack} />
  </div>
);

const Dialog = ({ message, buttons }) => (
  <>
    <div style={styles.dialogBackdrop} /> {/* Added backdrop */}
    <div
      id='dialog-frame'
      style={{
        ...styles.frame,
        pointerEvents: 'auto',
        zIndex: styles.dialogWrapper.zIndex + 1,
      }}
    >
      {' '}
      {/* Centering frame */}
      <div id='dialog-wrapper' style={styles.dialogWrapper}>
        <span style={styles.message}>{message}</span>
        <div style={styles.buttonWrapper}>
          {buttons.map((btn, i) => (
            // Using actual buttons for dialog actions
            <button key={i} style={styles.dialogButton} onClick={btn.onClick}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </>
);

const Library = ({
  poems = [],
  onSelect,
  onBack,
  onDeletePoem,
  filterMode,
  onFilterChange,
}) => {
  const [poemToDeleteId, setPoemToDeleteId] = useState(null); // Store ID for deletion

  const handleDeleteRequest = (poemId) => {
    // App.jsx's onDeletePoem should verify if the poem is deletable (e.g., isUserPoem)
    setPoemToDeleteId(poemId);
  };

  const confirmDelete = () => {
    if (poemToDeleteId) {
      onDeletePoem(poemToDeleteId);
      setPoemToDeleteId(null);
    }
  };

  const poemsToDisplay = useMemo(() => {
    let filteredList = [];
    if (filterMode === 'user') {
      // Assumes poems have an 'isUserPoem: true' flag for user-created ones
      // and 'isUserPoem: false' or undefined for public ones (App.jsx sets these)
      filteredList = poems.filter((p) => p.isUserPoem === true);
    } else {
      // 'all' filter mode
      filteredList = poems; // Shows all poems (public + user)
    }
    // Sort by serial number
    return filteredList.sort((a, b) => {
      const sA = typeof a.serialNumber === 'number' ? a.serialNumber : Infinity;
      const sB = typeof b.serialNumber === 'number' ? b.serialNumber : Infinity;
      return sA - sB;
    });
  }, [poems, filterMode]);

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.gridContainer}>
          {poemsToDisplay.length > 0 ? (
            poemsToDisplay.map((p) => (
              <Card
                key={p.id}
                cardObj={p}
                onSelect={onSelect}
                onDelete={handleDeleteRequest} // Pass ID to request deletion
              />
            ))
          ) : (
            <div
              style={{
                ...styles.emptyLibraryMessage,
                ...STYLE_BLOCKS.flex.center,
              }}
            >
              <span style={{ lineHeight: 1.8 }}>
                {filterMode === 'user'
                  ? 'You haven’t created any poems yet.'
                  : 'No poems to display.'}
                <br />
                Create some in the viewer!
              </span>
            </div>
          )}
        </div>
        {/* Buttons are now at the bottom, outside the scrollable grid area */}
      </div>
      <NavBar onBack={onBack} />
      {/* Filter buttons are now fixed at the bottom */}
      <div style={styles.filterButtonContainer}>
        <Button
          label='Your poems'
          onClick={() => onFilterChange('user')}
          style={{
            textDecoration: filterMode === 'user' ? 'underline' : 'none',
          }}
        />
        <Button
          label='All poems'
          style={{
            textDecoration: filterMode === 'all' ? 'underline' : 'none',
          }}
          onClick={() => onFilterChange('all')}
        />
      </div>
      {poemToDeleteId && (
        <Dialog
          message={
            <>
              Remove poem from library?
              <br />
              Your poem will be permanently deleted.
            </>
          }
          buttons={[
            { label: 'Cancel', onClick: () => setPoemToDeleteId(null) },
            { label: 'Delete', onClick: confirmDelete },
          ]}
        />
      )}
    </>
  );
};

export default Library;
