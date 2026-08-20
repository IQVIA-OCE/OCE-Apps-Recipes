export const sortStrings = (accessor, sortOrder, a, b) => {
  const valueA = a[accessor].toLowerCase();
  const valueB = b[accessor].toLowerCase();

  if (sortOrder === 'ascending') {
    return valueA > valueB ? 1 : valueB > valueA ? -1 : 0;
  } else {
    return valueA < valueB ? 1 : valueB < valueA ? -1 : 0;
  }
};

export const sortCurrency = (accessor, sortOrder, a, b) => {
  const valueA =
    a[accessor] === ''
      ? Number.NEGATIVE_INFINITY
      : Number(a[accessor].replace(/[^\-\d.]*/g, ''));
  const valueB =
    b[accessor] === ''
      ? Number.NEGATIVE_INFINITY
      : Number(b[accessor].replace(/[^\-\d.]*/g, ''));

  if (sortOrder === 'ascending') {
    return valueA > valueB ? 1 : valueB > valueA ? -1 : 0;
  } else {
    return valueA < valueB ? 1 : valueB < valueA ? -1 : 0;
  }
};
