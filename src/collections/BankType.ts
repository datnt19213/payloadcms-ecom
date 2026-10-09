import {CollectionConfig} from "payload/types";
import {BankingTypes} from "../pages/banking_types";

const BankTypes: CollectionConfig = {
  slug: "bank-types",
  labels: {
    singular: "Bank Types",
    plural: "Bank Types",
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
  admin: {
    components: {
      views: {
        List: BankingTypes,
      },
    },
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "value",
      label: "Value",
      type: "text",
    },
    {
      name: "portal",
      label: "Portal",
      type: "json",
    },
  ],
  timestamps: true,
};

export default BankTypes;
