import React, { useEffect, useState, useRef } from "react";
import Nestable, { Item as NestableItem } from "react-nestable";
import {
  AiOutlinePlus,
  AiFillCaretDown,
  AiFillCaretRight,
  AiFillTag,
} from "react-icons/ai";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BsDot } from "react-icons/bs";
import "react-nestable/dist/styles/index.css"; // Ensure this line is added
import { ManagementContainer } from "../../components/container";
import { APIDelete, APIGet, APIPost } from "../../api"; // Import your API call functions
import { useAuth } from "payload/components/utilities";
import AddCategoryModal from "./components/AddCategoryModal"; // Import AddCategoryModal component
import { Button } from "../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Label } from "../../components/ui/label";

import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Your Item interface should extend NestableItem
interface Item extends NestableItem {
  id: string;
  text: string;
  children?: Item[];
}

// Interface for category data from API
interface Category {
  id: string;
  name: string;
  parent_category_id: string | null;
  category_children: Category[];
}

interface User {
  id: number;
  email: string;
  token: string;
}

// Hàm chuyển đổi các danh mục thành các item cho Nestable
const convertCategoriesToItems = (categories: Category[]): Item[] => {
  const categoryMap: { [key: string]: Item } = {};

  // Tạo một map các category để dễ dàng truy cập và tổ chức
  categories.forEach((category) => {
    if (!categoryMap[category.id]) {
      categoryMap[category.id] = {
        id: category.id,
        text: category.name,
        children: [],
      };
    }
  });

  // Tạo cấu trúc cha-con cho các category
  categories.forEach((category) => {
    if (category.parent_category_id) {
      if (categoryMap[category.parent_category_id]) {
        categoryMap[category.parent_category_id].children!.push(
          categoryMap[category.id]
        );
      }
    }
  });

  // Trả về các danh mục không có parent_category_id
  return Object.values(categoryMap).filter(
    (category) =>
      !categories.some(
        (cat) => cat.id === category.id && cat.parent_category_id
      )
  );
};

const CategoryProduct = () => {
  const { user } = useAuth<User>();
  const [items, setItems] = useState<Item[]>([]);
  const [collapseAll, setCollapseAll] = useState(false);
  const [dragItem, setDragItem] = useState<Item | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    handle: "",
    isActive: "true",
    isPublic: "true",
    metadataKey: "",
    metadataValue: "",
  });
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [showEditSheet, setShowEditSheet] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      const response = await APIGet(
        "/admin/product-categories",
        user.token.toString()
      );
      const categories: Category[] = response.data.product_categories;
      const nestedItems = convertCategoriesToItems(categories);
      setItems(nestedItems);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user.token]);

  const togglePopover = (id: string) => {
    setPopoverOpen((prev) => {
      const newState = {
        ...prev,
        [id]: !prev[id],
      };
      console.log(`Popover state for ${id}:`, newState[id]);
      return newState;
    });
  };

  const handleEditClick = async (item: Item) => {
    try {
      const response = await APIGet(
        `/admin/product-categories/${item.id}`,
        user.token.toString()
      );
      const categoryData = response.data.product_category;
      setActiveCategory(categoryData);

      setFormData({
        name: categoryData.name || "",
        description: categoryData.description || "",
        handle: categoryData.handle || "",
        isActive: categoryData.is_active ? "true" : "false",
        isPublic: categoryData.is_internal ? "false" : "true",
        metadataKey: categoryData.metadata
          ? Object.keys(categoryData.metadata)[0]
          : "",
        metadataValue: categoryData.metadata
          ? categoryData.metadata[Object.keys(categoryData.metadata)[0]]
          : "",
      });
      setShowEditSheet(!showEditSheet);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await APIPost(
        `/admin/product-categories/${activeCategory.id}`,
        {
          name: formData.name,
          description: formData.description,
          handle: formData.handle,
          is_active: formData.isActive === "true",
          is_internal: formData.isPublic === "false",
          metadata: { [formData.metadataKey]: formData.metadataValue },
        },
        user.token.toString()
      );
      toast.success(`Category ${activeCategory.id} updated successfully.`);
      setShowEditSheet(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteClick = async (item: Item) => {
    try {
      await APIDelete(
        `/admin/product-categories`,
        item.id,
        user.token.toString()
      );
      toast.success(`Category ${item.id} deleted successfully.`);
      fetchCategories();
      setShowEditSheet(false);
      togglePopover(item.id);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const renderItem = ({
    item,
    index,
    depth,
    isDraggable,
    collapseIcon,
    handler,
  }: {
    item: Item;
    index: number;
    depth: number;
    isDraggable: boolean;
    collapseIcon: React.ReactNode;
    handler: React.ReactNode;
  }) => {
    return (
      <div
        className={`flex items-center text-gray-800 text-lg p-4 bg-white shadow-sm border border-gray-200 rounded ${
          item.children?.length ? "mb-2" : "mb-1"
        } ${dragItem?.id === item.id ? "bg-blue-100" : ""}`}
        style={{ marginLeft: `${depth * 20}px`, position: "relative" }}
      >
        <div
          className="flex items-center"
          style={{ position: "absolute", left: 0 }}
        >
          <div className="cursor-move mr-2">{handler}</div>
        </div>
        <div className="flex justify-between w-full ml-10">
          <div className="flex items-center">
            <div className="mx-2">{collapseIcon}</div>
            <AiFillTag className="mr-2 text-gray-500" />
            <div className="p-2 flex-1">{item.text}</div>
            <BsDot className="text-red-500" />
          </div>
          <div className="flex items-center">
            <Popover open={popoverOpen[item.id] || false}>
              <PopoverTrigger asChild>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => togglePopover(item.id)}
                >
                  <HiDotsVertical size={24} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-white rounded-lg shadow-lg">
                <div className="flex flex-col">
                  <Sheet open={showEditSheet}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaRegEdit className="mr-2" /> Edit
                      </Button>
                    </SheetTrigger>
                    <SheetContent style={{ minWidth: "44.375rem" }}>
                      <SheetHeader>
                        <SheetTitle>Edit category</SheetTitle>
                        <SheetDescription>
                          Make changes to your category here. Click save when
                          you're done.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="overflow-y-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-1 right-1 bg-white z-[55]"
                          onClick={() => handleEditClick(item)}
                        >
                          <X size={20} strokeWidth={1.5} />
                        </Button>
                        <div
                          className="flex items-center justify-center"
                          style={{
                            padding: "50px 0px",
                          }}
                        >
                          <div className="bg-white rounded-lg w-full z-20">
                            <form>
                              <div className="mb-6 grid grid-cols-2 gap-6">
                                <div>
                                  <label
                                    htmlFor="name"
                                    className="block text-gray-700 text-lg font-bold mb-2"
                                  >
                                    Name
                                  </label>
                                  <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        name: e.target.value,
                                      })
                                    }
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                    placeholder="Give this category a name"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="handle"
                                    className="block text-gray-700 text-lg font-bold mb-2"
                                  >
                                    Handle
                                  </label>
                                  <input
                                    id="handle"
                                    type="text"
                                    value={formData.handle}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        handle: e.target.value,
                                      })
                                    }
                                    placeholder="Custom handle"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                  />
                                </div>
                              </div>

                              <div className="mb-6">
                                <label
                                  htmlFor="description"
                                  className="block text-gray-700 text-lg font-bold mb-2"
                                >
                                  Description
                                </label>
                                <input
                                  id="description"
                                  type="text"
                                  value={formData.description}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="Give this category a description"
                                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                />
                              </div>

                              <div className="mb-6 grid grid-cols-2 gap-6">
                                <div>
                                  <label
                                    htmlFor="isActive"
                                    className="block text-gray-700 text-lg font-bold mb-2"
                                  >
                                    Status
                                  </label>
                                  <select
                                    id="isActive"
                                    value={formData.isActive}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        isActive: e.target.value,
                                      })
                                    }
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                  >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                  </select>
                                </div>

                                <div>
                                  <label
                                    htmlFor="isPublic"
                                    className="block text-gray-700 text-lg font-bold mb-2"
                                  >
                                    Visibility
                                  </label>
                                  <select
                                    id="isPublic"
                                    value={formData.isPublic}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        isPublic: e.target.value,
                                      })
                                    }
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                  >
                                    <option value="true">Public</option>
                                    <option value="false">Private</option>
                                  </select>
                                </div>
                              </div>

                              <div className="mb-6">
                                <label className="block text-gray-700 text-lg font-bold mb-2">
                                  Metadata
                                </label>
                                <table className="min-w-full divide-y divide-gray-200 mb-4">
                                  <thead className="bg-gray-50">
                                    <tr className="border">
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Key
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="border">
                                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                          type="text"
                                          id="metadataKey"
                                          placeholder="Key"
                                          className="appearance-none rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                          value={formData.metadataKey}
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              metadataKey: e.target.value,
                                            })
                                          }
                                        />
                                      </td>
                                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                          type="text"
                                          id="metadataValue"
                                          placeholder="Value"
                                          className="appearance-none rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                          value={formData.metadataValue}
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              metadataValue: e.target.value,
                                            })
                                          }
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button type="submit" onClick={handleSubmit}>
                            Save changes
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                  <button
                    className="flex items-center px-4 py-2 mt-1 text-red-500 hover:bg-red-100 w-full"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <RiDeleteBin6Line className="mr-2" /> Delete
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    );
  };

  const renderCollapseIcon = ({ isCollapsed }: { isCollapsed: boolean }) =>
    isCollapsed ? <AiFillCaretRight /> : <AiFillCaretDown />;

  const Handler = () => (
    <div className="cursor-move flex items-center justify-center w-8 h-full border-r border-gray-300">
      <PiDotsSixVerticalBold />
    </div>
  );

  const updateCategory = async (
    category: Item,
    parentId: string | null,
    rank: number
  ) => {
    try {
      await APIPost(
        `/admin/product-categories/${category.id}`,
        {
          parent_category_id: parentId,
          rank,
        },
        user.token.toString()
      );
      console.log(`Category ${category.id} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update category ${category.id}:`, error);
    }
  };

  const handleChange = async ({
    items,
    dragItem,
    targetPath,
  }: {
    items: Item[];
    dragItem: Item;
    targetPath: number[];
  }) => {
    setItems(items);

    // Xác định danh mục cha mới
    const parentPath = targetPath.slice(0, -1);
    const parentItem = parentPath.reduce(
      (acc, cur) => {
        if (acc.children && acc.children.length > cur) {
          return acc.children[cur];
        }
        return acc;
      },
      { id: "", children: items }
    );
    const parentId = parentItem.id || null;
    const rank = targetPath[targetPath.length - 1];

    // Cập nhật danh mục bị kéo thả
    await updateCategory(dragItem, parentId, rank);

    // Cập nhật tất cả các mục con của danh mục bị kéo thả
    const updateChildren = async (children: Item[], parentId: string) => {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        await updateCategory(child, parentId, i);
        if (child.children && child.children.length > 0) {
          await updateChildren(child.children, child.id);
        }
      }
    };

    if (dragItem.children && dragItem.children.length > 0) {
      await updateChildren(dragItem.children, dragItem.id);
    }
  };

  return (
    <ManagementContainer title="Product Categories">
      <div className="p-6 min-h-screen">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-lg">
              Helps you to keep your products organized.
            </p>
          </div>
          <AddCategoryModal fetchCategories={fetchCategories} />
        </div>
        <Button onClick={() => setCollapseAll(!collapseAll)} className="mb-5">
          {collapseAll ? "Expand all" : "Collapse all"}
        </Button>
        <Nestable
          items={items}
          renderItem={renderItem}
          renderCollapseIcon={renderCollapseIcon}
          collapsed={collapseAll}
          handler={<Handler />}
          onChange={handleChange} // Handle changes
        />
      </div>
      <ToastContainer position="top-right" />
    </ManagementContainer>
  );
};

export default CategoryProduct;
