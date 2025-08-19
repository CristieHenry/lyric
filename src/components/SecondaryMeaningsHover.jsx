// src/components/SecondaryMeaningsHover.jsx
import React from 'react';
import { COLORS } from '../utils/styleConstants';

export default function SecondaryMeaningsHover(props) {
  const style = {
    position: 'fixed',
    top: props.mouseY,
    left: props.mouseX,
    background: COLORS.backgroundLight,
    opacity: 0.95,
    zIndex: 9999,
    padding: '10px 16px',
    lineHeight: '1.65',
    width: '200px',
    color: COLORS.backgroundDark,
    borderRadius: 8,
    pointerEvents: 'none',
  };

  return props.compKey === props.liKey ? (
    <ul style={style}>
      {props.secondary.map((word, index) => (
        <li key={index}>{word}</li>
      ))}
    </ul>
  ) : null;
}
