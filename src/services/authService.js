import { supabase } from '../api/supabaseClient';

/**
 * Signs in a user with their email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{data: object, error: object|null}>} An object containing the user session data or an error.
 */
export const signInWithPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

/**
 * Signs up a new user.
 * By default, Supabase sends a confirmation email.
 * @param {string} email - The new user's email.
 * @param {string} password - The new user's password.
 * @param {object} [options] - Additional user metadata.
 * @returns {Promise<{data: object, error: object|null}>} An object containing the user data or an error.
 */
export const signUpNewUser = async (email, password, options = {}) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: options, // e.g., { full_name: 'John Doe', role_id: 2 }
        },
    });
    return { data, error };
};

/**
 * Signs out the currently authenticated user.
 * @returns {Promise<{error: object|null}>} An object containing an error if one occurred.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Gets the current authenticated user's data from the `auth.users` table.
 * @returns {Promise<import('@supabase/supabase-js').User|null>} The user object or null if not authenticated.
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Gets the current active session.
 * This is useful for checking if a user is logged in upon application load.
 * @returns {Promise<import('@supabase/supabase-js').Session|null>} The session object or null.
 */
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Sends a password reset email to the user.
 * @param {string} email - The user's email address.
 * @returns {Promise<{data: object, error: object|null}>} A promise that resolves when the email is sent.
 */
export const sendPasswordResetEmail = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // URL to your password reset page
    });
    return { data, error };
};

/**
 * Updates the user's password. This should be used on the password reset page.
 * @param {string} newPassword - The new password.
 * @returns {Promise<{data: object, error: object|null}>} An object containing user data or an error.
 */
export const updateUserPassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
};

/**
 * Listens for changes in the authentication state (e.g., SIGN_IN, SIGN_OUT).
 * @param {function} callback - The function to call when the auth state changes.
 * @returns {import('@supabase/supabase-js').Subscription} The subscription object, which can be used to unsubscribe.
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChanged((event, session) => {
    callback(event, session);
  });
  return subscription;
};
