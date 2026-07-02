/**
 * Formats a date string or object to a user-friendly format
 */
export const formatDate = (date: string | Date | number, options?: Intl.DateTimeFormatOptions): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
};

/**
 * Formats a number to USD currency format
 */
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
};
