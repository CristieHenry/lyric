import React from 'react';
import pictoData from '../data/picto_data.json';
import readOrderImages from '../data/read_order_images.json';
import { COLORS, ROUNDING, STYLE_BLOCKS } from '../utils/styleConstants';
import getPublicPath from '../utils/getPublicPath';

const ROTATIONS = { up: 0, right: 90, down: 180, left: 270 };

export default function CubeFace({ faceData }) {
  // Guard: we must have a proper faceData object
  if (!faceData || !Array.isArray(faceData.sequence)) {
    return <div>Invalid face data</div>;
  }

  const { sequence, cellColors = [], readOrder } = faceData;
  const { corner, direction } = readOrder;

  // Compute our 3×3 positions
  const cornerStartIndex = {
    'top-left': 0,
    'top-right': 2,
    'bottom-right': 8,
    'bottom-left': 6,
  }[corner];
  const offsets = [0, 1, 2, 5, 8, 7, 6, 3];
  let layout = [
    ...offsets.slice(offsets.indexOf(cornerStartIndex)),
    ...offsets.slice(0, offsets.indexOf(cornerStartIndex)),
  ];
  if (direction === 'counterclockwise') {
    layout = [layout[0], ...layout.slice(1).reverse()];
  }

  // Fill grid
  const grid = Array(9).fill(null);
  layout.forEach((pos, i) => {
    grid[pos] = sequence[i] || null;
  });

  // Center mask URL (prefixed with base URL)
  const centerEntry = readOrderImages.find(
    (e) => e.corner === corner && e.direction === direction
  );
  const centerMask = centerEntry
    ? `url(${getPublicPath(centerEntry.url)})`
    : '';

  const cellSize = STYLE_BLOCKS.cube.cellSize;
  const gap = STYLE_BLOCKS.cube.cellGap;
  const pad = STYLE_BLOCKS.cube.outerPadding;

  return (
    <div
      style={{
        width: cellSize * 3 + gap * 2 + pad * 2,
        height: cellSize * 3 + gap * 2 + pad * 2,
        background: COLORS.backgroundDark,
        borderRadius: '28px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(3, ${cellSize}px)`,
          gridTemplateRows: `repeat(3, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {grid.map((item, i) => {
          const { fg = 'black', bg = COLORS.pictoBackground } =
            cellColors[i] || {};

          const maskUrl = item
            ? `url(${getPublicPath(
                pictoData.find((p) => p.name === item.name).image
              )})`
            : centerMask;

          const rotation = item ? ROTATIONS[item.orientation] : 0;

          console.log('maskUrl:', maskUrl);

          return (
            <div
              key={i}
              style={{
                width: cellSize,
                height: cellSize,
                background: bg,
                borderRadius: ROUNDING.mainCubePicto,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: fg,
                  maskImage: maskUrl,
                  maskSize: 'contain',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat',
                  WebkitMaskImage: maskUrl,
                  WebkitMaskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
