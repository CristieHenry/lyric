// src/components/CubeGrid.jsx
import React, { useRef } from 'react';
import CubeFace from './CubeFace';
import RotateControl from './RotateControl';
import { TopArrow, LeftArrow, BottomArrow, RightArrow } from './Arrows';
import {
  ARROW_DEFAULT_COLOR,
  ARROW_DEFAULT_OPACITY,
  ARROW_HOVER_COLOR,
  ARROW_HOVER_OPACITY,
  ARROW_HORIZ_HEIGHT,
  ARROW_VERT_WIDTH,
  STYLE_BLOCKS,
} from '../utils/styleConstants';

const CELL_SIZE = STYLE_BLOCKS.cube.cellSize;
const CUBE_SIZE =
  CELL_SIZE * 3 +
  STYLE_BLOCKS.cube.cellGap * 2 +
  STYLE_BLOCKS.cube.outerPadding * 2;

export default function CubeGrid({
  faceData,
  hoveredDir,
  onHoverEnter,
  onHoverLeave,
  onRotate,
}) {
  const leaveTimeoutRef = useRef(null);

  const handleMouseEnter = () => clearTimeout(leaveTimeoutRef.current);
  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(onHoverLeave, 100);
  };

  return (
    <div
      style={{
        // margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: ARROW_VERT_WIDTH * 2 + CUBE_SIZE,
        rowGap: `${STYLE_BLOCKS.cube.outerPadding}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top arrow */}
      <div
        style={{
          height: ARROW_HORIZ_HEIGHT,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          width: '100%',
        }}
      >
        <TopArrow
          fill={hoveredDir === 'top' ? ARROW_HOVER_COLOR : ARROW_DEFAULT_COLOR}
          opacity={
            hoveredDir === 'top' ? ARROW_HOVER_OPACITY : ARROW_DEFAULT_OPACITY
          }
          onMouseEnter={() => onHoverEnter('top')}
          onMouseLeave={onHoverLeave}
          onClick={() => onRotate('top')}
        />
      </div>

      {/* Middle row */}
      <div
        style={{
          height: CUBE_SIZE,
          display: 'flex',
          width: '100%',
          gap: `${STYLE_BLOCKS.cube.outerPadding}px`,
        }}
      >
        {/* Left arrow */}
        <div
          style={{
            width: ARROW_VERT_WIDTH,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <LeftArrow
            fill={
              hoveredDir === 'left' ? ARROW_HOVER_COLOR : ARROW_DEFAULT_COLOR
            }
            opacity={
              hoveredDir === 'left'
                ? ARROW_HOVER_OPACITY
                : ARROW_DEFAULT_OPACITY
            }
            onMouseEnter={() => onHoverEnter('left')}
            onMouseLeave={onHoverLeave}
            onClick={() => onRotate('left')}
          />
        </div>

        {/* Cube + overlay */}
        <div
          style={{
            width: CUBE_SIZE,
            height: CUBE_SIZE,
            position: 'relative',
          }}
        >
          <CubeFace faceData={faceData} />
          <RotateControl
            size={CUBE_SIZE}
            onRotate={onRotate}
            onHoverEnter={onHoverEnter}
            onHoverLeave={onHoverLeave}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>

        {/* Right arrow */}
        <div
          style={{
            width: ARROW_VERT_WIDTH,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <RightArrow
            fill={
              hoveredDir === 'right' ? ARROW_HOVER_COLOR : ARROW_DEFAULT_COLOR
            }
            opacity={
              hoveredDir === 'right'
                ? ARROW_HOVER_OPACITY
                : ARROW_DEFAULT_OPACITY
            }
            onMouseEnter={() => onHoverEnter('right')}
            onMouseLeave={onHoverLeave}
            onClick={() => onRotate('right')}
          />
        </div>
      </div>

      {/* Bottom arrow */}
      <div
        style={{
          height: ARROW_HORIZ_HEIGHT,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <BottomArrow
          fill={
            hoveredDir === 'bottom' ? ARROW_HOVER_COLOR : ARROW_DEFAULT_COLOR
          }
          opacity={
            hoveredDir === 'bottom'
              ? ARROW_HOVER_OPACITY
              : ARROW_DEFAULT_OPACITY
          }
          onMouseEnter={() => onHoverEnter('bottom')}
          onMouseLeave={onHoverLeave}
          onClick={() => onRotate('bottom')}
        />
      </div>
    </div>
  );
}
