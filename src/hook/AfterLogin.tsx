import type { AfterChangeHook } from "payload/dist/collections/config/types";
import axios from "axios";
import payload from "payload";

export const loginAfterCreate: AfterChangeHook = async ({
  doc,
  req,
  req: { payload, body = {}, res },
  operation,
}) => {
  if (operation === "create") {
    const { email, password } = body;

    if (email && password) {
      try {
        // Log in the user
        const { user, token: initialToken } = await payload.login({
          collection: "users",
          data: { email, password },
          req,
          res,
        });

        console.log("User created and logged in: ", user);

        const loginCMS = async () => {
          const response = await axios.post(
            `${process.env.PAYLOAD_PAYMENT_GATEWAY}/api/users/login`,
            {
              email: process.env.PAYLOAD_USER,
              password: process.env.PAYLOAD_PASSWORD,
            }
          );

          if (initialToken) {
            const token = response.data.token;

            const createUser = await axios.post(
              `${process.env.PAYLOAD_PAYMENT_GATEWAY}/api/users`,
              { email: email, password: password },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("User: ", createUser)
            if(createUser) {
              const response = await axios.post(
                `${process.env.PAYLOAD_PAYMENT_GATEWAY}/api/users/login`,
                {
                  email: email,
                  password: password,
                }
              );
              if(response) {
                const newToken = response.data.token
                setTimeout(async () => {
                  try {
                    const response = await axios.post(
                      "http://localhost:3000/save-token",
                      {
                        userId: user.id,
                        token: newToken,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${initialToken}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    console.log("Token saved response:", response.data);
                  } catch (error) {
                    console.error("Failed to save token via API:", error);
                  }
                }, 2000);
              }
            }
          }
        };

        await loginCMS();

        // Function to get a new token with retry logic
        const getToken = async (retries = 3) => {
          for (let attempt = 1; attempt <= retries; attempt++) {
            try {
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

              return response.data.access_token;
            } catch (error) {
              if (attempt < retries) {
                console.warn(`Attempt ${attempt} failed, retrying...`);
              } else {
                console.error(
                  "All attempts failed. Error:",
                  error.response?.data || error.message
                );
                throw error;
              }
            }
          }
        };

        // Get a new token
        const newToken = await getToken();

        setTimeout(async () => {
          // Update the user's document with the new token
          await payload.update({
            collection: "users",
            id: user.id,
            data: { token: newToken },
          });
        }, 2000);

        console.log("Token updated for user:", user.email);
      } catch (error) {
        console.error(
          "Error logging in or updating token after create:",
          error.message
        );
      }
    }
  }

  return doc;
};
