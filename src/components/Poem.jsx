import React from 'react';
import { COLORS, INSERTION_POINT } from '../utils/styleConstants';

export default function Poem({ words, readonly = false }) {
  return (
    <div id='poem' style={styles.poem}>
      {words.map((word, i) =>
        word.text === '\n' ? (
          <React.Fragment key={i}>
            <br />
          </React.Fragment>
        ) : (
          <React.Fragment key={i}>
            <span style={word.inserted ? styles.inserted : styles.word}>
              {word.text}
              {!readonly && (
                <span style={styles.insertPoint}>{INSERTION_POINT.string}</span>
              )}
            </span>
            {/* give a break opportunity here */}
            <wbr />
          </React.Fragment>
        )
      )}{' '}
    </div>
  );
}

const styles = {
  poem: {
    whiteSpace: 'pre-wrap',
    maxWidth: 360,
    height: 160,
    /* allow long words or inline boxes to wrap */
    overflowWrap: 'break-word',
    /* alias for older browsers */
    wordWrap: 'break-word',
  },
  word: {
    marginRight: 8,
  },
  inserted: {
    marginRight: 8,
    color: COLORS.insertedText,
  },
  insertPoint: {
    // marginLeft: 4,
    // color: 'blue',
  },
  break: {
    display: 'block',
    height: '28px',
  },
};
