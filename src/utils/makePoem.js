// src/utils/makePoem.js
import { v4 as uuidv4 } from 'uuid';

export default function makePoem(
  pictograms,
  displayedText = '',
  libFile, // All existing poems in the library
  poemIdToUpdate = null, // ID of the poem being updated, if any
  faceName, // The face name associated with this poem version (e.g., "front", "bottom")
  appLastSerial // App.jsx's current lastSerialNumber state, used as a base for new serials
) {
  let id = poemIdToUpdate;
  let serialNumber;

  if (poemIdToUpdate) {
    // This is an update to an existing poem
    const existingPoem = libFile.find((p) => p.id === poemIdToUpdate);
    if (existingPoem && typeof existingPoem.serialNumber === 'number') {
      serialNumber = existingPoem.serialNumber; // Keep original serial number
    } else {
      const maxExistingSerial = libFile.length
        ? Math.max(
            0,
            ...libFile
              .filter((p) => typeof p.serialNumber === 'number')
              .map((p) => p.serialNumber)
          )
        : 0;
      serialNumber = Math.max(maxExistingSerial, appLastSerial || 0) + 1;
    }
  } else {
    // This is a new poem
    id = uuidv4();

    const maxExistingSerial = libFile.length
      ? Math.max(
          0,
          ...libFile
            .filter((p) => typeof p.serialNumber === 'number')
            .map((p) => p.serialNumber)
        )
      : 0;

    serialNumber = Math.max(maxExistingSerial, appLastSerial || 0) + 1;
  }

  return {
    id: id,
    serialNumber: serialNumber,
    pictograms: pictograms,
    displayedText: displayedText,
    face: faceName,
    isUserPoem: true, // Explicitly mark as a user poem
    isPublic: false, // Explicitly mark as not public
  };
}
