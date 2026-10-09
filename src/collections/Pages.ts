import {CollectionConfig} from "payload/types";
import { canCreatePages, canReadPages, canEditDeletePages } from "../access/accessControlPages";
import {SlugField, TitleField} from "../components/fields";

const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    create: canCreatePages,
    read: canReadPages,
    update: canEditDeletePages,
    delete: canEditDeletePages,
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      admin: {
        components: {
          Field: TitleField,
        },
      },
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      admin: {
        components: {
          Field: SlugField,
        },
      },
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
    },
    {
      name: "author",
      label: "Author",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "publish",
      label: "Publish",
      type: "date",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["Draft", "Published"],
    },
  ],
};
export default Pages;
