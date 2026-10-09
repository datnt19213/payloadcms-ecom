export interface IRootCategories {
  count: number;
  product_categories: Productcategory[];
  offset: number;
  limit: number;
}

export interface ProductCategory {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  handle: string;
  is_active: boolean;
  is_internal: boolean;
  parent_category_id?: string;
  rank: number;
  metadata?: any;
  category_children: CategoryChild[];
  parent_category?: ParentCategory;
}

export interface ParentCategory {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  handle: string;
  is_active: boolean;
  is_internal: boolean;
  parent_category_id?: any;
  rank: number;
  metadata?: any;
}

export interface CategoryChild {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  handle: string;
  is_active: boolean;
  is_internal: boolean;
  parent_category_id: string;
  rank: number;
  metadata?: any;
}



















// data sample form

// [
//   {
//     id: "askjdbaksjdbasd",
//     created_at: "22-02-22",
//     updated_at: "22-02-22",
//     name: "qua cau long",
//     description: "",
//     handle: "qua-cau-long",
//     is_active: false,
//     is_internal: false,
//     parent_category_id: null,
//     rank: 1,
//     metadata: null,
//     category_children: [],
//     parent_category: {
//       id: "kjbkjniuoa",
//       created_at: "22-01-22",
//       updated_at: "22-01-22",
//       name: "phu kien cau long",
//       description: "",
//       handle: "phu-kien-cau-long",
//       is_active: false,
//       is_internal: false,
//       parent_category_id: null,
//       rank: 1,
//       metadata: null,
//     },
//   },
// ][
//   {
//     parent_category: {
//       id: "kjbkjniuoa",
//       created_at: "22-01-22",
//       updated_at: "22-01-22",
//       name: "phu kien cau long",
//       description: "",
//       handle: "phu-kien-cau-long",
//       is_active: false,
//       is_internal: false,
//       parent_category_id: null,
//       rank: 1,
//       metadata: null,
//       category_children: [
//         {
//           id: "askjdbaksjdbasd",
//           created_at: "22-02-22",
//           updated_at: "22-02-22",
//           name: "qua cau long",
//           description: "",
//           handle: "qua-cau-long",
//           is_active: false,
//           is_internal: false,
//           parent_category_id: null,
//           rank: 1,
//           metadata: null,
//         },
//       ],
//     },
//   }
// ][
//   {
//     id: "askjdbaksjdbasd",
//     created_at: "22-02-22",
//     updated_at: "22-02-22",
//     name: "qua cau long",
//     description: "",
//     handle: "qua-cau-long",
//     is_active: false,
//     is_internal: false,
//     parent_category_id: null,
//     rank: 1,
//     metadata: null,
//     category_children: [
//       {
//         id: "kjbkjniuoa",
//         created_at: "22-01-22",
//         updated_at: "22-01-22",
//         name: "cau long mau do",
//         description: "",
//         handle: "cau-long-mau-do",
//         is_active: false,
//         is_internal: false,
//         parent_category_id: null,
//         rank: 1,
//         metadata: null,
//       },
//     ],
//     parent_category: null,
//   }
// ];