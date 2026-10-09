import {CollectionConfig} from "payload/types";
import {BankingsManagement} from "../pages/bankings";

const Bankings: CollectionConfig = {
  slug: "bankings",
  labels: {
    plural: "Bankings",
    singular: "Bankings",
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
        List: BankingsManagement,
      },
    },
  },
  fields: [
    {
      name: "image",
      label: "Image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "value",
      label: "Value",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "type",
      label: "Type",
      type: "json",
    },
  ],
};

export default Bankings;
