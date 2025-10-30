import { supabase } from '../api/supabaseClient';
import { MAX_FILE_SIZE_MB } from '../utils/constants';

/**
 * Uploads a file to a specified private Supabase Storage bucket.
 * The file is associated with a specific entity (e.g., a candidate).
 * @param {File} file - The file object to upload.
 * @param {string} bucketName - The name of the storage bucket.
 * @param {string} entityId - The ID of the entity this file belongs to (e.g., candidateId).
 * @returns {Promise<{data: object, error: object|null}>} An object containing the final file path or an error.
 */
export const uploadEntityFile = async (file, bucketName, entityId) => {
  // Validate file size on the client-side for better UX
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { data: null, error: { message: `File size cannot exceed ${MAX_FILE_SIZE_MB}MB.` } };
  }

  // Sanitize filename to remove special characters
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const filePath = `${entityId}/${Date.now()}_${sanitizedFileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {
    return { data: null, error };
  }
  
  // Return the path for storing in the database
  return { data: { path: data.path }, error: null };
};

/**
 * Creates a temporary signed URL to download a private file.
 * @param {string} bucketName - The name of the storage bucket.
 * @param {string} filePath - The path to the file within the bucket.
 * @param {number} [expiresIn=60] - The duration in seconds for which the URL is valid.
 * @returns {Promise<{data: object, error: object|null}>} An object containing the signed URL or an error.
 */
export const createSignedUrl = async (bucketName, filePath, expiresIn = 60) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);
  return { data, error };
};

/**
 * Deletes a file from a Supabase Storage bucket.
 * @param {string} bucketName - The name of the storage bucket.
 * @param {string} filePath - The path of the file to delete.
 * @returns {Promise<{data: object, error: object|null}>} An object containing deletion info or an error.
 */
export const deleteFile = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);
  return { data, error };
};