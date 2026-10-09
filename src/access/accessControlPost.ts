import type { Access, FieldAccess } from "payload/types";

// Access control for creating posts
export const canCreate: Access = ({ req: { user } }) => {
  return (
    user &&
    (user?.roles?.includes("admin") ||
      user?.roles?.includes("editor") ||
      user?.roles?.includes("author") ||
      user?.roles?.includes("contributor"))
  );
};

// Access control for reading posts
export const canRead: Access = ({ req: { user } }) => {
  if (!user) return false; // User must be logged in to view posts

  if (user.roles.includes("admin") || user.roles.includes("subscriber")) {
    return true;
  }

  if (
    user.roles.includes("editor") ||
    user.roles.includes("author") ||
    user.roles.includes("contributor")
  ) {
    return {
      author: {
        equals: user.id, // Assuming the 'author' field in the posts stores the user ID
      },
    };
  }

  return false; // Default case if none of the roles match
};

// Access control for editing posts
export const canEdit: Access = ({ req: { user }, id }) => {
  if (!user) return false;

  if (user.roles.includes("admin") || user.roles.includes("editor")) {
    return true;
  }

  if (user.roles.includes("author")) {
    return {
      author: {
        equals: user.id, // Authors can edit their own posts
      },
    };
  }

  if (user.roles.includes("contributor")) {
    return {
      and: [
        {
          author: {
            equals: user.id, // Contributors can edit their own posts
          },
        },
        {
          status: {
            not_equals: "published", // Contributors cannot edit published posts
          },
        },
      ],
    };
  }

  return false;
};

// Access control for deleting posts
export const canDelete: Access = ({ req: { user } }) => {
  if (!user) return false;

  if (user?.roles?.includes("admin") || user?.roles?.includes("editor")) {
    return true;
  }

  if (user?.roles?.includes("author")) {
    return {
      author: {
        equals: user?.id, // Authors can delete their own posts
      },
    };
  }

  return false; // Contributors cannot delete any posts
};

export const restrictContributorStatusChange: FieldAccess = ({
  req: { user },
}) => {
  return Boolean(!user?.roles?.includes("contributor"));
};

export const isSubscriber: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes("subscriber"));
};
