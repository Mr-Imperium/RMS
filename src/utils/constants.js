/**
 * Defines user roles used throughout the application.
 * Corresponds to the `user_roles` table in the database.
 * The order defines the hierarchy (most privileged first).
 */
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  STAFF: 'staff',
  VIEWER: 'viewer',
};

/**
 * Defines the names of Supabase Storage buckets.
 */
export const STORAGE_BUCKETS = {
  RESUMES: 'resumes',
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
};

/**
 * The maximum file upload size in Megabytes (MB).
 */
export const MAX_FILE_SIZE_MB = 5;

/**
 * Standard date and time formats.
 */
export const DATE_FORMATS = {
  DEFAULT: 'MMMM d, yyyy',
  SHORT: 'MM/dd/yyyy',
  DATETIME: 'MMMM d, yyyy h:mm a',
};