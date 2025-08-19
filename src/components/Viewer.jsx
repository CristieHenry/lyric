import React, { useState, useEffect } from 'react';
import solvedCubeData from '../data/solved_cube_data.json';
import transformDefaultPoem from '../utils/transformDefaultPoem';
import Poem from './Poem';
import GlossByMeaning from './GlossByMeaning';
import GlossByPicto from './GlossByPicto';
import PictoGlossaryPopup from './PictoGlossaryPopup';
import CubeGrid from './CubeGrid';
import Button from './Button'; // Assuming Button.jsx is fixed for the leadingIcon warning
import { COLORS, SIZES, STYLE_BLOCKS } from '../utils/styleConstants';

const ORIENTATIONS = ['up', 'right', 'down', 'left'];
function randomOrientation() {
  return ORIENTATIONS[Math.floor(Math.random() * ORIENTATIONS.length)];
}
const cornerStartIndex = {
  'top-left': 0,
  'top-right': 2,
  'bottom-right': 8,
  'bottom-left': 6,
};
const clockwiseOffsets = [0, 1, 2, 5, 8, 7, 6, 3];
function getLayoutIndexes(corner, direction) {
  const start = cornerStartIndex[corner];
  const idx = clockwiseOffsets.indexOf(start);
  let ordered = [
    ...clockwiseOffsets.slice(idx),
    ...clockwiseOffsets.slice(0, idx),
  ];
  if (direction === 'counterclockwise') {
    ordered = [ordered[0], ...ordered.slice(1).reverse()];
  }
  return ordered;
}
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Viewer({
  initialPictoSet, // This is App.state.pictoSet
  activeFaceNameFromApp, // This is App.state.currentViewingFaceName
  onEdit,
  onScramble, // Expects: onScramble(sequence, faceName)
  onSolve, // Expects: onSolve()
  onNavigate,
  onViewedFaceChange, // Expects: onViewedFaceChange(sequence, faceName)
}) {
  const [cubeState, setCubeState] = useState(() => {
    return solvedCubeData.map((f) => ({
      ...f,
      sequence: [...f.sequence],
      cellColors: [...f.cellColors],
    }));
  });

  // Effect to synchronize Viewer's internal cubeState with App's pictoSet for the active face
  useEffect(() => {
    if (initialPictoSet && activeFaceNameFromApp) {
      setCubeState((prevCubeState) =>
        prevCubeState.map((face) =>
          face.face === activeFaceNameFromApp
            ? { ...face, sequence: [...initialPictoSet] }
            : face
        )
      );
    }
  }, [initialPictoSet, activeFaceNameFromApp]);

  const [currentFace, setCurrentFace] = useState('front'); // Viewer's local current face name

  // Effect to set Viewer's local currentFace if activeFaceNameFromApp changes
  // This helps keep Viewer's display aligned if App dictates the face (e.g., after loading from library)
  useEffect(() => {
    if (activeFaceNameFromApp && activeFaceNameFromApp !== currentFace) {
      setCurrentFace(activeFaceNameFromApp);
    }
  }, [activeFaceNameFromApp]);

  const faceTransitions = {
    front: { top: 'top', bottom: 'bottom', left: 'left', right: 'right' },
    back: { top: 'bottom', bottom: 'top', left: 'right', right: 'left' },
    left: { top: 'top', bottom: 'bottom', left: 'back', right: 'front' },
    right: { top: 'top', bottom: 'bottom', left: 'front', right: 'back' },
    top: { top: 'back', bottom: 'front', left: 'left', right: 'right' },
    bottom: { top: 'front', bottom: 'back', left: 'left', right: 'right' },
  };

  const onRotate = (dir) => {
    const nextFaceName = faceTransitions[currentFace][dir];
    if (nextFaceName) {
      setCurrentFace(nextFaceName); // Update Viewer's internal state

      const currentViewerCubeState = cubeState;
      const newFaceData = currentViewerCubeState.find(
        (f) => f.face === nextFaceName
      );
      if (newFaceData && onViewedFaceChange) {
        onViewedFaceChange(newFaceData.sequence, nextFaceName);
      }
    }
  };

  const handleScramble = () => {
    const faces = cubeState.map((f) => f.face);
    const newTargetFaceName = faces[Math.floor(Math.random() * faces.length)];

    let pool = [];
    cubeState.forEach((fd) => {
      const layout = getLayoutIndexes(
        fd.readOrder.corner,
        fd.readOrder.direction
      );
      layout.forEach((gridIdx, seqIdx) => {
        pool.push({
          ...(fd.sequence[seqIdx] || {}), // Handle undefined sequence item
          fg: fd.cellColors[gridIdx].fg,
          bg: fd.cellColors[gridIdx].bg,
        });
      });
    });

    pool = shuffleArray(pool);
    let ptr = 0;

    const newCubeState = cubeState.map((fd) => {
      const layout = getLayoutIndexes(
        fd.readOrder.corner,
        fd.readOrder.direction
      );
      const newCellColors = [...fd.cellColors];
      const newSequence = fd.sequence.map(() => ({
        name: '',
        orientation: 'up',
      })); // Initialize with placeholders

      layout.forEach((gridIdx, seqIdx) => {
        if (ptr < pool.length) {
          // Ensure pool has enough items
          const piece = pool[ptr++];
          newSequence[seqIdx] = {
            name: piece.name,
            orientation: randomOrientation(),
          };
          newCellColors[gridIdx] = { fg: piece.fg, bg: piece.bg };
        }
      });
      return { ...fd, sequence: newSequence, cellColors: newCellColors };
    });

    setCubeState(newCubeState);
    setCurrentFace(newTargetFaceName); // Update Viewer's local current face

    const scrambledFaceData = newCubeState.find(
      (f) => f.face === newTargetFaceName
    );
    if (onScramble && scrambledFaceData) {
      onScramble(scrambledFaceData.sequence, newTargetFaceName); // Pass sequence and face name
    }
  };

  const handleSolve = () => {
    const solvedState = solvedCubeData.map((f) => ({
      ...f,
      sequence: [...f.sequence],
      cellColors: [...f.cellColors],
    }));
    setCubeState(solvedState);
    setCurrentFace('front');
    if (onSolve) {
      onSolve();
    }
  };

  const [hoveredDir, setHoveredDir] = useState(null);
  const onHoverEnter = (dir) => setHoveredDir(dir);
  const onHoverLeave = () => setHoveredDir(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowUp') onRotate('top');
      if (e.key === 'ArrowDown') onRotate('bottom');
      if (e.key === 'ArrowLeft') onRotate('left');
      if (e.key === 'ArrowRight') onRotate('right');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentFace, cubeState]); // cubeState dependency because onRotate reads it

  const [glossType, setGlossType] = useState('picto');
  const [popupType, setPopupType] = useState(null);
  const [popupName, setPopupName] = useState(null);
  const openPopup = (type, name = null) => {
    setPopupType(type);
    setPopupName(name);
  };
  const closePopup = () => {
    setPopupType(null);
    setPopupName(null);
  };

  // Compute words for Viewer's own Poem component
  const currentFaceData = cubeState.find((f) => f.face === currentFace) ||
    solvedCubeData.find((f) => f.face === currentFace) || {
      // Fallback to ensure currentFaceData is valid
      sequence: [],
      face: currentFace,
    };
  const defaultFace = solvedCubeData.find((f) => f.face === currentFace) || {
    sequence: [],
  };

  let wordsForViewerPoem;
  if (
    currentFaceData &&
    currentFaceData.sequence &&
    currentFaceData.sequence.length > 0
  ) {
    const isFaceSolved =
      defaultFace.sequence &&
      currentFaceData.sequence.length === defaultFace.sequence.length &&
      currentFaceData.sequence.every(
        (item, i) =>
          item.name === defaultFace.sequence[i].name &&
          item.orientation === defaultFace.sequence[i].orientation
      );

    wordsForViewerPoem = isFaceSolved
      ? transformDefaultPoem(currentFace) // Use face name for solved state to get full poem structure
      : transformDefaultPoem(currentFaceData.sequence); // Use sequence for potentially scrambled state
  } else {
    console.warn(
      `[Viewer.jsx render] No valid sequence for face: ${currentFace}. Using empty words.`
    );
    wordsForViewerPoem = [];
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: COLORS.backgroundLight,
      }}
    >
      {/* Left panel */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <Button label='Library' onClick={() => onNavigate('library')} />
        </div>
        <div
          id='cube+wrapper'
          style={{
            ...STYLE_BLOCKS.flex.topCenterColumn,
            padding: '124px 0 0 0',
            gap: 64,
          }}
        >
          <CubeGrid
            faceData={currentFaceData}
            hoveredDir={hoveredDir}
            onHoverEnter={onHoverEnter}
            onHoverLeave={onHoverLeave}
            onRotate={onRotate}
          />
          <div
            style={{
              height: SIZES.navBarHeight,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onEdit();
              }}
            >
              <Poem words={wordsForViewerPoem} readonly />
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            label='Edit'
            onClick={() => {
              onEdit();
            }}
          />
          <Button label='Scramble' onClick={handleScramble} />
          <Button label='Solve' onClick={handleSolve} />
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          width: 400,
          height: '100vh',
          background: COLORS.backgroundDark,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            height: SIZES.navBarHeight,
            flexShrink: 0,
          }}
        >
          <span
            onClick={() => setGlossType('picto')}
            style={{
              flex: 1,
              textAlign: 'center',
              paddingTop: 16,
              cursor: glossType === 'picto' ? 'initial' : 'pointer',
              textDecoration: glossType === 'picto' ? 'underline' : 'none',
              color: COLORS.backgroundLight,
            }}
          >
            by pictogram
          </span>
          <span
            onClick={() => setGlossType('meaning')}
            style={{
              flex: 1,
              textAlign: 'center',
              paddingTop: 16,
              cursor: glossType === 'meaning' ? 'initial' : 'pointer',
              textDecoration: glossType === 'meaning' ? 'underline' : 'none',
              color: COLORS.backgroundLight,
            }}
          >
            by meaning
          </span>
        </div>
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            position: 'relative',
            background:
              glossType === 'picto'
                ? COLORS.backgroundDark
                : COLORS.secondaryDark,
          }}
        >
          {glossType === 'picto' ? (
            <GlossByPicto openPopup={openPopup} />
          ) : (
            <GlossByMeaning />
          )}
        </div>
        <PictoGlossaryPopup
          type={popupType}
          name={popupName}
          show={popupType !== null}
          onClose={closePopup}
        />
      </div>
    </div>
  );
}
