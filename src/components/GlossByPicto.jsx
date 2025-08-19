import React from 'react';
import pictoData from '../data/picto_data.json';
import { COLORS } from '../utils/styleConstants';
import getPublicPath from '../utils/getPublicPath';

export default function GlossByPicto({ openPopup }) {
  const orientName = 'orient';

  // Split orient out separately if it exists
  const orient = pictoData.find((p) => p.name === orientName);
  const middlePictos = pictoData.filter((p) => p.name !== orientName);

  // Split into full rows of 3, and a final row (1 or 2 pictos)
  const fullRows = [];
  let leftovers = [];

  for (let i = 0; i < middlePictos.length; i += 3) {
    const slice = middlePictos.slice(i, i + 3);
    if (slice.length === 3) {
      fullRows.push(slice);
    } else {
      leftovers = slice;
    }
  }

  const getImagePath = (name) => {
    const match = pictoData.find((p) => p.name === name);
    return match?.image ?? '';
  };

  const renderPicto = (name, type, customSrc = null) => (
    <div
      key={`${type}-${name}`}
      style={styles.pictogram}
      onClick={() => openPopup(type, name)}
    >
      <img
        src={customSrc ? customSrc : getPublicPath(`pictos/${name}.png`)}
        alt={name}
        style={styles.image}
      />
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'center',
        padding: '16px 0 64px 0',
      }}
    >
      {/* Top hardcoded reference image — now clickable */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={styles.pictogram}
          onClick={() => openPopup('first', 'orient')}
        >
          <img
            src={getPublicPath('pictos/read-ord-cw-bl.png')}
            alt='read-order'
            style={styles.image}
          />
        </div>
      </div>

      {/* Orient pictogram (optional) */}
      {orient && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {renderPicto(orient.name, 'first', '/pictos/read-ord-cw-bl.png')}
        </div>
      )}

      {/* Grid of 3-column rows */}
      {fullRows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 100px)',
            gap: '4px',
          }}
        >
          {row.map((p) => renderPicto(p.name, 'picto'))}
        </div>
      ))}

      {/* Final row with 1 or 2 pictos, centered */}
      {leftovers.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${leftovers.length}, 100px)`,
            gap: '4px',
            justifyContent: 'center',
          }}
        >
          {leftovers.map((p) => renderPicto(p.name, 'picto'))}
        </div>
      )}
    </div>
  );
}

const styles = {
  pictogram: {
    width: '100px',
    height: '100px',
    background: COLORS.backgroundLight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
};
