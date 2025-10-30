import { supabase } from '../api/supabaseClient';
/**
Sends an email using a pre-defined template.
@param {object} params
@param {string} params.to - The recipient's email address.
@param {string} params.templateId - The ID of the template from the database.
@param {object} [params.data={}] - An object with data to fill in template variables.
@param {object} [params.entity] - Optional object to link the email log (e.g., {type: 'candidate', id: 'uuid'}).
@returns {Promise<{data: object, error: object|null}>}
*/
export const sendTemplatedEmail = async ({ to, templateId, data = {}, entity }) => {
const { data: responseData, error } = await supabase.functions.invoke('send-email', {
body: { to, templateId, data, entity },
});