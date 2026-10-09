import { CollectionConfig } from "payload/types";
import { isAdmin, isAdminFieldLevel } from "../access/isAdmin";
import { isAdminOrSelf } from "../access/isAdminOrSelf";
import { loginAfterCreate } from "../hook/AfterLogin";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import payload from "payload";

const Users: CollectionConfig = {
  slug: "users",
  timestamps: true,
  auth: {
    tokenExpiration: 86400,
    // verify: true, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000,
    depth: 0,
    useAPIKey: true,
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  // admin: {
  //   components: {
  //     views: {
  //       List: UserComponent,
  //     },
  //   },
  // },
  fields: [
    {
      name: "roles",
      saveToJWT: true,
      type: "select",
      hasMany: false,
      defaultValue: "editor",
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
        {
          label: "Author",
          value: "author",
        },
        {
          label: "Contributor",
          value: "contributor",
        },
        {
          label: "Subscriber",
          value: "subscriber",
        },
        {
          label: "Shop Manager",
          value: "manager",
        },
      ],
      required: true,
    },
    {
      name: "token",
      type: "text",
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterLogin: [
      async ({ user }) => {
        try {
          let needsTokenUpdate = true;
          const currentToken = user.token;

          if (currentToken) {
            const decoded = jwtDecode(currentToken);
            const currentTime = Math.floor(Date.now() / 1000); // Time in seconds since epoch in UTC
            if (currentTime < decoded.exp) {
              console.log("Current token is still valid");
              needsTokenUpdate = false;
            }
          }

          if (needsTokenUpdate) {
            const response = await axios.post(
              `${process.env.MEDUSA_BACKEND}/admin/auth/token`,
              {
                email: process.env.MEDUSA_USER,
                password: process.env.MEDUSA_PASSWORD,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const token = response.data.access_token;
            const decodedNewToken = jwtDecode(token);
            const expirationDate = new Date(decodedNewToken.exp * 1000); // Convert exp to milliseconds

            // Cập nhật token vào profile của user
            await payload.update({
              collection: "users",
              id: user.id,
              data: { token },
            });

            console.log(
              "Token updated for user:",
              user.email,
              "expires at (UTC):",
              expirationDate.toISOString()
            );
          }
        } catch (error) {
          console.error("Error updating token:", error);
        }
      },
    ],
  },
};

export default Users;
