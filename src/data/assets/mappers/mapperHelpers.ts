
// Helper functions for asset mapping

export const formatDateForDb = (date: Date | string | null): string | null => {
  if (!date) return null;
  
  if (typeof date === 'string') {
    return date;
  }
  
  return date.toISOString().split('T')[0];
};

export const parseDbDate = (dateString: string | null): Date | null => {
  if (!dateString) return null;
  
  try {
    return new Date(dateString);
  } catch (error) {
    console.warn("Failed to parse date:", dateString);
    return null;
  }
};

export const sanitizeString = (value: string | null | undefined): string | null => {
  if (!value || value.trim() === '') return null;
  return value.trim();
};

export const sanitizeNumber = (value: number | null | undefined): number | null => {
  if (value === null || value === undefined || isNaN(value)) return null;
  return value;
};

export const sanitizeBoolean = (value: boolean | null | undefined): boolean => {
  return Boolean(value);
};
