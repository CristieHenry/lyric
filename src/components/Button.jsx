import React from 'react';
import { SIZES } from '../utils/styleConstants'; // Assuming SIZES is used in baseStyle
import { COLORS, STYLE_BLOCKS } from '../utils/styleConstants'; // Assuming these are used in baseStyle

export default function Button({
  label,
  onClick,
  disabled = false,
  style = {},
  leadingIcon,
}) {
  const baseStyle = {
    ...STYLE_BLOCKS.centered,
    padding: SIZES.buttonPadding,
    height: SIZES.buttonHeight,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: STYLE_BLOCKS.fonts.primary.fontFamily,
    fontWeight: STYLE_BLOCKS.fonts.primary.fontWeight,
    fontSize: SIZES.fontSize,
    fontStyle: STYLE_BLOCKS.fonts.primary.fontStyle,
    opacity: disabled ? 0.4 : 1,
    ...style, // allow external override
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={baseStyle}
      disabled={disabled}
      // leadingIcon={leadingIcon} // <<< REMOVE THIS LINE
    >
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {leadingIcon && <span className='material-icons'>{leadingIcon}</span>}{' '}
        {/* Conditionally render if leadingIcon exists */}
        <span>{label}</span>
      </div>
    </button>
  );
}
