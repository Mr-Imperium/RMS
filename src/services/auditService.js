import { supabase } from '../api/supabaseClient';
import { format } from 'date-fns';

/**
 * Queries the audit log with flexible filters.
 * @param {object} filters
 * @returns {Promise<{data: Array, count: number, error: object}>}
 */
export const queryAuditLogs = async (filters) => {
  const { userId, entityTable, startDate, endDate, page = 1, pageSize = 25 } = filters;
  
  let query = supabase
    .from('audit_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (userId) query = query.eq('user_id', userId);
  if (entityTable) query = query.eq('entity_table', entityTable);
  if (startDate) query = query.gte('created_at', format(startDate, 'yyyy-MM-dd HH:mm:ss'));
  if (endDate) query = query.lte('created_at', format(endDate, 'yyyy-MM-dd HH:mm:ss'));
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  return { data, count, error };
};

/**
 * Logs a system event (e.g., a caught error) to the database.
 * @param {'INFO'|'WARNING'|'ERROR'} level
 * @param {string} message - A human-readable summary of the event.
 * @param {object} [context] - A JSON object with detailed context (e.g., stack trace, component info).
 */
export const logSystemEvent = async (level, message, context = {}) => {
    // We use .then() to make this a "fire-and-forget" operation.
    // The UI should not wait for the log to be written.
    supabase.from('system_log').insert({ level, message, context }).then(({ error }) => {
        if (error) {
            console.error("Failed to log system event:", error.message);
        }
    });
};