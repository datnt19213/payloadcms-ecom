import { CollectionConfig } from "payload/types";
import {
  canCreate,
  canRead,
  canEdit,
  canDelete,
  restrictContributorStatusChange,
  isSubscriber,
} from "../access/accessControlPost";
import {SlugField, TitleField} from "../components/fields";

const Posts: CollectionConfig = {
  slug: "posts",
  timestamps: true,
  auth: false,
  access: {
    create: canCreate,
    read: canRead,
    update: canEdit,
    delete: canDelete,
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
      access: {
        read: ({ req: { user } }) => !user.roles.includes('subscriber'),
      },
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        components: {
          Field: SlugField,
        },
      },
      access: {
        read: ({ req: { user } }) => !user.roles.includes('subscriber'),
      },
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      required: true,
    },
    {
      name: "commnent",
      type: "textarea",
      required: true,
    },
    {
      name: "author",
      label: "Author",
      type: "relationship",
      relationTo: "users",
      required: true,
      access: {
        read: ({ req: { user } }) => !user.roles.includes('subscriber'),
      },
    },
    {
      name: "publishDate",
      label: "Publish Date",
      type: "date",
      access: {
        read: ({ req: { user } }) => !user.roles.includes('subscriber'),
        create: restrictContributorStatusChange,
        update: restrictContributorStatusChange,
      },
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: [
        {label: "Draft", value: "draft"},
        {label: "Published", value: "published"},
      ],
      defaultValue: "draft",
      access: {
        read: ({ req: { user } }) => !user.roles.includes('subscriber'),
        create: restrictContributorStatusChange,
        update: restrictContributorStatusChange,
      },
    },
    {
      name: "categories",
      label: "Categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      access: {
        read: ({ req: { user } }) => !user.roles.includes('subscriber'),
        create: ({ req: { user } }) => !user.roles.includes('author') && !user?.roles?.includes('contributor'),
        update: ({ req: { user } }) => !user.roles.includes('author') && !user?.roles?.includes('contributor'),
      },
    },
    {
      name: "tags",
      label: "Tags",
      type: "array",
      fields: [
        {
          type: "text",
          name: "tag_name",
          label: "Tag name",
        },
      ],
      access: {
        read: ({ req: { user } }) => !user.roles.includes('subscriber') ,
      },
    },
  ],
};

export default Posts;
