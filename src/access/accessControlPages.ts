import type { Access } from "payload/types";

// Access control for creating pages
export const canCreatePages: Access = ({ req: { user } }) => {
  return (
    user && (user.roles.includes("admin") || user.roles.includes("editor")) // Excluding contributor and author from create permission
  );
};

// Access control for reading pages
export const canReadPages: Access = ({ req: { user } }) => {
  if (!user) return false; // User must be logged in to view pages

  if (user.roles.includes("admin")) {
    return true;
  }

  if (user.roles.includes("editor")) {
    return {
      author: {
        equals: user.id, // Editors can read their own pages
      },
    };
  }

  return false; // Excluding contributors and authors from read permission
};

// Access control for editing and deleting pages
export const canEditDeletePages: Access = ({ req: { user } }) => {
  if (!user) return false;

  if (user.roles.includes("admin") || user.roles.includes("editor")) {
    return true;
  }

  return false; // Excluding contributors and authors from edit/delete permission
};
