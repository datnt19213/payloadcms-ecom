import {GlobalConfig} from "payload/types";
import payload from "payload";
import {isAdmin} from "../access/isAdmin";
import {PaymentSettings} from "../pages/payment_settings";

const PaymentSetting: GlobalConfig = {
  slug: "payment-settings",
  label: "Payment Settings",
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  admin: {
    components: {
      views: {
        Edit: PaymentSettings,
      },
    },
  },
  fields: [
    {
      name: "settings",
      type: "array",
      fields: [
        {
          name: "options",
          type: "json",
        },
        {
          name: "portal_list",
          type: "array",
          fields: [
            {
              name: "portal",
              type: "json",
            },
            {
              name: "enabled",
              type: "text",
            },
            {
              name: "childrens",
              type: "json",
            },
          ],
        },
      ],
    },
  ],

  endpoints: [
    {
      path: "/get-payments",
      method: "get",
      handler: async (req, res, next) => {
        try {
          await payload
            .findGlobal({
              slug: "payment-settings",
              depth: 4,
            })
            .then((paymentSettings) => {
              console.log(JSON.stringify(paymentSettings));

              if (paymentSettings) {
                return res.status(200).send({
                  status: 200,
                  data: paymentSettings,
                });
              } else {
                return res.status(404).send({error: "No data", status: 400});
              }
            });
        } catch (error) {
          return res
            .status(500)
            .send({error: error.message, message: "Get data failed"});
        }
      },
    },
  ],
};

export default PaymentSetting;
