import { CollectionConfig } from "payload/types";
import path from "path";
import { NameField, SlugField } from "../components/fields";
import { CategoriesTable } from "../components/tables";
import { SaveButton } from "../components/buttons";
import {CategoryManagement} from "../pages/categories_products";

const staticDir = path.resolve(__dirname, "../media/images");

const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "Category",
    plural: "Categories",
  },
  upload: {
    staticDir,
    crop: true,
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
        List: CategoryManagement,
      },
      edit: {
        SaveButton: SaveButton,
      },
    },
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
    //   name: "slug",
    //   label: "Slug",
    //   type: "text",
    //   required: true,
    //   unique: true,
    //   admin: {
    //     components: {
    //       Field: SlugField,
    //     },
    //   },
    // },
    // {
    //   name: "description",
    //   label: "Description",
    //   type: "richText",
    // },
    // {
    //   name: "parentCategory",
    //   label: "Parent Category",
    //   type: "relationship",
    //   relationTo: "categories",
    //   hasMany: true,
    // },
  ],
};

export default Categories;
