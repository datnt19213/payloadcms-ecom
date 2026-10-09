import { Access } from 'payload/types';

export const isAdminOrHasSiteAccess: Access = ({ req: { user } }) => {
  // Ensure the user is logged in
  if (!user) {
    return false;
  }

  // Allow 'admin' users unrestricted access
  if (user.roles && user.roles.includes('admin')) {
    return true;
  }

  // Conditional access for 'editor' users based on assigned sites
  if (user.roles && user.roles.includes('editor')) {
    // Check if the user has specific sites assigned (user.sites should be an array of site IDs)
    if (user.sites && user.sites.length > 0) {
      return {
        or: [
          // Documents assigned to one of the user's sites
          { site: { in: user.sites } },
          // Documents not assigned to any site
          { site: { exists: false } }
        ]
      };
    }
  }

  // Default to denying access if none of the above conditions are met
  return false;
};
