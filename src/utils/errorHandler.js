import { logSystemEvent } from '../services/auditService';

/**
 * Standardized error object format for our application.
 * @typedef {object} AppError
 * @property {string} userMessage - A clean, user-friendly message to show in UI notifications.
 * @property {string} devMessage - The original, detailed error message for debugging.
 * @property {number|null} statusCode - The HTTP status code, if applicable.
 */

/**
 * Centralized function to process errors from various sources and standardize them.
 * This is the single source of truth for interpreting what an error means.
 * @param {any} error - The raw error object (from Supabase, Axios, etc.).
 * @param {string} [context='An unexpected error occurred'] - Contextual information for where the error happened.
 * @returns {AppError} A standardized error object.
 */
export const handleError = (error, context = 'An unexpected error occurred') => {
    let userMessage = 'Something went wrong on our end. Please try again or contact support.';
    let devMessage = error?.message || 'Unknown client-side error';
    let statusCode = error?.status || null;

    // Handle Supabase PostgREST and Auth errors
    if (error && typeof error.message === 'string') {
        devMessage = `Supabase Error: ${error.message}`;
        if (error.message.toLowerCase().includes('network error') || error.message.toLowerCase().includes('failed to fetch')) {
            userMessage = 'Unable to connect. Please check your internet connection.';
            statusCode = 503; // Service Unavailable
        } else if (error.message.includes('Invalid login credentials')) {
            userMessage = 'The email or password you entered is incorrect.';
            statusCode = 401;
        } else if (error.message.includes('duplicate key value violates unique constraint')) {
            userMessage = 'An item with this identifier already exists. Please use a unique value.';
            statusCode = 409; // Conflict
        } else if (error.message.includes('violates row-level security policy')) {
            userMessage = 'You do not have permission to perform this action.';
            statusCode = 403; // Forbidden
        }
    }
    
    // Log the detailed, processed error to our backend for analysis.
    logSystemEvent('ERROR', context, {
        originalError: devMessage,
        statusCode: statusCode,
    });

    return { userMessage, devMessage, statusCode };
};