import { toByteArray } from 'base64-js';
/**
 * salesforce picklist validator
 * @param {string} str - base64
 * @returns {Array} returns array of valid indexes of parent picklist
 * @example [15] = base64toBitIndex('AAEA')
 * */
export const base64toBitIndex = (str = '') => {
  const arr = [];
  if (str) {
    const b = toByteArray(str);

    for (let i = 0; i < b.length; i += 1) {
      const s = b[i].toString(2).padStart(8, '0');
      for (let j = 0; j < 8; j += 1) {
        if (Number(s[j])) arr.push(i * 8 + j);
      }
    }
  }

  return arr;
};

export const normalizer = (keys = {}) => (data = []) =>
  data.map(item => {
    if (!item || typeof item !== 'object') return;
    const clean = {};
    Object.keys(item).map(key => {
      clean[keys[key] || key] = item[key];
    });

    return clean;
  });

export const lowercaseKeys = (obj) => {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}
