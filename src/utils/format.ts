

// Format currency as EUR (€)
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);

// Short date/time formatted for display
export const formatDateTimeShort = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value;

  return date.toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};
