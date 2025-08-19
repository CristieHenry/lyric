import React from 'react';
import { COLORS } from '../utils/styleConstants';

export default function MeaningsHover({ data, offsetX = 8, offsetY = 18 }) {
  const style = {
    position: 'absolute',
    top: `${offsetY}px`,
    left: `${offsetX}px`,
    background: COLORS.backgroundLight,
    pointerEvents: 'none',
    zIndex: '99',
    // padding: '12px 24px 12px 24px',
    // lineHeight: '1.8',

    padding: '10px 16px',
    lineHeight: '1.65',

    width: '200px',
    borderRadius: 8,
    fontSize: 22,
  };

  return (
    <>
      <ul style={style}>
        {data.map((alt, index) => (
          <li key={index}>{alt}</li>
        ))}
      </ul>
    </>
  );
}
