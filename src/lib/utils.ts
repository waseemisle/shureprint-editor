import { Variant } from '@/types';

/**
 * Converts snake_case/camelCase keys to readable words
 */
export const formatKeyToWords = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
};

/**
 * Maps common values to more readable formats
 */
export const formatValue = (value: string): string => {
  const lowerValue = value.toLowerCase();
  
  // Handle numbers
  if (/^\d+$/.test(value)) {
    return `${value} Colors`;
  }
  
  // Handle common words
  const mappings: Record<string, string> = {
    'yes': 'Yes',
    'no': 'No',
    'true': 'Yes',
    'false': 'No',
    'included': 'Included',
    'standard': 'Standard',
    'kraft': 'Kraft',
    'white': 'White',
    'black': 'Black'
  };
  
  return mappings[lowerValue] || value;
};

/**
 * Converts variant options to plain English display
 */
export const formatVariantOptions = (variant: Variant): string => {
  const optionStrings = Object.entries(variant.options)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      const formattedKey = formatKeyToWords(key);
      const formattedValue = formatValue(value!);
      return `${formattedKey}: ${formattedValue}`;
    });
  
  return optionStrings.join(' · ');
};

/**
 * Creates the full display string for a variant
 */
export const getVariantDisplayString = (variant: Variant): string => {
  const optionsString = formatVariantOptions(variant);
  return `${variant.sku} — ${optionsString}`;
};
