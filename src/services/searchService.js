import { supabase } from '../api/supabaseClient';

/**
 * Executes a global search across multiple entities using the RPC function.
 * @param {string} searchTerm - The text to search for.
 * @returns {Promise<{data: Array<object>, error: object|null}>}
 */
export const executeGlobalSearch = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return { data: [], error: null };
  }
  
  const { data, error } = await supabase.rpc('global_search', {
    p_search_term: searchTerm,
  });

  return { data, error };
};