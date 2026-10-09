import { CollectionConfig } from "payload/types";
import { Discount } from "../pages/discount";

const Discounts: CollectionConfig = {
  slug: "discount",
  labels: {
    singular: "Discount",
    plural: "Discount",
  },
  admin: {
    components: {
      views: {
        List: Discount,
      },
    },
  },
  access: {
    read: ({ req: { user } }) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    create: ({ req: { user } }) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    update: ({ req: { user } }) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    delete: ({ req: { user } }) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
  },
  fields: [],
};

export default Discounts;
