import path from "path";

import { S3Client } from "@aws-sdk/client-s3";
import s3Upload from "payload-s3-upload";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { postgresAdapter } from "@payloadcms/db-postgres"; // database-adapter-import
import { webpackBundler } from "@payloadcms/bundler-webpack"; // bundler-import
import { slateEditor } from "@payloadcms/richtext-slate"; // editor-import
import { buildConfig } from "payload/config";

import "./index.css";

import { Icon, Logo } from "./components/graphics";
import { PayloadTheme } from "./components/theme";

import Users from "./collections/Users";
import { Dashboard, Sidebar } from "./components";
import Posts from "./collections/Posts";
import Pages from "./collections/Pages";
import Plugins from "./collections/Plugins";
import Themes from "./collections/Themes";
import Categories from "./collections/Categories";
import Media from "./collections/Media";
import Products from "./collections/Products";
import Menus from "./collections/Menus";
import MenuType from "./collections/MenuTypes";
import Orders from "./collections/Orders";
import Customers from "./collections/Customers";
import ProductCategories from "./collections/ProductCategories";

import Settings from "./globals/Settings";
import Configurations from "./globals/Configurations";
import PaymentOptions from "./collections/PaymentOptions";
import PaymentSetting from "./globals/PaymentSettings";
import {ROUTES} from "./common/data";

import {CategoryAdd, CategoryEdit} from "./pages/categories_products";
import {OrderDetail} from "./pages/orders";
import {CustomerDetail} from "./pages/customers";
import {CreateProduct} from "./pages/product";
import {UpdateProduct} from "./pages/product";
import Discounts from "./collections/Discount";
import {UpdateDiscount} from "./pages/discount";
import GiftCards from "./collections/GiftCards";
import {UpdateGiftCards} from "./pages/gift_cards";
import Bankings from "./collections/Bankings";
import BankTypes from "./collections/BankType";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- NVBPlay",
      favicon: "/media/images/logo_icon.svg",
      ogImage: "/media/images/logo_full.svg",
    },

    components: {
      providers: [PayloadTheme],
      views: {
        Dashboard: Dashboard,
        ProductsEdit: {
          Component: UpdateProduct,
          path: ROUTES.PRODUCT_EDIT,
        },
        ProductsAdd: {
          Component: CreateProduct,
          path: ROUTES.PRODUCT_CREATE,
        },
        CategoriesEdit: {
          Component: CategoryEdit,
          path: ROUTES.CATEGORY_EDIT,
        },
        CategoriesAdd: {
          Component: CategoryAdd,
          path: ROUTES.CATEGORY_CREATE,
        },
        OrderDetail: {
          Component: OrderDetail,
          path: ROUTES.ORDER_DETAIL,
        },
        CustomerDetail: {
          Component: CustomerDetail,
          path: ROUTES.CUSTOMER_DETAIL,
        },
        Discount: {
          Component: UpdateDiscount,
          path: ROUTES.DISCOUNT_EDIT,
        },
        GiftCards: {
          Component: UpdateGiftCards,
          path: ROUTES.GIFTCARDS_EDIT,
        },
      },
      Nav: Sidebar,
      graphics: {
        Logo: Logo,
        Icon: Icon,
      },
    },

    css: path.resolve(__dirname, "index.css"),
  },

  editor: slateEditor({}),
  collections: [
    Users,
    Plugins,
    Themes,
    Orders,
    Products,
    ProductCategories,
    Posts,
    Pages,
    Categories,
    Customers,
    Media,
    MenuType,
    Menus,
    Discounts,
    GiftCards,
    PaymentOptions,
    BankTypes,
    Bankings,
  ],
  globals: [Settings, Configurations, PaymentSetting],
  localization: {
    defaultLocale: "en",
    locales: ["en"],
  },
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  // cors: ["/http://.+/, /https://.+/, https://nvbplay-api.teknix.dev/, https://api.novu.co/v1/events/trigger"],
  cors: [
    "http://localhost:3000",
    "https://nvbplay-api.teknix.dev",
    "https://api.novu.co",
    "https://teksport.vercel.app",
    "https://medusa-backend-nvb.up.railway.app",
    "https://payload-cms-sy02.onrender.com",
    "https://payload-cms-nvb.up.railway.app",
  ],
  plugins: [
    payloadCloud(),
    s3Upload(
      new S3Client({
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        requestHandler: {
          requestTimeout: 3_000,
          httpsAgent: {maxSockets: 50},
        },
      })
    ),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
});
