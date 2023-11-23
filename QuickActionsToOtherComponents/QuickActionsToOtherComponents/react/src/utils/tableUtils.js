export const sortStrings = (accessor, sortOrder, a, b) => {
  const aVal = a[accessor] || '';
  const bVal = b[accessor] || '';
  if (sortOrder === 'ascending') {
    return aVal > bVal ? 1 : bVal > aVal ? -1 : 0;
  } else {
    return aVal < bVal ? 1 : bVal < aVal ? -1 : 0;
  }
};

export const sortDates = (accessor, sortOrder, a, b) => {
  const aVal = a[accessor] ? new Date(a[accessor]) : 0;
  const bVal = b[accessor] ? new Date(b[accessor]) : 0;
  if (sortOrder === 'ascending') {
    return aVal - bVal;
  } else {
    return bVal - aVal;
  }
};

export const sortNumbers = (accessor, sortOrder, a, b) => {
  const aVal = a[accessor] || 0;
  const bVal = b[accessor] || 0;
  if (sortOrder === 'ascending') {
    return aVal - bVal;
  } else {
    return bVal - aVal;
  }
};
