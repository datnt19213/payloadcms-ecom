import {CollectionConfig, GlobalConfig} from "payload/types";
import {
  EmailField,
  NameField,
  PrimaryColorField,
  SecondaryColorField,
  SiteNameField,
  URLField,
  URLNameField,
} from "../components/fields";
import {SettingsPage} from "../pages/settings_and_configurations";
import payload from "payload";

const SettingConfigurations: GlobalConfig = {
  slug: "settings",
  label: "Settings",
  access: {
    read: () => true,
    update: ({req: {user}}) => user.roles.includes("admin"),
  },
  admin: {
    components: {
      views: {
        Edit: SettingsPage,
      },
    },
  },
  fields: [
    {
      name: "site_name",
      label: "Site Name",
      type: "text",
    },
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "primary_color",
      label: "Primary Color",
      type: "text",
    },
    {
      name: "secondary_color",
      label: "Secondary Color",
      type: "text",
    },
    {
      name: "contact_email",
      label: "Contact Email",
      type: "email",
    },
    {
      name: "social_links",
      label: "Social Links",
      type: "array",
      fields: [
        {
          name: "logo",
          label: "Logo",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "name",
          label: "Name",
          type: "text",
        },
        {
          name: "url",
          label: "URL",
          type: "text",
        },
      ],
    },
    {
      name: "sliders",
      label: "Sliders",
      type: "array",
      fields: [
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "title",
          label: "Title",
          type: "text",
        },
        {
          name: "color",
          label: "Text Color",
          type: "text",
        },
        {
          name: "subtitle",
          label: "Subtitle",
          type: "text",
        },
        {
          name: "url",
          label: "URL",
          type: "text",
        },
      ],
    },
  ],

  endpoints: [
    {
      path: "/get-settings",
      method: "get",
      handler: async (req, res, next) => {
        try {
          await payload
            .findGlobal({
              slug: "settings",
              depth: 4,
            })
            .then((settings) => {
              console.log(JSON.stringify(settings));

              if (settings) {
                return res.status(200).send({
                  status: 200,
                  data: settings,
                });
              } else {
                return res.status(404).send({error: "No data", status: 400});
              }
            });
        } catch (error) {
          return res
            .status(500)
            .send({error: error.message, message: "Get data failed"});
        }
      },
    },
  ],
};

export default SettingConfigurations;
