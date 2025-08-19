// utils/getPublicPath.js
const getPublicPath = (relativePath) => {
  const base = process.env.REACT_APP_BASE_URL || '/';
  return `${base}${relativePath}`;
};

export default getPublicPath;
