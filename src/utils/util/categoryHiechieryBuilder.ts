interface Category {
  id: string;
  name: string;
  handle: string;
  parent_category_id: string | null;
  category_children?: Category[];
}

type CategoryLv2 = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  handle: string;
  is_active: boolean;
  is_internal: boolean;
  parent_category_id: string | null;
  rank: number;
  metadata: any;
  category_children: Category[];
  parent_category: Category | null;
};

/**
 *
 * @param categories - Array of Category objects product categories
 * @returns - Return array of Category objects has leveling parent & child
 */

export const buildHierarchy = (categories: Category[]): Category[] => {
  const map = new Map<string, Category>();

  categories.forEach((category) => {
    map.set(category.id, {...category, category_children: []});
  });

  const hierarchy: Category[] = [];

  map.forEach((category) => {
    if (category.parent_category_id) {
      const parentCategory = map.get(category.parent_category_id);
      parentCategory?.category_children?.push(category);
    } else {
      hierarchy.push(category);
    }
  });

  return hierarchy;
};

export const GetLevel1Categories = (categories: Category[]): Category[] => {
  return categories.filter((category) => category.parent_category_id === null);
};

export const GetLevel2Categories = (categories: Category[]): Category[] => {
  const level2Categories: Category[] = [];

  categories.forEach((category) => {
    if (category.category_children) {
      category.category_children.forEach((child) => {
        level2Categories.push(child);
      });
    }
  });

  return level2Categories;
};

export const GetLevel3Categories = (
  categories: Category[],
  level = 0
): Category[] => {
  let level3Categories: Category[] = [];

  categories.forEach((category) => {
    if (level === 2) {
      level3Categories.push(category);
    } else if (category.category_children.length > 0) {
      level3Categories = level3Categories.concat(
        GetLevel3Categories(category.category_children, level + 1)
      );
    }
  });

  return level3Categories;
};
