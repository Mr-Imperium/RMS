import { supabase } from '../api/supabaseClient';
import { STORAGE_BUCKETS, MAX_FILE_SIZE_MB } from '../utils/constants';

/**
 * Uploads a file to a specified Supabase Storage bucket.
 * @param {File} file - The file object to upload.
 * @param {string} bucketName - The name of the storage bucket (e.g., 'resumes').
 * @param {string} [filePath] - Optional specific path/filename. If not provided, a timestamped name is used.
 * @returns {Promise<{data: object, error: object|null}>} An object containing file metadata or an error.
 */
export const uploadFile = async (file, bucketName, filePath) => {
  // Validate file type and size
  if (!Object.values(STORAGE_BUCKETS).includes(bucketName)) {
    return { data: null, error: { message: 'Invalid storage bucket specified.' } };
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { data: null, error: { message: `File size cannot exceed ${MAX_FILE_SIZE_MB}MB.` } };
  }

  const finalFilePath = filePath || `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(finalFilePath, file);

  return { data, error };
};

/**
 * Downloads a file from a Supabase Storage bucket.
 * @param {string} bucketName - The name of the storage bucket.
 * @param {string} filePath - The path to the file within the bucket.
 * @returns {Promise<{data: Blob, error: object|null}>} An object containing the file Blob or an error.
 */
export const downloadFile = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(filePath);
  return { data, error };
};

/**
 * Deletes a file from a Supabase Storage bucket.
 * @param {string} bucketName - The name of the storage bucket.
 * @param {string[]} filePaths - An array of file paths to delete.
 * @returns {Promise<{data: object, error: object|null}>} An object containing deletion info or an error.
 */
export const deleteFile = async (bucketName, filePaths) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove(filePaths);
  return { data, error };
};

/**
 * Gets the public URL for a file in a storage bucket.
 * The bucket must be configured for public access in the Supabase dashboard.
 * @param {string} bucketName - The name of the storage bucket.
 * @param {string} filePath - The path to the file within the bucket.
 * @returns {{publicUrl: string}|null} An object with the public URL, or null if the path is invalid.
 */
export const getPublicUrl = (bucketName, filePath) => {
  if (!filePath) return null;

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return data;
};