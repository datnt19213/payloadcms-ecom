import React, { useState } from "react";
import { APIPost } from "../../../api";
import { AiOutlinePlus } from "react-icons/ai";
import { useAuth } from "payload/components/utilities";
import {Button} from "../../../components/ui/button";

const AddCategoryModal = ({fetchCategories}) => {
  const {user} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    handle: "",
    isActive: "true",
    isPublic: "true",
    metadataKey: "",
    metadataValue: "",
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleInputChange = (e) => {
    const {id, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      description,
      handle,
      isActive,
      isPublic,
      metadataKey,
      metadataValue,
    } = formData;
    const metadata =
      metadataKey && metadataValue ? {[metadataKey]: metadataValue} : {};

    const payload = {
      name,
      description,
      handle,
      is_active: isActive === "true",
      is_internal: isPublic !== "true",
      metadata,
    };

    try {
      await APIPost(
        "/admin/product-categories",
        payload,
        user.token.toString()
      );
      await fetchCategories();
      closeModal();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <>
      <Button onClick={openModal}>
        <AiOutlinePlus className="mr-2" /> Add Category
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={closeModal}
            ></div>
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-8 z-20">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">
                Add category
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-6 grid grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-gray-700 text-lg font-bold mb-2"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Give this category a name"
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-lg font-bold mb-2"
                      htmlFor="handle"
                    >
                      Handle
                    </label>
                    <input
                      id="handle"
                      type="text"
                      placeholder="Custom handle"
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                      value={formData.handle}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    placeholder="Give this category a description"
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-6 grid grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-gray-700 text-lg font-bold mb-2"
                      htmlFor="isActive"
                    >
                      Status
                    </label>
                    <select
                      id="isActive"
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                      value={formData.isActive}
                      onChange={handleInputChange}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 text-lg font-bold mb-2"
                      htmlFor="isPublic"
                    >
                      Visibility
                    </label>
                    <select
                      id="isPublic"
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                      value={formData.isPublic}
                      onChange={handleInputChange}
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
                            onChange={handleInputChange}
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            id="metadataValue"
                            placeholder="Value"
                            className="appearance-none rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                            value={formData.metadataValue}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white py-3 px-4 rounded hover:bg-gray-600 mr-4 text-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 text-lg"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCategoryModal;
