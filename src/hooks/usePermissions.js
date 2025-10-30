import { useAppSelector } from '../app/hooks';
import { selectCurrentUserProfile } from '../features/auth/authSlice';
import { hasPermission } from '../utils/permissions';

/**
 * A custom hook to easily check for user permissions within components.
 * Returns the user's role and a `can` function for checking capabilities.
 */
const usePermissions = () => {
    const userProfile = useAppSelector(selectCurrentUserProfile);
    const userRole = userProfile?.role;

    /**
     * Checks if the current user's role grants permission for a specific action.
     * @param {string} requiredRole - The minimum role required (from PERMISSIONS object).
     * @returns {boolean}
     */
    const can = (requiredRole) => {
        return hasPermission(userRole, requiredRole);
    };

    return { can, userRole };
};

export default usePermissions;