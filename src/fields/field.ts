import { Field } from "payload/types";
import { CustomHasManySelectComponent } from "./component";
import axios from "axios";

export const CustomHasManySelectField: Field = {
  name: "customHasManySelectField",
  type: "text",
  admin: {
    components: {
      Field: CustomHasManySelectComponent,
    },
  },
  hooks: {
    beforeValidate: [
      async ({ value }) => {
        const stringifiedValue = JSON.stringify(value);
        return stringifiedValue;
      },
    ],
    afterChange: [
      async ({ value, req }) => {
        const userId = req.user?.id; // Get user ID from the request object
        const token = req.user?.token; // Get user ID from the request object

        if (!userId) {
          console.error("User ID is not available.");
          return;
        }

        if (!token) {
          console.error("Token is not available.");
          return;
        }

        try {
          const response = await axios.get(
            `http://localhost:3000/get-token/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = response.data;
          console.log("My data: ", data);

          const newToken = data.token;
          if (newToken) {
            const body = {
              name: "Chanel Test 2",
              description: "đây là channel test",
              return_url: "https://payload-cms-sy02.onrender.com/api/channels",
              cancel_url: "https://payload-cms-sy02.onrender.com/api/channels",
              webhook: "https://payload-cms-sy02.onrender.com/api/channels",
              provider: JSON.parse(value), // Use the value here
            };
            try {
              const response = await fetch(
                "https://payload-cms-sy02.onrender.com/api/channels",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newToken}`,
                  },
                  body: JSON.stringify(body),
                }
              );

              const result = await response.json();
              console.log("API Response: ", result);
            } catch (error) {
              return console.log("Error: ", error);
            }
          }
        } catch (error) {
          console.log("Error fetching data: ", error);
        }

        // Gọi API với giá trị và token
        // if (token) {
        //   const body = {
        //     name: "Chanel Test 2",
        //     description: "đây là channel test",
        //     return_url: "https://payload-cms-sy02.onrender.com/api/channels",
        //     cancel_url: "https://payload-cms-sy02.onrender.com/api/channels",
        //     webhook: "https://payload-cms-sy02.onrender.com/api/channels",
        //     provider: JSON.parse(value), // Use the value here
        //   };
        //   try {
        //     const response = await fetch(
        //       "https://payload-cms-sy02.onrender.com/api/channels",
        //       {
        //         method: "POST",
        //         headers: {
        //           "Content-Type": "application/json",
        //           Authorization: `Bearer ${token}`,
        //         },
        //         body: JSON.stringify(body),
        //       }
        //     );

        //     const result = await response.json();
        //     console.log("API Response: ", result);
        //   } catch (error) {
        //     return console.log("Error: ", error);
        //   }
        // } else {
        //   console.error("No user token found.");
        // }
      },
    ],
  },
};
