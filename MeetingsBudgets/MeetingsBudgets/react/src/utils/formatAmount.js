import { CURRENCY_MAP } from '../constants';

export const formatAmount = (amount, isoCode) => {
  const currencySymbol =
    getCurrencySymbol(isoCode) +
    (getCurrencySymbol(isoCode) === isoCode ? ' ' : '');
  return amount !== null ? currencySymbol + Number(amount).toFixed(2) : '';
};

export function getCurrencySymbol(isoCode) {
  return CURRENCY_MAP[isoCode] ? CURRENCY_MAP[isoCode] : isoCode;
}
