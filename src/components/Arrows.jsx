// src/components/Arrows.jsx

import React from 'react';

export function TopArrow({
  fill,
  opacity,
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <svg
      width={64}
      height={32}
      viewBox='0 0 64 32'
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        cursor: 'pointer',
        fill,
        opacity,
        ...style,
      }}
    >
      <polygon points='32 0 0 32 64 32 32 0' />
    </svg>
  );
}

export function BottomArrow({
  fill,
  opacity,
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <svg
      width={64}
      height={32}
      viewBox='0 0 64 32'
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        cursor: 'pointer',
        fill,
        opacity,
        ...style,
      }}
    >
      <polygon points='32 32 0 0 64 0 32 32' />
    </svg>
  );
}

export function LeftArrow({
  fill,
  opacity,
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <svg
      width={32}
      height={64}
      viewBox='0 0 32 64'
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        cursor: 'pointer',
        fill,
        opacity,
        ...style,
      }}
    >
      <polygon points='0 32 32 0 32 64 0 32' />
    </svg>
  );
}

export function RightArrow({
  fill,
  opacity,
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <svg
      width={32}
      height={64}
      viewBox='0 0 32 64'
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        cursor: 'pointer',
        fill,
        opacity,
        ...style,
      }}
    >
      <polygon points='32 32 0 64 0 0 32 32' />
    </svg>
  );
}
