import {Sidebar, ValueLabel} from "../types";

// #region Common Data

export const Common = {
  token: "token",
  single: "single",
  multiple: "multiple",
  complete: "completed",
  cancel: "canceled",
  pending: "pending",
  archived: "archived",
  requires_action: "requires_action",
  ft_date_range: "date_range",
  ft_order_status: "order_status",
  ft_amount: "amount",
  ft_payment_status: "payment_status",
  pm_requires_action: "requires_action",
  pm_canceled: "canceled",
  pm_refunded: "refunded",
  pm_partially_refunded: "partially_refunded",
  pm_captured: "captured",
  pm_awaiting: "awaiting",
  pm_not_paid: "not_paid",
  fpt_categories: "categories",
  fpt_sales_channel: "sales_channel",
  fpt_status: "status",
  fpt_tags: "tags",
  fpt_price: "price",
};

// #endregion

// =================================================================================================================

// #region Enum Variables

export enum Enum {
  secretKey = "j3jK8m7d31vLBWX3Tfx8qpzCNwFX2pT89SQ2B20naFWjjMDn8SpQeiMSLP453XU7JPhmeD7mDY56ExZStMFtWjDTuCAM5DepVdpL",
  admin = "admin",
  editor = "editor",
  author = "author",
  contributor = "contributor",
  subcriber = "subscriber",
  manager = "manager",
  customer = "customer",
  secretBankToPortalId = "Pd6VcG7F6VaaL5ZwXQbhEVJnJS4dH1",
  secretRandomKey = "D7uEwXeSGuwWYtWGGxMCHvndj9DE1Z",
  secretEndcodeDecodeKey = "Y3KAQJVWrUad5QgrJNKiJXDaFwTaaqkUYu4WZhNbbt5tHmmFJA",
  // MEDUSA_ENDPOINT = "https://nvbplay-api.teknix.dev",
  MEDUSA_ENDPOINT = "https://medusa-backend-nvb.up.railway.app",
  ORDER_SHIPPING_DETAIL = "https://medusa-backend-nvb.up.railway.app/api/goship/get-shipments-history?code=",
  PAYLOAD_PAYMENT_GATEWAY = "https://payload-cms-sy02.onrender.com",
  R2_URL = "https://cdn.nvbplay.vn",
  PAYLOAD_RAILWAY_ENDPOINT = "https://payload-cms-nvb.up.railway.app",
  PAYMENT_LIST_METHOD = "https://payment-router-gateway.tngiakhanh2000.workers.dev/api/list-method",
}

// #endregion

// #region Header Payload Link
export const HeaderLink = {
  home: "/",
  locales: [
    {
      label: "en",
      link: "/?locale=en",
    },
  ],
  avatar: "/account",
};

// #endregion

// =================================================================================================================

// #region Payload Menu Sidebar

export let MenuLink: Sidebar = [
  {
    label: "Dashboard",
    disable: false,
    value: "dashboard",
    link: "/admin",
    icon: "lucide:home",
    roles: [
      Enum.admin,
      Enum.editor,
      Enum.author,
      Enum.contributor,
      Enum.customer,
      Enum.manager,
      Enum.subcriber,
    ],
    child: [],
  },
  {
    label: "Users",
    disable: false,
    value: "users",
    link: "/admin/collections/users",
    icon: "lucide:user",
    roles: [
      Enum.admin,
      Enum.editor,
      Enum.author,
      Enum.contributor,
      Enum.customer,
      Enum.manager,
      Enum.subcriber,
    ],
    child: [],
  },
  {
    label: "Media",
    disable: false,
    value: "media",
    icon: "lucide:image",
    link: "/admin/collections/media",
    roles: [Enum.admin, Enum.author],
    child: [],
  },
  {
    label: "Customers",
    value: "customers",
    link: "/admin/collections/customers",
    icon: "lucide:users",
    disable: false,
    roles: [Enum.admin, Enum.manager],
    child: [],
  },
  {
    label: "Shop",
    disable: false,
    roles: [Enum.admin, Enum.customer, Enum.manager],
    value: "shop",
    icon: "lucide:shopping-bag",
    link: "",
    child: [
      {
        label: "Orders",
        disable: false,
        value: "orders",
        link: "/admin/collections/orders",
        roles: [Enum.admin, Enum.customer],
        child: [],
      },
      {
        label: "Products",
        disable: false,
        value: "products",
        link: "/admin/collections/products",
        roles: [Enum.admin, Enum.manager],
        child: [],
      },
      {
        label: "Discount",
        disable: false,
        value: "discount",
        link: "/admin/collections/discount",
        roles: [Enum.admin, Enum.customer],
        child: [],
      },
      {
        label: "Gift cards",
        disable: false,
        value: "gift-cards",
        link: "/admin/collections/gift-cards",
        roles: [Enum.admin, Enum.customer],
        child: [],
      },
      {
        label: "Categories",
        disable: false,
        value: "product-categories",
        link: "/admin/collections/product-categories",
        roles: [Enum.admin, Enum.manager],
        child: [],
      },
    ],
  },

  {
    label: "Blogs",
    disable: false,
    roles: [Enum.admin, Enum.editor],
    value: "blogs",
    icon: "lucide:letter-text",
    link: "",
    child: [
      {
        label: "Posts",
        disable: false,
        value: "posts",
        link: "/admin/collections/posts",
        roles: [
          Enum.admin,
          Enum.editor,
          Enum.author,
          Enum.contributor,
          Enum.subcriber,
        ],
        child: [],
      },
      {
        label: "Pages",
        disable: false,
        value: "pages",
        link: "/admin/collections/pages",
        roles: [Enum.admin, Enum.editor],
        child: [],
      },

      {
        label: "Categories",
        disable: false,
        value: "categories",
        link: "/admin/collections/categories",
        roles: [Enum.admin, Enum.editor],
        child: [],
      },
    ],
  },
  {
    label: "Payments",
    disable: false,
    value: "payments",
    link: "",
    icon: "lucide:credit-card",
    roles: [Enum.admin],
    child: [
      {
        label: "Payment",
        disable: false,
        value: "payment-settings",
        link: "/admin/globals/payment-settings",
        roles: [Enum.admin],
        child: [],
      },
      {
        label: "Bank Types",
        disable: false,
        value: "bank-types",
        link: "/admin/collections/bank-types",
        roles: [Enum.admin],
        child: [],
      },
      {
        label: "Bankings",
        disable: false,
        value: "bankings",
        link: "/admin/collections/bankings",
        roles: [Enum.admin],
        child: [],
      },
    ],
  },
  {
    label: "Settings",
    disable: false,
    roles: [Enum.admin],
    value: "settings",
    link: "",
    icon: "lucide:settings-2",
    child: [
      {
        label: "Plugins",
        disable: true,
        value: "plugins",
        link: "/admin/collections/plugins",
        roles: [Enum.admin],
        child: [],
      },
      {
        label: "Themes",
        disable: true,
        value: "themes",
        link: "/admin/collections/themes",
        roles: [Enum.admin],
        child: [],
      },
      {
        label: "Menus",
        disable: false,
        value: "menus",
        link: "/admin/collections/menus",
        roles: [Enum.admin],
        child: [],
      },
      {
        label: "Menu Type",
        disable: false,
        value: "menu-type",
        link: "/admin/collections/menu-type",
        roles: [Enum.admin],
        child: [],
      },
      {
        label: "Settings",
        disable: false,
        value: "settings",
        link: "/admin/globals/settings",
        roles: [Enum.admin],
        child: [],
      },
      {
        label: "Configurations",
        disable: false,
        value: "configurations",
        link: "/admin/globals/configurations",
        roles: [Enum.admin],
        child: [],
      },
    ],
  },
];

// #endregion

// =================================================================================================================

// #region Routes of Site

export const ROUTES = {
  PRODUCT_EDIT: "/products/edit",
  PRODUCT_CREATE: "/products/create",
  PRODUCT_CATEGORIES: "/product/categories",
  CATEGORY_EDIT: "/categories/edit",
  CATEGORY_CREATE: "/categories/create",
  ORDER_DETAIL: "/orders/detail",
  CUSTOMER_CREATE: "/customers/create",
  CUSTOMER_DETAIL: "/customers/detail",
  CREATE_PRODUCT: "/testing",
  DISCOUNT_EDIT: "/discount/edit",
  GIFTCARDS_EDIT: "/gift-cards/edit",
};

// #endregion

// =================================================================================================================
// #region Menu type for setting of fe

export const MenuType = [
  {
    label: "Landscape Menu",
    value: "landscape-menu",
  },
  {
    label: "Mobile Menu",
    value: "mobile-menu",
  },
  {
    label: "Footer Menu",
    value: "footer-menu",
  },
  {
    label: "Sidebar Menu",
    value: "sidebar-menu",
  },
];

// #endregion
// =================================================================================================================

// #region order status of medusa
export const OrderStatus = [
  {
    label: "Complete",
    value: "complete",
  },
  {
    label: "Cancel",
    value: "cancel",
  },
  {
    label: "Pending",
    value: "pending",
  },
];

// #endregion
// =================================================================================================================

// #region fontsize of custom extentions tiptap
export const FontSizes = [8, 10, 12, 14, 16, 18, 24, 30, 36];
// #endregion

// =================================================================================================================
// #region filter list type

export const FilterList = [
  {
    label: "Date Range",
    value: "date_range",
  },
  {
    label: "Order Status",
    value: "order_status",
  },
  {
    label: "Amount",
    value: "amount",
  },
  {
    label: "Payment Status",
    value: "payment_status",
  },
];
export const FilterProductList = [
  {
    label: "Categories",
    value: "categories",
  },
  {
    label: "Sales Channel",
    value: "sales_channel",
  },
  {
    label: "Status",
    value: "status",
  },
  {
    label: "Tags",
    value: "tags",
  },
];

// #endregion
// =================================================================================================================
// #region order status list

export const OrderStatusList: ValueLabel[] = [
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Canceled",
    value: "canceled",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Archived",
    value: "archived",
  },
  {
    label: "Requires Action",
    value: "requires_action",
  },
];

// #endregion
// =================================================================================================================
// #region payment status list

export const PaymentStatusList: ValueLabel[] = [
  {
    label: "Requires Action",
    value: "requires_action",
  },
  {
    label: "Canceled",
    value: "canceled",
  },
  {
    label: "Refunded",
    value: "refunded",
  },
  {
    label: "Partially Refunded",
    value: "partially_refunded",
  },
  {
    label: "Captured",
    value: "captured",
  },
  {
    label: "Awaiting",
    value: "awaiting",
  },
  {
    label: "Not Paid",
    value: "not_paid",
  },
];

// #endregion
// =================================================================================================================
// #region payment status list

export const ProductStatusList: ValueLabel[] = [
  {
    label: "Draft Action",
    value: "draft",
  },
  {
    label: "Proposed",
    value: "proposed",
  },
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

// #endregion

export const Styles = {
  input:
    "focus:ring-1 text-base focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200",
};