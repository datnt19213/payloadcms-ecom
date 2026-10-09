import {CollectionConfig, GlobalConfig} from "payload/types";
import {
  SlugField,
  TitleField,
  URLField,
  LinkTextField,
  OrderField,
  MenuTypeField,
  TitleSetForField,
  SlugDisableField,
  HierarchicalFieldTwo,
  HierarchicalFieldOne,
  HierarchicalFieldThree,
  HierarchicalNameFieldThree,
  HierarchicalNameFieldOne,
  HierarchicalNameFieldTwo,
} from "../components/fields";
import {SaveButton} from "../components/buttons";
import {Button} from "../components/ui/button";
import {Enum, MenuType} from "../common/data";
import path from "path";
import payload from "payload";
import {MenusManagement} from "../pages/menus";
import {APIGet} from "../api";
import {buildHierarchy} from "../utils";
import {useAuth} from "payload/components/utilities";
import axios from "axios";

const staticDir = path.resolve(__dirname, "../media/images");

const Menus: CollectionConfig = {
  slug: "menus",
  labels: {
    plural: "Menus",
    singular: "Menus",
  },
  timestamps: true,
  access: {
    create: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("author")),
    read: () => true,
    update: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("author")),
    delete: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("author")),
  },
  admin: {
    components: {
      edit: {
        SaveButton: SaveButton,
      },
      views: {
        List: MenusManagement,
      },
    },
  },
  // upload: {
  //   staticDir,
  //   crop: true,
  // },
  fields: [
    {
      name: "title",
      label: "Title",
      required: true,
      type: "text",
      admin: {
        components: {
          Field: TitleSetForField,
        },
      },
    },
    {
      name: "slug",
      label: "Slug",
      required: true,
      type: "text",
      admin: {
        components: {
          Field: SlugDisableField,
        },
      },
    },
    {
      name: "menuType",
      label: "Menu Type",
      type: "text",
      admin: {
        components: {
          Field: MenuTypeField,
        },
      },
    },
    {
      name: "items",
      label: "Items",
      type: "array",
      fields: [
        {
          name: "icon",
          label: "Icon",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "title",
          label: "Title ",
          type: "text",
          admin: {
            components: {
              Field: HierarchicalNameFieldOne,
            },
          },
        },
        {
          name: "menuId",
          label: "Menu Level 1 ",
          type: "text",
          admin: {
            components: {
              Field: HierarchicalFieldOne,
            },
          },
        },
        {
          name: "order",
          label: "Order",
          type: "number",
          admin: {
            components: {
              Field: OrderField,
            },
          },
        },
        {
          name: "subItems",
          label: "First Sub Items",
          type: "array",
          fields: [
            {
              name: "icon",
              label: "Icon",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "title",
              label: "Title ",
              type: "text",
              admin: {
                components: {
                  Field: HierarchicalNameFieldTwo,
                },
              },
            },
            {
              name: "menuId",
              label: "Menu Level 2 ",
              type: "text",
              admin: {
                components: {
                  Field: HierarchicalFieldTwo,
                },
              },
            },
            {
              name: "order",
              label: "Order",
              type: "number",
              admin: {
                components: {
                  Field: OrderField,
                },
              },
            },
            {
              name: "subSubItems",
              label: "Sencond Sub Items",
              type: "array",
              fields: [
                {
                  name: "icon",
                  label: "Icon",
                  type: "upload",
                  relationTo: "media",
                },
                {
                  name: "title",
                  label: "Title ",
                  type: "text",
                  admin: {
                    components: {
                      Field: HierarchicalNameFieldThree,
                    },
                  },
                },
                {
                  name: "menuId",
                  label: "Menu Level 3 ",
                  type: "text",
                  admin: {
                    components: {
                      Field: HierarchicalFieldThree,
                    },
                  },
                },
                {
                  name: "order",
                  label: "Order",
                  type: "number",
                  admin: {
                    components: {
                      Field: OrderField,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  endpoints: [
    {
      path: "/get-menus",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const response = await axios.get(
            `${Enum.MEDUSA_ENDPOINT}/store/product-categories`
          );

          await payload
            .find({
              collection: "menus",
              depth: 4,
            })
            .then((dataMenusPayload) => {
              console.log(JSON.stringify(dataMenusPayload));

              if (dataMenusPayload.totalDocs >= 0) {
                if (response.data.count >= 0) {
                  const hieMenu = buildHierarchy(
                    response.data.product_categories
                  );
                  return res.status(200).send({
                    status: 200,
                    data: {
                      menus: dataMenusPayload.docs,
                      root_menus: hieMenu,
                      root_count: response.data.count,
                    },
                  });
                } else {
                  return res
                    .status(404)
                    .send({error: "No data hierachical menu", status: 404});
                }
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
export default Menus;
