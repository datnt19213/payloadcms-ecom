import {CollectionConfig} from "payload/types";
import {SaveButton} from "../components/buttons";
import {OrderManagement} from "../pages/orders";

const Orders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: "Orders",
    plural: "Orders",
  },
  admin: {
    components: {
      views: {
        List: OrderManagement,
      },
      edit: {
        SaveButton: SaveButton,
      },
    },
  },
  access: {
    read: ({req: {user}}) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    create: ({req: {user}}) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    update: ({req: {user}}) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    delete: ({req: {user}}) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
  },
  fields: [],
  timestamps: true,
};

export default Orders;
