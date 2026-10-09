import {CollectionConfig} from "payload/types";
import {CustomerManagement} from "../pages/customers";
import {SaveButton} from "../components/buttons";

const Customers: CollectionConfig = {
  slug: "customers",
  labels: {
    singular: "Customers",
    plural: "Customers",
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
        List: CustomerManagement,
      },
      edit: {
        SaveButton: SaveButton,
      },
    },
  },
  fields: [],
  timestamps: true,
};

export default Customers;
