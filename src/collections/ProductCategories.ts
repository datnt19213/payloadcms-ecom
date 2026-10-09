import { CollectionConfig } from "payload/types";
import { CategoryProduct } from "../pages/categories_products";

const ProductCategories: CollectionConfig = {
  slug: "product-categories",
  labels: {
    singular: "Categories",
    plural: "Categories",
  },
  access: {
    create: ({ req: { user } }) =>
      user && (user.roles.includes("admin") || user.roles.includes("manager")),
    read: ({ req: { user } }) =>
      user && (user.roles.includes("admin") || user.roles.includes("manager")),
    update: ({ req: { user } }) =>
      user && (user.roles.includes("admin") || user.roles.includes("manager")),
    delete: ({ req: { user } }) =>
      user && (user.roles.includes("admin") || user.roles.includes("manager")),
  },
  admin: {
    components: {
      views: {
        List: CategoryProduct,
      },
    },
  },
  fields: [],
};

export default ProductCategories;
