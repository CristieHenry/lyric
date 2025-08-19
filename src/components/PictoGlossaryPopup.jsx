import React, { useState, useRef, useEffect } from 'react';
import pictoData from '../data/picto_data.json';
import SecondaryMeaningsHover from './SecondaryMeaningsHover';
import { COLORS, STYLE_BLOCKS } from '../utils/styleConstants';
import getPublicPath from '../utils/getPublicPath';

export default function PictoGlossaryPopup({ type, name, show, onClose }) {
  const [compKey, setCompKey] = useState(null);
  const popupRef = useRef(null);
  const [popupPos, setPopupPos] = useState({ mouseX: 0, mouseY: 0 });

  const HOVER_OFFSET_X = -239; // pixels to move right
  const HOVER_OFFSET_Y = 30; // pixels to move down

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!compKey) return;
    const container = popupRef.current;
    const handleScroll = () => {
      const li = container.querySelector(`[data-key="${compKey}"]`);
      if (li) {
        const rect = li.getBoundingClientRect();
        setPopupPos({
          mouseX: rect.right + HOVER_OFFSET_X,
          mouseY: rect.top + HOVER_OFFSET_Y,
        });
      }
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [compKey]);

  if (!show) return null;

  const isFirst = type === 'first';

  const popupData = [
    {
      image: 'read-ord-cw-tr.png',
      text: 'Start at the top right and read counter-clockwise',
    },
    {
      image: 'read-ord-ccw-tr.png',
      text: 'Start at the top right and read clockwise',
    },
    {
      image: 'read-ord-cw-bl.png',
      text: 'Start at the bottom left and read clockwise',
    },
    {
      image: 'read-ord-ccw-tl.png',
      text: 'Start at the top left and read counter-clockwise',
    },
    {
      image: 'read-ord-ccw-br.png',
      text: 'Start at the bottom right and read counter-clockwise',
    },
    {
      image: 'read-ord-cw-tl.png',
      text: 'Start at the top left and read clockwise',
    },
  ];
  const getOrientationData = (pictoName) => {
    const item = pictoData.find((p) => p.name === pictoName);
    if (!item) return [];
    const orientations = Object.keys(item.orientations);
    return orientations.map((orientation) => ({
      orientation,
      meanings: item.orientations[orientation].meanings,
    }));
  };

  const wrapper = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: COLORS.secondaryDark,
    padding: '16px',
    zIndex: 10,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const close = {
    width: '56px',
    height: '56px',
    position: 'absolute',
    top: 0,
    right: 0,
    pointerEvents: 'all',
    cursor: 'pointer',
    background: COLORS.secondaryLight,
    zIndex: 11,
    borderRadius: 8,
    fontSize: 40,
    color: COLORS.backgroundLight,
    ...STYLE_BLOCKS.flex.center,
  };

  const group = {
    flex: '1 1 0',
    display: 'flex',
    gap: '24px',
    background: COLORS.secondaryDark,
    border: `8px solid ${COLORS.secondaryLight}`,
    borderRadius: 24,
    padding: '0px 12px 0 12px',
    lineHeight: '1.65',
    overflow: 'hidden',
  };

  const list = {
    listStyle: 'none',
    overflowY: 'auto',
    flex: 1,
    color: COLORS.backgroundLight,
    fontSize: 22,
    paddingTop: 10,
  };

  const picto = {
    height: 80,
    width: 80,
  };

  const getRotation = (orientation) => {
    switch (orientation) {
      case 'up':
        return 0;
      case 'right':
        return 90;
      case 'down':
        return 180;
      case 'left':
        return 270;
      default:
        return 0;
    }
  };

  return (
    <div id='picto popup' style={wrapper} ref={popupRef}>
      <div style={close} onClick={() => onClose(false)}>
        <span className='material-icons'>close</span>
      </div>
      {isFirst
        ? popupData.map((item, idx) => (
            <div key={idx} style={group}>
              <div style={{ paddingTop: 12 }}>
                <div
                  style={{
                    ...picto,
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={getPublicPath(`pictos/${item.image}`)}
                    alt='reading order'
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: 16,
                      background: COLORS.backgroundLight,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 1.5,
                  color: COLORS.backgroundLight,
                  padding: '10px 0 0 0',
                  alignItems: 'flex-start',
                  width: 200,
                }}
              >
                {item.text}
              </div>
            </div>
          ))
        : getOrientationData(name).map((entry, groupIndex) => (
            <div key={groupIndex} style={group}>
              <div style={{ paddingTop: 12 }}>
                <div
                  style={{
                    ...picto,
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={getPublicPath(`pictos/${name}.png`)}
                    alt={name}
                    style={{
                      ...picto,
                      transform: `rotate(${getRotation(entry.orientation)}deg)`,
                      background: COLORS.backgroundLight,
                      borderRadius: 16,
                    }}
                  />
                </div>
              </div>

              <ul style={list}>
                {entry.meanings.map((words, itemIndex) => (
                  <li
                    key={`${groupIndex}-${itemIndex}`}
                    data-key={`${groupIndex}-${itemIndex}`}
                    onMouseEnter={(e) => {
                      const key = `${groupIndex}-${itemIndex}`;
                      setCompKey(key);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setPopupPos({
                        mouseX: rect.right + HOVER_OFFSET_X,
                        mouseY: rect.top + HOVER_OFFSET_Y,
                      });
                    }}
                    onMouseLeave={() => setCompKey(null)}
                    style={{ position: 'relative' }}
                  >
                    {words.primary}
                    {compKey === `${groupIndex}-${itemIndex}` &&
                      words.secondary.length > 0 && (
                        <SecondaryMeaningsHover
                          mouseX={popupPos.mouseX}
                          mouseY={popupPos.mouseY}
                          secondary={words.secondary}
                          liKey={`${groupIndex}-${itemIndex}`}
                          compKey={compKey}
                        />
                      )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
    </div>
  );
}
