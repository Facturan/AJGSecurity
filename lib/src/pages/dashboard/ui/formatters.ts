/**
 * Formats a number to a professional currency string with commas and fixed 2 decimal places.
 * Best used for display or ON BLUR.
 */
export const formatCurrency = (value: number | string | undefined | null, precision: number = 2): string => {
  if (value === undefined || value === null || value === '') return '';
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: precision,
  }).format(num);
};

/**
 * Strips commas and returns a raw numeric string or number.
 */
export const cleanCurrencyString = (value: string): string => {
  return value.replace(/,/g, '');
};

/**
 * Parses a currency-style string back into a raw number.
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

/**
 * Adds commas to a numeric string WITHOUT forcing decimal places.
 * Perfect for 'as-you-type' formatting.
 */
export const formatWithCommas = (value: string, maxDecimals: number = 4): string => {
  if (!value) return '';
  
  // Remove anything not a digit or decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  
  const parts = cleaned.split('.');
  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Rejoin with decimal part if it exists
  return parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, maxDecimals)}` : parts[0];
};
