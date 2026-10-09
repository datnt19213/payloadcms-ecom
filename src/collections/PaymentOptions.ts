import {CollectionConfig, GlobalConfig} from "payload/types";
import {isAdmin} from "../access/isAdmin";

const PaymentOptions: CollectionConfig = {
  slug: "payment_options",
  labels: {
    plural: "Payment Options",
    singular: "Payment Options",
  },
  access: {
    create: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("editor")),
    read: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("editor")),
    update: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("editor")),
    delete: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("editor")),
  },
  fields: [
    {
      name: "label",
      type: "text",
    },
    {
      name: "value",
      type: "text",
    },
    {
      name: "enable",
      type: "text",
    },
  ],
};

export default PaymentOptions;
