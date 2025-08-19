import React, { useRef, useState, useMemo, useEffect } from 'react';
import MeaningsHover from './MeaningsHover';
import pictoData from '../data/picto_data.json';
import { COLORS, STYLE_BLOCKS } from '../utils/styleConstants';
import getPublicPath from '../utils/getPublicPath';

const HOVER_OFFSET_X = 10; // pixels to the right of the <li>
const HOVER_OFFSET_Y = 54; // pixels down from the top of the <li>

export default function GlossByMeaning() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredMeaning, setHoveredMeaning] = useState(null);
  const [activeLetter, setActiveLetter] = useState(null);

  const handleMouseEnter = (meaning, index) => {
    setHoveredMeaning(meaning);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredMeaning(null);
    setHoveredIndex(null);
  };

  const getAlphabetizedMeanings = () => {
    const meanings = [];
    const seen = new Set();
    pictoData.forEach((item) => {
      for (const orientation in item.orientations) {
        item.orientations[orientation].meanings.forEach((meaning) => {
          if (!seen.has(meaning.primary)) {
            meanings.push(meaning);
            seen.add(meaning.primary);
          }
        });
      }
    });
    meanings.sort((a, b) => a.primary.localeCompare(b.primary));
    return meanings;
  };

  const allMeanings = useMemo(getAlphabetizedMeanings, []);

  const firstLetterRefs = useMemo(() => {
    const refs = {};
    allMeanings.forEach((meaning) => {
      const letter = meaning.primary[0].toLowerCase();
      if (!refs[letter]) {
        refs[letter] = React.createRef();
      }
    });
    return refs;
  }, [allMeanings]);

  // Build the set of letters for the alphabet strip
  const availableLetters = useMemo(() => {
    const set = new Set();
    allMeanings.forEach((m) => {
      const letter = m.primary[0].toLowerCase();
      set.add(letter);
    });
    return set;
  }, [allMeanings]);

  // On first render, default to the first alphabet letter
  useEffect(() => {
    if (availableLetters.size > 0) {
      const first = [...availableLetters].sort()[0];
      setActiveLetter(first);
    }
  }, [availableLetters]);
  const handleAlphaClick = (letter) => {
    const ref = firstLetterRefs[letter];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const seenLetters = new Set();

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        ...STYLE_BLOCKS.fonts.primary,
        //
      }}
    >
      {/* Alphabet strip */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          width: 70,
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingTop: 20,
          paddingLeft: 20,
          background: COLORS.secondaryLight,
        }}
      >
        {[...availableLetters].sort().map((letter) => (
          <div
            key={letter}
            onClick={() => {
              handleAlphaClick(letter);
              setActiveLetter(letter);
            }}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              color:
                activeLetter === letter
                  ? COLORS.backgroundLight
                  : COLORS.backgroundDark,
            }}
          >
            {letter}
          </div>
        ))}
      </div>
      {/* Meanings list */}
      <div
        style={{
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
          padding: '16px 0 120px 0',
          background: COLORS.secondaryDark,
        }}
      >
        {allMeanings.map((obj, index) => {
          const letter = obj.primary[0].toLowerCase();
          let ref = null;
          if (!seenLetters.has(letter)) {
            seenLetters.add(letter);
            ref = firstLetterRefs[letter];
          }

          return (
            <div
              key={index}
              ref={ref}
              onMouseEnter={() => handleMouseEnter(obj.primary, index)}
              onMouseLeave={handleMouseLeave}
              style={{
                width: '100%',
                height: '80px',
                display: 'flex',
                gap: '4px',
                position: 'relative',
                paddingRight: 16,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  paddingLeft: 24,
                  color: COLORS.backgroundLight,
                }}
              >
                {obj.primary}
              </span>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  background: COLORS.backgroundLight,
                  borderRadius: 16,
                }}
              >
                {(() => {
                  const match = pictoData.find((picto) =>
                    Object.entries(picto.orientations).some(
                      ([orientation, { meanings }]) =>
                        meanings.some((m) => m.primary === obj.primary)
                    )
                  );

                  if (!match) return null;

                  const [orientation] = Object.entries(match.orientations).find(
                    ([, { meanings }]) =>
                      meanings.some((m) => m.primary === obj.primary)
                  ) || ['up'];

                  const rotation =
                    {
                      up: 0,
                      right: 90,
                      down: 180,
                      left: 270,
                    }[orientation] || 0;

                  // const imgSrc = getPublicPath(`pictos/${match.name}.png`);
                  const imgSrc = getPublicPath(`pictos/${match.name}`);
                  console.log('GlossByMeaning image src:', imgSrc);
                  return (
                    <img
                      src={getPublicPath(`pictos/${match.name}.png`)}
                      alt={match.name}
                      style={{
                        height: 80,
                        width: 80,
                        transform: `rotate(${rotation}deg)`,
                      }}
                    />
                  );
                })()}
              </div>

              {hoveredIndex === index && obj.secondary.length > 0 && (
                <MeaningsHover
                  data={obj.secondary}
                  offsetX={HOVER_OFFSET_X}
                  offsetY={HOVER_OFFSET_Y}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
