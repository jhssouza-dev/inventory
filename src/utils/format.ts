// src/utils/format.ts

// Currency format with Euro (€)
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);

// Number format WITHOUT currency symbol (used in input fields)
export const formatNumberDE = (value: number): string =>
  new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

// Date-Time short
export const formatDateTimeShort = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value;

  return date.toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};
