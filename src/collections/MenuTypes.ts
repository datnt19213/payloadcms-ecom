// HIDDEN COLLECTION

import {CollectionConfig} from "payload/types";
import {
  NameSetForField,
  ValueDisableField,
} from "../components/fields/TextField";
import {SaveButton} from "../components/buttons";
import payload from "payload";

// pJtKE4YKBLKztGb3aPw0rEq11DxuSp random string;

const MenuType: CollectionConfig = {
  slug: "menu-type",
  labels: {
    plural: "Menu Type",
    singular: "Menu Type",
  },
  admin: {
    components: {
      edit: {
        SaveButton: SaveButton,
      },
    },
  },
  access: {
    read: ({req: {user}}) => user.roles.includes("admin"),
    create: ({req: {user}}) => user.roles.includes("admin"),
    update: ({req: {user}}) => user.roles.includes("admin"),
    delete: ({req: {user}}) => user.roles.includes("admin"),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
      admin: {
        components: {
          Field: NameSetForField,
        },
      },
    },
    {
      name: "value",
      type: "text",
      label: "Value",
      required: true,
      admin: {
        components: {
          Field: ValueDisableField,
        },
      },
    },
  ],
  // endpoints: [
  //   {
  //     path: "/create-menu-type",
  //     method: "post",
  //     handler: async (req, res, next) => {
  //       try {
  //         let name = req?.body.name;
  //         let value = req?.body.value;

  //         if (name && value) {
  //           const response = await payload.create({
  //             collection: "menu-type-pJtKE4YKBLKztGb3aPw0rEq11DxuSp",
  //             data: {
  //               name: name,
  //               value: value,
  //             },
  //           });
  //           if (response) {
  //             return res
  //               .status(200)
  //               .send({message: "Menu type created successfully", status: 200});
  //           } else {
  //             return res
  //               .status(404)
  //               .send({error: "Created failed", status: 404});
  //           }
  //         }
  //       } catch (error) {
  //         return res.status(500).send({error: error, message: "Created error"});
  //       }
  //     },
  //   },
  // ],
};

export default MenuType;
