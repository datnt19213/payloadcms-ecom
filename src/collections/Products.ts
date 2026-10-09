import {CollectionConfig} from "payload/types";

import {SaveButton} from "../components/buttons";
import {ProductManagement} from "../pages/product";
const Products: CollectionConfig = {
  slug: "products",

  // auth: true,
  admin: {
    components: {
      views: {
        List: ProductManagement,
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
  fields: [
    // {
    //   name: "name",
    //   label: "Name",
    //   type: "text",
    //   required: true,
    //   admin: {
    //     components: {
    //       Field: NameField,
    //     },
    //   },
    // },
    // {
    //   name: "description",
    //   label: "Description",
    //   type: "textarea",
    //   required: false,
    //   admin: {
    //     components: {
    //       Field: DescriptionField,
    //     },
    //   },
    // },
    // {
    //   name: "price",
    //   label: "Price",
    //   type: "number",
    //   required: true,
    //   admin: {
    //     components: {
    //       Field: PriceField,
    //     },
    //   },
    // },
    // {
    //   name: "inStock",
    //   label: "In Stock",
    //   type: "checkbox",
    //   required: false,
    //   admin: {
    //     components: {
    //       Field: InStockField,
    //     },
    //   },
    // },
  ],
};

export default Products;
