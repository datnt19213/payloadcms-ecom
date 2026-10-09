import React, { useState, useEffect } from "react";
import { GoDatabase } from "react-icons/go";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaTrash } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import Modal from "./Modal";
import { Button } from "../../../../components/ui/button";
import { EllipsisVertical } from "lucide-react";
import CurrencyInput from "react-currency-input-field";

interface OptionValue {
  text: string;
}

interface Option {
  id: number;
  optionName: string;
  optionValues: OptionValue[];
}

interface Variant {
  optionValues: string[];
  price: number;
  available: number;
  image?: string;
  imageFile?: File; // Thay đổi này
  stockLocations: any[];
  sku?: string;
  barcode?: string;
  quantities?: { [key: string]: number };
}

interface VariantOptionProps {
  onVariantsChange: (variants: Variant[]) => void;
  onOptionsChange: (options: Option[]) => void;
  stockLocations: any[];
}

const VariantOption: React.FC<VariantOptionProps> = ({
  onVariantsChange,
  onOptionsChange,
  stockLocations,
}) => {
  const [options, setOptions] = useState<Option[]>([
    { id: 1, optionName: "", optionValues: [{ text: "" }] },
  ]);
  const [collapsedIds, setCollapsedIds] = useState<number[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  useEffect(() => {
    onVariantsChange(variants);
  }, [variants, onVariantsChange]);

  useEffect(() => {
    onOptionsChange(options);
  }, [options, onOptionsChange]);

  const addOption = () => {
    if (options.length < 3) {
      setOptions([
        ...options,
        {
          id: options.length + 1,
          optionName: "",
          optionValues: [{ text: "" }],
        },
      ]);
    }
  };

  const deleteOption = (id: number) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleOptionNameChange = (id: number, value: string) => {
    const newOptions = options.map((option) =>
      option.id === id ? { ...option, optionName: value } : option
    );
    setOptions(newOptions);
  };

  const handleOptionValueChange = (
    optionId: number,
    valueIndex: number,
    value: string
  ) => {
    const newOptions = options.map((option) => {
      if (option.id === optionId) {
        const newOptionValues = [...option.optionValues];
        newOptionValues[valueIndex].text = value;
        if (valueIndex === newOptionValues.length - 1 && value !== "") {
          newOptionValues.push({ text: "" });
        }
        return { ...option, optionValues: newOptionValues };
      }
      return option;
    });
    setOptions(newOptions);
  };

  const deleteOptionValue = (optionId: number, valueIndex: number) => {
    const newOptions = options.map((option) => {
      if (option.id === optionId) {
        const newOptionValues = option.optionValues.filter(
          (_, index) => index !== valueIndex
        );
        return { ...option, optionValues: newOptionValues };
      }
      return option;
    });
    setOptions(newOptions);
  };

  const handleImageChange = (variantIndex: number, file: File) => {
    const newVariants = [...variants];
    const variantsURL = [...variants];
    newVariants[variantIndex].image = URL.createObjectURL(file);
    variantsURL[variantIndex].imageFile = file; // Lưu trữ file thay vì URL
    setVariants(variantsURL);
  };

  const handlePriceChange = (
    variantIndex: number,
    value: string | undefined
  ) => {
    const parsedValue = parseFloat(value || "0".replace(/[^\d.-]/g, ""));
    const newVariants = [...variants];
    newVariants[variantIndex].price = isNaN(parsedValue) ? 0 : parsedValue;
    setVariants(newVariants);
  };

  const generateVariants = () => {
    const values = options
      .filter((option) => option.optionValues.length > 0)
      .map((option) =>
        option.optionValues
          .filter((value) => value.text !== "")
          .map((v) => v.text)
      );

    if (values.length === 0) return [];

    const cartesianProduct = (arrays: string[][]) => {
      return arrays.reduce(
        (acc, array) => {
          return acc.flatMap((item) => array.map((value) => [...item, value]));
        },
        [[]] as string[][]
      );
    };

    return cartesianProduct(values).map((variantValues) => ({
      optionValues: variantValues,
      price: 0,
      available: 0,
      image: undefined,
      stockLocations: [],
      quantities: {}, // Initialize quantities
    }));
  };

  const handleDone = (id: number) => {
    setVariants(generateVariants());
    setCollapsedIds([...collapsedIds, id]);
  };

  const handleToggle = (id: number) => {
    if (collapsedIds.includes(id)) {
      setCollapsedIds(collapsedIds.filter((collapsedId) => collapsedId !== id));
    } else {
      setCollapsedIds([...collapsedIds, id]);
    }
  };

  const handleRowClick = (index: number) => {
    setSelectedVariant(index);
  };

  const handleSaveModal = (
    locations: string[],
    quantities: any,
    sku: string,
    barcode: string
  ) => {
    if (selectedVariant !== null) {
      const newVariants = variants.map((variant, index) =>
        index === selectedVariant
          ? { ...variant, stockLocations: locations, quantities, sku, barcode }
          : variant
      );
      setVariants(newVariants);
      setSelectedVariant(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedVariant(null);
  };

  const handleRemoveImage = (index: number) => {
    const newVariants = [...variants];
    newVariants[index].image = undefined;
    newVariants[index].imageFile = undefined; // Xóa cả file hình ảnh
    setVariants(newVariants);
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="px-5">
        <h2 className="text-lg font-semibold mb-4">Variants</h2>
        <div>
          {options.map((option) => (
            <div key={option.id} className="rounded border p-4 mb-4">
              {!collapsedIds.includes(option.id) ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Option name
                      </label>
                      <GoDatabase className="text-gray-500" />
                    </div>
                    <div className="flex items-center mt-1">
                      <RxDragHandleDots2 className="mr-2" />
                      <input
                        type="text"
                        value={option.optionName}
                        onChange={(e) =>
                          handleOptionNameChange(option.id, e.target.value)
                        }
                        className="block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    {!option.optionName && (
                      <p className="text-red-500 text-xs mt-1">
                        Option name is required.
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Option values
                    </label>
                    {option.optionValues.map((value, index) => (
                      <div key={index} className="flex items-center mt-1">
                        <input
                          type="text"
                          value={value.text}
                          onChange={(e) =>
                            handleOptionValueChange(
                              option.id,
                              index,
                              e.target.value
                            )
                          }
                          className="block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {value.text !== "" && (
                          <FaTrash
                            className="text-red-500 ml-2 cursor-pointer"
                            onClick={() => deleteOptionValue(option.id, index)}
                          />
                        )}
                      </div>
                    ))}
                    {option.optionValues.filter((v) => v.text === "").length ===
                      0 && (
                      <p className="text-red-500 text-xs mt-1">
                        Option value is required.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      className="text-red-500 text-sm px-4 py-2 border rounded"
                      onClick={() => deleteOption(option.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-white bg-gray-800 px-4 py-2 rounded-md"
                      onClick={() => handleDone(option.id)}
                    >
                      Done
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="flex justify-between items-center p-4 border rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleToggle(option.id)}
                >
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      {option.optionName}
                    </span>
                    {option.optionValues
                      .filter((v) => v.text !== "")
                      .map((value, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                        >
                          {value.text}
                        </span>
                      ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {option.optionValues.filter((v) => v.text !== "").length}{" "}
                    variants
                  </span>
                </div>
              )}
            </div>
          ))}
          {options.length < 3 && (
            <button
              className="text-blue-500 text-sm mt-4 p-4"
              onClick={addOption}
            >
              + Add another option
            </button>
          )}
        </div>
        {variants.length > 0 && (
          <div className="mt-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Variants</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b ">
                      <td className="py-2 px-4 ">
                        <div className="flex items-center">
                          {variant.image ? (
                            <div className="relative">
                              <img
                                src={variant.image}
                                alt="variant"
                                className="w-16 h-16"
                              />
                              <button
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                onClick={(e) => {
                                  e.stopPropagation(); // Ngăn sự kiện nổi bọt lên các thành phần cha
                                  handleRemoveImage(index);
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ) : (
                            <label
                              className="cursor-pointer border rounded-lg p-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <CiImageOn className="text-3xl border border-gray-400 rounded-lg p-1" />{" "}
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleImageChange(index, e.target.files![0])
                                }
                                className="hidden"
                              />
                            </label>
                          )}
                          <p className="px-5">
                            {variant.optionValues.join(" / ")}
                          </p>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <CurrencyInput
                          suffix=" ₫"
                          className="border px-4 py-2 w-full rounded-md"
                          placeholder="0 ₫"
                          value={variant.price.toString()}
                          decimalsLimit={0}
                          groupSeparator=","
                          min={0}
                          onValueChange={(value) =>
                            handlePriceChange(index, value || "0")
                          }
                        />
                      </td>
                      <td className="py-2 px-4 flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRowClick(index)}
                          className="hover:bg-gray-100 cursor-pointer rounded-full"
                        >
                          <EllipsisVertical size={16} strokeWidth={1.7} />
                        </Button>
                      </td>
                    </tr>
                    {selectedVariant === index && (
                      <tr>
                        <td colSpan={3}>
                          <Modal
                            variant={variants[index]}
                            onClose={handleCloseModal}
                            stockLocations={stockLocations}
                            onSave={handleSaveModal}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-gray-700">
              Total inventory at Shop location: 0 available
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantOption;
