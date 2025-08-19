// src/components/RotateControl.jsx
import React from 'react';

export default function RotateControl({
  size,
  onHoverEnter,
  onHoverLeave,
  onRotate,
  style,
}) {
  const tris = [
    // top triangle
    { points: '332 168 500 0 0 0 168 168 332 168', dir: 'top' },
    // right triangle
    { points: '332 168 333 168 333 333 500 500 500 0 332 168', dir: 'right' },
    // bottom triangle
    { points: '333 333 168 333 168 332 0 500 500 500 333 333', dir: 'bottom' },
    // left triangle
    { points: '168 168 0 0 0 500 168 332 168 168', dir: 'left' },
  ];

  return (
    <svg viewBox='0 0 500 500' width={size} height={size} style={style}>
      {tris.map(({ points, dir }) => (
        <polygon
          key={dir}
          points={points}
          fill='transparent'
          pointerEvents='all'
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHoverEnter(dir)}
          onMouseLeave={onHoverLeave}
          onClick={() => onRotate(dir)}
        />
      ))}
    </svg>
  );
}
