export const normalizeLots = keys => data => {
  const normalize = (item) => {
    const clean = {};
    Object.keys(item).map(key => {
      let value = item[key]
      if (item[key] && typeof item[key] === 'object') {
        value = normalize(item[key])
      }
      clean[keys[key] || key] = value;
    });
    return clean;
  }

  return data.map(item => {
    if (!item || typeof item !== 'object') return;
    return normalize(item);
  });
};
