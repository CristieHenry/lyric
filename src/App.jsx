import React, { useState, useEffect } from 'react';
import Viewer from './components/Viewer';
import Editor from './components/Editor';
import Library from './components/Library';
import { DEFAULT_CUBE } from './utils/constants';
import { getPoemFromPictos } from './utils/getPoemFromPictos';
import makePoem from './utils/makePoem'; // Ensure this adds isUserPoem: true
import { COLORS, STYLE_BLOCKS } from './utils/styleConstants';
import solvedCubeData from './data/solved_cube_data.json';
import transformDefaultPoem from './utils/transformDefaultPoem';
import publicPoemsData from './data/public_poems.json'; // <-- IMPORTED PUBLIC POEMS

// This is the string representation of the default front poem
const defaultFrontPoemString = transformDefaultPoem('front')
  .map((w) => (w.text === '\n' ? '\\n' : w.text))
  .join(' ');

export default function App() {
  const [currentPage, setCurrentPage] = useState('viewer');
  const [currentViewingFaceName, setCurrentViewingFaceName] = useState('front');
  const [pictoSet, setPictoSet] = useState(DEFAULT_CUBE.pictograms);
  const [currentText, setCurrentText] = useState(defaultFrontPoemString);
  const [filterMode, setFilterMode] = useState('user');

  const [libFile, setLibFile] = useState(() => {
    // Ensure public poems from JSON have correct flags, complementing makePoem
    return publicPoemsData.map((poem) => ({
      ...poem,
      isPublic: true, // Already in your JSON generation
      isUserPoem: false, // Explicitly mark public poems as not user poems
    }));
  });

  const [currentPoemId, setCurrentPoemId] = useState(null);
  const [lastSerialNumber, setLastSerialNumber] = useState(() => {
    const maxPublicSerial =
      publicPoemsData.length > 0
        ? Math.max(
            0,
            ...publicPoemsData.map((p) =>
              typeof p.serialNumber === 'number' ? p.serialNumber : 0
            )
          )
        : 0;
    // Initialize based on public poems or a default starting number if no public poems exist or have low serials
    const defaultInitialSerial = 0; // Start user poems at 300 or higher
    return Math.max(maxPublicSerial, defaultInitialSerial);
  });

  // Ensure App's state is correct on initial load for the Viewer
  useEffect(() => {
    const frontFaceData = solvedCubeData.find((f) => f.face === 'front');
    if (frontFaceData) {
      setPictoSet(frontFaceData.sequence);
      setCurrentViewingFaceName('front');
      setCurrentText(defaultFrontPoemString);
      setCurrentPoemId(null);
    }
  }, []);

  function handleViewedFaceChange(newFacePictoSet, faceName) {
    setCurrentViewingFaceName(faceName);
    setPictoSet(newFacePictoSet);

    const solvedFaceDef = solvedCubeData.find((f) => f.face === faceName);
    let textForAppString;
    let newPoemId = null;

    let isConsideredSolved = false;
    if (
      solvedFaceDef &&
      newFacePictoSet &&
      solvedFaceDef.sequence &&
      JSON.stringify(newFacePictoSet) === JSON.stringify(solvedFaceDef.sequence)
    ) {
      isConsideredSolved = true;
    }

    if (isConsideredSolved) {
      textForAppString = '';
    } else {
      textForAppString = getPoemFromPictos(newFacePictoSet || []);
    }

    setCurrentText(textForAppString);
    setCurrentPoemId(newPoemId);
  }

  const handleFilterChange = (mode) => {
    setFilterMode(mode);
  };

  function handleEdit() {
    if (currentPage !== 'library' || !currentPoemId) {
      setCurrentPoemId(null);
    }
    setCurrentPage('editor');
  }

  function handleScramble(scrambledSequence, newFaceName) {
    const targetFaceName = newFaceName || 'front';
    setPictoSet(scrambledSequence);
    setCurrentViewingFaceName(targetFaceName);
    const newText = getPoemFromPictos(scrambledSequence || []);
    setCurrentText(newText);
    setCurrentPoemId(null);
    setCurrentPage('viewer');
  }

  function handleSolve() {
    const frontFaceData = solvedCubeData.find((f) => f.face === 'front');
    if (frontFaceData) {
      setPictoSet(frontFaceData.sequence);
    }
    setCurrentViewingFaceName('front');
    setCurrentText(defaultFrontPoemString);
    setCurrentPoemId(null);
    setCurrentPage('viewer');
  }

  function handleSave(updatedText) {
    const poemObj = makePoem(
      pictoSet,
      updatedText,
      libFile,
      currentPoemId,
      currentViewingFaceName,
      lastSerialNumber
    );

    // If updating, remove old; then add new/updated
    const updatedLibFile = currentPoemId
      ? libFile.filter((p) => p.id !== currentPoemId)
      : libFile;
    setLibFile([...updatedLibFile, poemObj]);

    setLastSerialNumber(poemObj.serialNumber);
    setCurrentText(updatedText);
    setCurrentPoemId(poemObj.id);
    setCurrentViewingFaceName(poemObj.face || currentViewingFaceName); // Update face name if poemObj has it
    setCurrentPage('library');
  }

  function handleSaveACopy(updatedText) {
    const poemObj = makePoem(
      pictoSet,
      updatedText,
      libFile,
      null, // Force new ID by passing null for currentPoemId
      currentViewingFaceName,
      lastSerialNumber
    );

    setLibFile((prev) => [...prev, poemObj]);
    setLastSerialNumber(poemObj.serialNumber);
    setCurrentText(updatedText);
    setCurrentPoemId(poemObj.id);
    setCurrentViewingFaceName(poemObj.face || currentViewingFaceName);
    setCurrentPage('library');
  }

  function handleDeletePoem(idToDelete) {
    const poemToDelete = libFile.find((p) => p.id === idToDelete);
    // Only delete if it's a user poem (assuming makePoem adds isUserPoem: true
    // and public poems have isPublic: true or isUserPoem: false)
    if (poemToDelete && poemToDelete.isUserPoem) {
      setLibFile((prevLibFile) =>
        prevLibFile.filter((p) => p.id !== idToDelete)
      );
    } else if (
      poemToDelete &&
      !poemToDelete.isUserPoem &&
      poemToDelete.isPublic
    ) {
      console.warn(
        `[App.jsx handleDeletePoem] Attempted to delete a public poem (ID: ${idToDelete}). Deletion aborted.`
      );
    } else {
      console.warn(
        `[App.jsx handleDeletePoem] Poem not found or not deletable: ${idToDelete}`
      );
    }
  }

  return (
    <div
      style={{
        ...STYLE_BLOCKS.fonts.primary,
        background: COLORS.backgroundLight,
      }}
    >
      {currentPage === 'viewer' && (
        <Viewer
          initialPictoSet={pictoSet}
          activeFaceNameFromApp={currentViewingFaceName}
          onEdit={handleEdit}
          onScramble={handleScramble}
          onSolve={handleSolve}
          onNavigate={setCurrentPage}
          onViewedFaceChange={handleViewedFaceChange}
        />
      )}
      {currentPage === 'editor' && (
        <Editor
          initialPictoSet={pictoSet}
          faceName={currentViewingFaceName}
          initialText={{ text: currentText, id: currentPoemId }}
          onSave={handleSave}
          onSaveACopy={handleSaveACopy}
          onClose={() => setCurrentPage('viewer')}
          onFilterChange={handleFilterChange}
          filterMode={filterMode}
        />
      )}
      {currentPage === 'library' && (
        <Library
          poems={libFile}
          onBack={() => setCurrentPage('viewer')}
          onDeletePoem={handleDeletePoem}
          onFilterChange={handleFilterChange}
          filterMode={filterMode}
          onSelect={(poem, mode) => {
            const selectedFaceName = poem.face || 'front';
            setCurrentViewingFaceName(selectedFaceName);
            setPictoSet(poem.pictograms);
            setCurrentText(poem.displayedText);
            setCurrentPoemId(poem.id);
            setCurrentPage(mode === 'edit' ? 'editor' : 'viewer');
          }}
        />
      )}
    </div>
  );
}
