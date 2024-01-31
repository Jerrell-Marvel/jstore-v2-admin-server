export const generateUniqueSuffix = () => {
  return Date.now() + "-" + Math.round(Math.random() * 1e9);
};
