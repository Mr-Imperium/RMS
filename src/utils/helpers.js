/**
 * Formats a date string or Date object into a more readable format.
 * @param {string|Date} dateInput - The date to format.
 * @param {string} [format='DEFAULT'] - The desired format key from DATE_FORMATS.
 * @returns {string} The formatted date string, or an empty string if input is invalid.
 */
import { DATE_FORMATS } from './constants';
import { format } from 'date-fns';

export const formatDate = (dateInput, formatKey = 'DEFAULT') => {
  if (!dateInput) return '';
  try {
    const date = new Date(dateInput);
    const formatString = DATE_FORMATS[formatKey] || DATE_FORMATS.DEFAULT;
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Parses a Supabase error object to return a user-friendly message.
 * @param {object} error - The error object from a Supabase response.
 * @returns {string} A user-friendly error message.
 */
export const parseSupabaseError = (error) => {
  if (!error) return 'An unknown error occurred.';
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * A simple email validation regex helper for forms.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email format is valid.
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
