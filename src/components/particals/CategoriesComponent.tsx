import React, { FC, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, Minus } from "lucide-react";
import { CheckboxField, RelationshipSingleField, TextField } from "../fields";
import { ProductCategory, ValueLabel } from "../../types";
import { APIPost } from "../../api";
import { Gutter } from "payload/components/elements";
import { convertToSlug } from "../../utils";
import { toast } from "react-toastify";

interface Props {
  onChange?: (value: any) => void;
  options?: ProductCategory[];
  token: string;
  reload?: (val: boolean) => void;
  reloadCurrent?: boolean;
  selectedCategories?: string[];
}

interface TreeValueLabel extends ValueLabel {
  children: TreeValueLabel[];
  parent_category_id?: string | null;
}

const CategoriesComponent: FC<Props> = ({
  onChange,
  options,
  token,
  reload,
  reloadCurrent,
  selectedCategories = [],
}) => {
  const [newCategory, showNewCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryParent, setCategoryParent] = useState<ValueLabel | null>(null);
  const [categoryParentSelected, setCategorySelected] = useState<string[]>([]);
  const [optionList, setOptionList] = useState<TreeValueLabel[]>([]);
  const [initialOrder, setInitialOrder] = useState<TreeValueLabel[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const GetNameCategory = (val: string) => {
    setCategoryName(val);
  };

  const GetParentCategory = (val: ValueLabel) => {
    setCategoryParent(val);
  };

  const GetSelectedCategory = (id: string, checked: boolean) => {
    let categories = [...categoryParentSelected];

    if (checked) {
      if (!categories.includes(id)) {
        categories.push(id);
      }
    } else {
      categories = categories.filter((category) => category !== id);
    }

    setCategorySelected(categories);
    onChange && onChange(categories);
  };

  const toggleCollapse = (categoryId: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const findCategoryById = (id: string, categories: TreeValueLabel[]): TreeValueLabel | undefined => {
    for (const category of categories) {
      if (category.value === id) {
        return category;
      }
      const found = findCategoryById(id, category.children);
      if (found) {
        return found;
      }
    }
    return undefined;
  };

  const buildCategoryTree = (categories: ProductCategory[]): TreeValueLabel[] => {
    const map = new Map<string, TreeValueLabel>();
    const roots: TreeValueLabel[] = [];

    categories.forEach((category) => {
      map.set(category.id, {
        label: category.name,
        value: category.id,
        children: [],
        parent_category_id: category.parent_category_id,
      });
    });

    categories.forEach((category) => {
      const node = map.get(category.id);
      if (category.parent_category_id) {
        const parentNode = map.get(category.parent_category_id);
        if (parentNode) {
          parentNode.children.push(node!);
        }
      } else {
        roots.push(node!);
      }
    });

    return roots;
  };

  useEffect(() => {
    if (options) {
      const treeData = buildCategoryTree(options);
      setOptionList(treeData);
      setInitialOrder(treeData);
    }
  }, [options]);

  useEffect(() => {
    setCategorySelected(selectedCategories);
  }, [selectedCategories]);

  const CreateCategory = async () => {
    const formData = {
      name: categoryName,
      handle: convertToSlug(categoryName),
      parent_category_id: categoryParent?.value.toString() || null,
    };

    await APIPost("/admin/product-categories", formData, token).then(
      (response) => {
        if (response.success) {
          toast.success("Category created successfully");
          reload && reload(!reloadCurrent);
        } else {
          toast.error("Category creation failed");
        }
      }
    );
  };

  const renderCategory = (category: TreeValueLabel, level: number = 0) => (
    <div key={category.value} className={`pl-${level * 4}`}>
      <div className="flex items-center mb-2">
        {category.children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 ml-4 p-1"
            onClick={() => toggleCollapse(category.value)}
          >
            {collapsedCategories.includes(category.value) ? <Plus size={10} /> : <Minus size={10} />}
          </Button>
        )}
        <CheckboxField
          size="base"
          title={category.label}
          data={category.value}
          onChange={GetSelectedCategory}
          checked={categoryParentSelected.includes(category.value)}
          className="flex-grow"
        />
      </div>
      {category.children.length > 0 && !collapsedCategories.includes(category.value) && (
        <div className="ml-4">
          {category.children.map((child) => renderCategory(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 rounded mb-4">
      <Label className="text-base text-gray-700 dark:text-gray-200">
        Danh mục sản phẩm
      </Label>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Tất cả danh mục
        </span>
        <a
          href="#"
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Dùng nhiều nhất
        </a>
      </div>

      <div className="max-h-48 overflow-y-auto border rounded dark:border-gray-600">
        <div className="p-2">
          {optionList.map((category) => renderCategory(category))}
        </div>
      </div>
      <Button
        variant="ghost"
        className="text-blue-500 hover:text-blue-700 text-sm mt-2 flex items-center"
        onClick={() => showNewCategory(!newCategory)}
      >
        <Plus size={12} />
        <span>Thêm danh mục mới</span>
      </Button>
      {newCategory && (
        <div className="ml-auto mt-4">
          <TextField
            title="Name"
            data=""
            onChange={GetNameCategory}
            size="base"
            className="mb-4"
          />
          <RelationshipSingleField
            options={optionList}
            onChange={GetParentCategory}
            size="fit"
          />
          <Gutter className="!px-5">
            <Button
              className="mt-5"
              onClick={() => CreateCategory()}
            >
              Thêm danh mục mới
            </Button>
          </Gutter>
        </div>
      )}
    </div>
  );
};

export default CategoriesComponent;
