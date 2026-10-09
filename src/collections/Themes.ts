import { CollectionConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";
import {
  DescriptionField,
  IsActiveField,
  NameField,
  VersionField,
} from "../components/fields";

const Themes: CollectionConfig = {
  slug: "themes",
  labels: {
    singular: "Theme",
    plural: "Themes",
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
      type: "textarea",
      label: "Description",
      admin: {
        components: {
          Field: DescriptionField,
        },
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Is Active",
      admin: {
        components: {
          Field: IsActiveField,
        },
      },
    },
    {
      name: "version",
      type: "text",
      label: "Version",
      admin: {
        components: {
          Field: VersionField,
        },
      },
    },
    // {
    //   name: "screenshot",
    //   type: "upload",
    //   relationTo: "media",
    //   admin: {
    //     position: "sidebar",
    //   },
    // },
  ],
};

export default Themes;
