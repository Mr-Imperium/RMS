import { USER_ROLES } from './constants';

// Defines a hierarchy for roles. A role includes all permissions of the roles below it.
const HIERARCHY = [
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.STAFF,
    USER_ROLES.VIEWER,
];

/**
 * Defines the specific permissions (capabilities) for each granular action.
 * We assign the MINIMUM role required for this action. The hierarchy check will handle the rest.
 */
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: USER_ROLES.VIEWER,

  // Candidate CRUD
  VIEW_CANDIDATE: USER_ROLES.VIEWER,
  MANAGE_CANDIDATE: USER_ROLES.STAFF,

  // Client CRUD
  VIEW_CLIENT: USER_ROLES.STAFF, // Staff need to see clients for jobs
  MANAGE_CLIENT: USER_ROLES.ADMIN,

  // Job CRUD
  VIEW_JOB: USER_ROLES.STAFF,
  MANAGE_JOB: USER_ROLES.STAFF,

  // Project CRUD
  VIEW_PROJECT: USER_ROLES.STAFF,
  MANAGE_PROJECT: USER_ROLES.STAFF,
  
  // Lineup Management
  MANAGE_LINEUP: USER_ROLES.STAFF,

  // Referrer Management
  MANAGE_REFERRER: USER_ROLES.STAFF,

  // Staff Management (Admin Actions)
  MANAGE_STAFF: USER_ROLES.SUPER_ADMIN,

  // Reporting
  VIEW_REPORTS: USER_ROLES.ADMIN,

  // Settings Management (System Critical)
  MANAGE_SETTINGS: USER_ROLES.SUPER_ADMIN,
};

/**
 * Checks if a user with a given role has the permission for a specific action.
 * @param {string} userRole - The role of the current user (e.g., 'admin').
 * @param {string} requiredRole - The minimum role required for the action (from PERMISSIONS).
 * @returns {boolean} - True if the user has permission, false otherwise.
 */
export const hasPermission = (userRole, requiredRole) => {
    if (!userRole || !requiredRole) return false;

    const userLevel = HIERARCHY.indexOf(userRole);
    const requiredLevel = HIERARCHY.indexOf(requiredRole);

    // If either role is not in the hierarchy, deny permission.
    if (userLevel === -1 || requiredLevel === -1) return false;

    // A user has permission if their level is less than or equal to the required level
    // (since lower index means higher privilege).
    return userLevel <= requiredLevel;
};