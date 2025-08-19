import pictoData from '../data/picto_data.json';
export function getPoemFromPictos(pictos) {
  return pictos
    .map(({ name, orientation }) => {
      const entry = pictoData.find((p) => p.name === name);
      return (
        entry?.orientations?.[orientation]?.meanings?.[0]?.primary ??
        `[${name}-${orientation}]`
      );
    })
    .join(' ');
}
