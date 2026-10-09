import {CollectionConfig} from "payload/types";
import path from "path";
import {AltTextField, CaptionField} from "../components/fields";
import { S3UploadCollectionConfig } from "payload-s3-upload";
import {Enum} from "../common/data";

const staticDir = path.resolve(__dirname, "../media/images");

const Media: S3UploadCollectionConfig = {
  slug: "media",
  labels: {
    singular: "Media",
    plural: "Media",
  },
  upload: {
    staticDir,
    crop: true,
    disableLocalStorage: false,
    mimeTypes: ["image/*"],
    s3: {
      bucket: process.env.S3_BUCKET,
      commandInput: {
        ACL: "public-read",
      },
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: null,
        position: "centre",
      },
    ],
  },
  access: {
    create: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("author")),
    read: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("author")),
    update: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("author")),
    delete: ({req: {user}}) =>
      user && (user.roles.includes("admin") || user.roles.includes("author")),
  },
  hooks: {
    afterRead: [
      ({doc}) => {
        // add a url property on the main image
        doc.url = `${process.env.R2_URL || Enum.R2_URL}/${doc.filename}`;

        // add a url property on each imageSize
        Object.keys(doc.sizes).forEach(
          (k) =>
            (doc.sizes[k].url =
              `${process.env.R2_URL || Enum.R2_URL}/${doc.sizes[k].filename}`)
        );
      },
    ],
  },
  fields: [
    {
      name: "altText",
      label: "Alt Text",
      type: "text",
      admin: {
        components: {
          Field: AltTextField,
        },
      },
    },
    {
      name: "caption",
      label: "Caption",
      type: "text",
      admin: {
        components: {
          Field: CaptionField,
        },
      },
    },
  ],
};

export default Media;
