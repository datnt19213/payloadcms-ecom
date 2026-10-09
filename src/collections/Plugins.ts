import { CollectionConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";
import {
  DescriptionField,
  IsActiveField,
  NameField,
  VersionField,
} from "../components/fields";

const Plugins: CollectionConfig = {
  slug: "plugins",
  labels: {
    singular: "Plugin",
    plural: "Plugins",
  },
  timestamps: true,
  access: {
    create: isAdmin,
    delete: isAdmin,
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      admin: {
        components: {
          Field: NameField,
        },
      },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      admin: {
        components: {
          Field: DescriptionField,
        },
      },
    },
    {
      name: "isActive",
      label: "Is Active",
      type: "checkbox",
      admin: {
        components: {
          Field: IsActiveField,
        },
      },
    },
    {
      name: "version",
      label: "Version",
      type: "text",
      admin: {
        components: {
          Field: VersionField,
        },
      },
    },
  ],
};

export default Plugins;
