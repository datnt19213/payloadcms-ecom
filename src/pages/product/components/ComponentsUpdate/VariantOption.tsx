import React, { useState, useEffect, useCallback } from "react";
import { GoDatabase } from "react-icons/go";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaTrash } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import Modal from "./Modal";
import { Button } from "../../../../components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useDropzone, Accept } from "react-dropzone";
import { Modal as DeleteModal } from "../../../../components/modal";
import { Obj } from "../../../../types";
import { APIDelete } from "../../../../api";
import CurrencyInput from "react-currency-input-field";

interface OptionValue {
  text: string;
}

interface Option {
  id: number | string; // Allow id to be a string for new options
  optionName: string;
  optionValues: OptionValue[];
  isInitial?: boolean; // Thêm thuộc tính isInitial để đánh dấu dữ liệu khởi tạo
}

interface Variant {
  id: string;
  optionValues: { value: string; option_id: string }[];
  price: number;
  available: number;
  image?: { url: string };
  stockLocations: any[];
  sku?: string;
  barcode?: string;
  quantities?: { [key: string]: number };
  isInitial?: boolean; // Thêm thuộc tính isInitial để đánh dấu dữ liệu khởi tạo
}

interface VariantOptionProps {
  initialOptions: Option[];
  initialVariants: Variant[];
  options: Option[];
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
  onOptionsChange: (options: Option[]) => void;
  onDeleteVariant: (variantId: string) => Promise<void>; // Thêm hàm onDeleteVariant
  onDeleteOption: (optionId: string | number) => Promise<void>; // Thêm hàm onDeleteOption vào đây
  stockLocations: any[];
  setInitialOptions: (options: Option[]) => void; // Thêm prop này
  setInitialVariants: (variants: Variant[]) => void;
}

const VariantOption: React.FC<VariantOptionProps> = ({
  initialOptions,
  initialVariants,
  options: initialOptionsState,
  variants: initialVariantsState,
  onVariantsChange,
  onOptionsChange,
  stockLocations,
  onDeleteVariant,
  onDeleteOption,
  setInitialOptions,
  setInitialVariants,
}) => {
  const [options, setOptions] = useState<Option[]>(initialOptionsState); // Use initialOptions to set initial state
  const [collapsedIds, setCollapsedIds] = useState<number[]>([]);
  const [variants, setVariants] = useState<Variant[]>(initialVariantsState); // Use initialVariants to set initial state
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(null);
  const [shouldOpenDropzone, setShouldOpenDropzone] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<Variant | null>(null);
  const [optionToDelete, setOptionToDelete] = useState<Option | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  //--------------------------------------PRODUCTION------------------------------------
  // UseEffect initial option and variant
  useEffect(() => {
    setOptions(initialOptionsState);
  }, [initialOptionsState]);

  useEffect(() => {
    setVariants(initialVariantsState);
  }, [initialVariantsState]);

  // Check condition if selectedVariantIndex hasn't been click and shouldOpenDropzone is true
  useEffect(() => {
    if (shouldOpenDropzone && selectedVariantIndex !== null) {
      open();
      setShouldOpenDropzone(false); // Reset the flag
    }
  }, [shouldOpenDropzone, selectedVariantIndex]);

  const ensureEmptyValueForUnusedOptions = () => {
    const usedOptionIds = new Set(variants.flatMap(variant => variant.optionValues.map(v => v.option_id)));
  
    const updatedOptions = options.map(option => {
      // Kiểm tra nếu option không còn được sử dụng trong bất kỳ variant nào
      if (!usedOptionIds.has(option.id.toString())) {
        // Thêm một giá trị trống nếu option không có giá trị nào
        if (option.optionValues.length === 0 || option.optionValues.every(v => v.text === "")) {
          return {...option, optionValues: [{ text: "" }]};
        }
      }
      return option;
    });
  
    setOptions(updatedOptions);
  };
  
  // Gọi hàm này sau mỗi lần cập nhật variants
  useEffect(() => {
    ensureEmptyValueForUnusedOptions();
  }, [variants]);

  // Add new option
  const addOption = () => {
    if (options.length < 3) {
      const newOptions = [
        ...options,
        {
          id: `new_${options.length + 1}`,
          optionName: "",
          optionValues: [{ text: "" }],
        },
      ];
      setOptions(newOptions);
    }
  };

  // Delete Option
  const deleteOption = (id: number | string) => {
    const option = options.find((option) => option.id === id);
    if (option.isInitial) {
      setOptionToDelete(option);
      setShowDeleteOption(true);
      return;
    }

    const isOptionUsed = variants.some((variant) =>
      variant.optionValues.some((optValue) => optValue.option_id === id)
    );

    const newOptionsTest = options.filter((option) => option.id !== id);

    setOptions(newOptionsTest);
    if (!newOptionsTest.find((opt) => opt.id === id && opt.isInitial)) {
      setVariants(initialVariants); // Reset về trạng thái ban đầu nếu xóa option khởi tạo
    }

    if (isOptionUsed) {
      alert("Cannot delete option as it is used by existing variants.");
      return;
    }

    const newOptions = options.filter((option) => option.id !== id);
    setOptions(newOptions);

    if (isEqualOptions(initialOptions, newOptions)) {
      setVariants(initialVariants);
      onVariantsChange(initialVariants);
    } else {
      const newVariants: any = generateVariants(newOptions);
      setVariants(newVariants);
      onVariantsChange(newVariants);
    }

    onOptionsChange(newOptions); // Notify parent component
  };

  // Catch the event when the option name changes
  const handleOptionNameChange = (id: number | string, value: string) => {
    const newOptions = options.map((option) =>
      option.id === id ? { ...option, optionName: value } : option
    );
    setOptions(newOptions);
  };

  // Update the value of the option in the variants
  const updateOptionValuesInVariants = (optionId, oldValue, newValue) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) => ({
        ...variant,
        optionValues: variant.optionValues.map((optValue) =>
          optValue.option_id === optionId && optValue.value === oldValue
            ? { ...optValue, value: newValue }
            : optValue
        ),
      }))
    );
  };

  // Handling of option value changes
  const handleOptionValueChange = (
    optionId: number | string,
    valueIndex: number,
    value: string
  ) => {
    const oldValue = options.find((opt) => opt.id === optionId)?.optionValues[
      valueIndex
    ]?.text;

    const newOptions = options.map((option) => {
      if (option.id === optionId) {
        const newOptionValues = [...option.optionValues];
        newOptionValues[valueIndex] = {
          ...newOptionValues[valueIndex],
          text: value,
        };

        // Add an empty value option if this is the last input and there is content entered
        if (valueIndex === newOptionValues.length - 1 && value.trim() !== "") {
          newOptionValues.push({ text: "" });
        }
        return { ...option, optionValues: newOptionValues };
      }
      return option;
    });

    console.log("New Options: ", newOptions);

    setOptions(newOptions);
    // Find old value to update in variants

    if (oldValue !== value) {
      updateOptionValuesInVariants(optionId, oldValue, value);

      // Reset variants if the option value was part of initial options
      if (initialOptions.some((opt) => opt.id === optionId)) {
        checkAndResetVariants(
          newOptions,
          initialVariants,
          optionId,
          oldValue,
          value
        );
      }
    }

    // if (initialOptions.some((opt) => opt.id === optionId)) {
    //   console.log("Case initial option ***");
    //   checkAndResetVariants(
    //     newOptions,
    //     initialVariants,
    //     optionId,
    //     oldValue,
    //     value
    //   );
    // }
  };

  // Check if variants need to be reset based on the difference between new options and initial options
  const needToResetVariants = (
    newOptions: Option[],
    initialOptions: Option[]
  ): boolean => {
    // Ví dụ đơn giản: nếu số lượng options thay đổi hoặc nội dung bất kỳ option nào thay đổi
    if (newOptions.length !== initialOptions.length) {
      return true;
    }

    // Kiểm tra chi tiết hơn: nếu option nào đó thay đổi giá trị
    for (let i = 0; i < newOptions.length; i++) {
      const newOpt = newOptions[i];
      const initialOpt = initialOptions.find((opt) => opt.id === newOpt.id);

      // Kiểm tra nếu không tìm thấy option ban đầu hoặc giá trị của option thay đổi
      if (
        !initialOpt ||
        JSON.stringify(newOpt.optionValues) !==
          JSON.stringify(initialOpt.optionValues)
      ) {
        return true;
      }
    }

    return false;
  };

  // Check and reset the variants
  const checkAndResetVariants = (
    newOptions: Option[],
    initialVariants: any[],
    optionId,
    oldValue,
    newValue
  ) => {
    // Sử dụng needToResetVariants để kiểm tra xem có cần reset variants không
    if (needToResetVariants(newOptions, initialOptions)) {
      setVariants((prevVariants) =>
        prevVariants.map((variant) => ({
          ...variant,
          optionValues: variant.optionValues.map((optValue) =>
            optValue.option_id === optionId && optValue.value === oldValue
              ? { ...optValue, value: newValue }
              : optValue
          ),
        }))
      );
    }
  };

  // Delete option value
  const deleteOptionValue = (optionId: number | string, valueIndex: number) => {
    const newOptions = options.map((option) => {
      if (option.id === optionId) {
        const newOptionValues = option.optionValues.filter(
          (_, index) => index !== valueIndex
        );
        return {
          ...option,
          optionValues: newOptionValues.length
            ? newOptionValues
            : [{ text: "" }],
        };
      }
      return option;
    });
    setOptions(newOptions);
  };

  // Handle Done
  const handleDone = (id: number | string) => {
    const numericId =
      typeof id === "string" && id.startsWith("new_")
        ? parseInt(id.replace("new_", ""), 10)
        : id;

    const optionNamesChanged = options.some(
      (option, index) => option.optionName !== initialOptions[index]?.optionName
    );

    const newOption = options.find((option) => option.id === id);
    const isNewOption = initialOptions.every(
      (initialOption) => initialOption.id !== id
    );

    // if (isNewOption) {
    //   console.log("Case new options 1 ***");
    //   const newVariants: any = generateVariants(options);
    //   setVariants(newVariants);
    //   onVariantsChange(newVariants);
    // } else if (
    //   newOption.optionValues.some((value) => value.text !== "") &&
    //   !isEqualOptions(initialOptions, filterEmptyValues(options))
    // ) {
    //   console.log("Case new options 2 ***");
    //   const updatedVariants = updateVariantsWithOptions(options);
    //   setVariants(updatedVariants);
    //   onVariantsChange(updatedVariants);
    // } else {
    //   console.log("Restore variants***");
    //   setVariants(initialVariants);
    //   onVariantsChange(initialVariants);
    // }

    if (newOption.optionValues.some((value) => value.text !== "")) {
      const filteredNewOptionValues = newOption.optionValues.filter(
        (value) => value.text.trim() !== ""
      );

      if (isNewOption) {
        const newVariants = generateVariants(options);
        setVariants(newVariants);
        onVariantsChange(newVariants);
      } else {
        const newVariants = generateVariants(options);

        // Combine old and new variants without duplicates
        const combinedVariants = [...variants];

        newVariants.forEach((newVariant) => {
          const isDuplicate = combinedVariants.some(
            (variant) =>
              JSON.stringify(variant.optionValues) ===
              JSON.stringify(newVariant.optionValues)
          );
          if (!isDuplicate) {
            combinedVariants.push(newVariant);
          }
        });

        setVariants(combinedVariants);
        onVariantsChange(combinedVariants);
      }
    } else {
      setVariants(initialVariants);
      onVariantsChange(initialVariants);
    }

    setCollapsedIds((prevCollapsedIds) => {
      if (!prevCollapsedIds.includes(numericId as number)) {
        return [...prevCollapsedIds, numericId as number];
      }
      return prevCollapsedIds.filter(
        (collapsedId) => collapsedId !== numericId
      );
    });

    onOptionsChange(options); // Notify parent component
  };

  const handleToggle = (id: number | string) => {
    const numericId =
      typeof id === "string" && id.startsWith("new_")
        ? parseInt(id.replace("new_", ""), 10)
        : id;
    setCollapsedIds((prevCollapsedIds) => {
      if (prevCollapsedIds.includes(numericId as number)) {
        return prevCollapsedIds.filter(
          (collapsedId) => collapsedId !== numericId
        );
      }
      return [...prevCollapsedIds, numericId as number];
    });
  };

  const handleRowClick = (index: number) => {
    setSelectedVariant(index);
  };

  const handleSaveModal = (
    locations: string[],
    quantities: any,
    sku: string,
    barcode: string,
    imageFile?: File
  ) => {
    if (selectedVariant !== null) {
      const newVariants = variants.map((variant, index) =>
        index === selectedVariant
          ? {
              ...variant,
              stockLocations: locations,
              quantities,
              sku,
              barcode,
              image: imageFile
                ? { url: URL.createObjectURL(imageFile) }
                : variant.image,
            }
          : variant
      );
      setVariants(newVariants);
      setSelectedVariant(null);
      onVariantsChange(newVariants);
    }
  };

  const handleCloseModal = () => {
    setSelectedVariant(null);
  };

  const filterEmptyValues = (options: Option[]) => {
    return options.map((option) => ({
      ...option,
      optionValues: removeDuplicateValues(
        option.optionValues.filter((value) => value.text.trim() !== "")
      ),
    }));
  };

  const removeDuplicateValues = (values: OptionValue[]) => {
    const seen = new Set();
    return values.filter((item) => {
      const isDuplicate = seen.has(item.text);
      seen.add(item.text);
      return !isDuplicate;
    });
  };

  const isEqualOptions = (options1: Option[], options2: Option[]): boolean => {
    const filteredOptions1 = filterEmptyValues(options1);
    const filteredOptions2 = filterEmptyValues(options2);

    if (filteredOptions1.length !== filteredOptions2.length) return false;

    for (let i = 0; i < filteredOptions1.length; i++) {
      const opt1 = filteredOptions1[i];
      const opt2 = filteredOptions2[i];
      if (
        opt1.optionName !== opt2.optionName ||
        JSON.stringify(opt1.optionValues) !==
          JSON.stringify(opt2.optionValues) ||
        (opt1.isInitial &&
          !isEqualOptionValues(opt1.optionValues, opt2.optionValues))
      ) {
        return false;
      }
    }
    return true;
  };

  const isEqualOptionValues = (
    values1: OptionValue[],
    values2: OptionValue[]
  ): boolean => {
    if (values1.length !== values2.length) return false;
    for (let i = 0; i < values1.length; i++) {
      if (values1[i].text !== values2[i].text) return false;
    }
    return true;
  };

  const handlePriceChange = (
    variantIndex: number,
    value: string | undefined
  ) => {
    const parsedValue = parseFloat(value || "0".replace(/[^\d.-]/g, ""));
    const newVariants = [...variants];
    newVariants[variantIndex].price = isNaN(parsedValue) ? 0 : parsedValue;
    setVariants(newVariants);
    onVariantsChange(newVariants);
  };

  const handleImageChange = (variantIndex: number | null, file: File) => {
    if (variantIndex !== null && variants[variantIndex]) {
      const newVariants = [...variants];
      newVariants[variantIndex].image = { url: URL.createObjectURL(file) };
      setVariants(newVariants);
      onVariantsChange(newVariants);
    } else {
      console.log("Invalid variant index");
    }
  };

  // Process Delete Image
  const handleRemoveImage = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].image = undefined;
    setVariants(newVariants);
    onVariantsChange(newVariants);
  };

  // Delete Variant
  const deleteVariant = (index: number) => {
    const variantToDelete = variants[index];
    if (variantToDelete.isInitial) {
      setVariantToDelete(variantToDelete);
      setShowDeleteModal(true);
    } else {
      const newVariants = variants.filter(
        (_, variantIndex) => variantIndex !== index
      );
      setVariants(newVariants);
      onVariantsChange(newVariants);
    }
  };

  // Confirm Delete Variant
  const confirmDeleteVariant = async (val: Obj) => {
    if (val.key === "NoExecute") {
      setShowDeleteModal(false);
      return;
    } else {
      setLoadingDelete(true);
      await onDeleteVariant(variantToDelete.id); // Gọi hàm onDeleteVariant
      setShowDeleteModal(false);
      setLoadingDelete(false);
    }
  };

  // Confirm Delete Option
  const confirmDeleteOption = async (val: Obj) => {
    if (val.key === "NoExecute") {
      setShowDeleteOption(false);
      return;
    } else {
      setLoadingDelete(true);

      await onDeleteOption(optionToDelete.id); // Gọi hàm onDeleteOption
      setShowDeleteOption(false);
      setLoadingDelete(false);
    }
  };

  const accept: Accept = {
    "image/*": [],
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (selectedVariantIndex !== null && acceptedFiles.length > 0) {
        handleImageChange(selectedVariantIndex, acceptedFiles[0]);
      } else {
        console.log("No variant selected or no files dropped");
      }
    },
    [selectedVariantIndex, variants]
  );

  // Create variations
  const generateVariants = (currentOptions: Option[] = options) => {
    const values = currentOptions
      .filter((option) => option.optionValues.length > 0)
      .map((option) => {
        const uniqueValues: string[] = [];
        option.optionValues.forEach((value) => {
          if (value.text !== "" && !uniqueValues.includes(value.text)) {
            uniqueValues.push(value.text);
          }
        });
        return uniqueValues;
      });

    if (values.length === 0) return [];

    const cartesianProduct = (arrays: string[][]) => {
      return arrays.reduce(
        (acc, array) => {
          return acc.flatMap((item) => array.map((value) => [...item, value]));
        },
        [[]] as string[][]
      );
    };

    return cartesianProduct(values).map((variantValues, index) => ({
      id: `variant_${index}`,
      optionValues: variantValues.map((value, idx) => ({
        value,
        option_id: String(currentOptions[idx].id),
      })),
      price: 0,
      available: 0,
      image: undefined,
      stockLocations: [],
      quantities: {},
      sku: "",
      barcode: "",
    }));
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept,
    onDrop,
    noClick: true,
  });

  const handleOpenDropzone = useCallback((index: number) => {
    setSelectedVariantIndex(index);
    setShouldOpenDropzone(true);
  }, []);

  return (
    <div className="p-6 border rounded-lg">
      <div className="px-5">
        <h2 className="text-lg font-semibold mb-4">Variants</h2>
        <div>
          {options.map((option) => (
            <div key={option.id} className="rounded border p-4 mb-4">
              {!collapsedIds.includes(
                typeof option.id === "string" && option.id.startsWith("new_")
                  ? parseInt(option.id.replace("new_", ""), 10)
                  : (option.id as number)
              ) ? (
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
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    {!variants.some((variant) =>
                      variant.optionValues.some(
                        (optValue) => optValue.option_id === option.id
                      )
                    ) && (
                      <button
                        className="text-red-500 text-sm px-4 py-2 border rounded"
                        onClick={() => deleteOption(option.id)}
                      >
                        Delete
                      </button>
                    )}
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
                                src={variant.image.url}
                                alt="variant"
                                className="w-16 h-16"
                              />
                              <button
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ) : (
                            <div
                              {...getRootProps({
                                className:
                                  "dropzone cursor-pointer border rounded-lg flex justify-center p-2 w-16 h-16",
                              })}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDropzone(index);
                              }}
                            >
                              <CiImageOn className="text-3xl border rounded-lg p-1" />{" "}
                              <input {...getInputProps()} />
                            </div>
                          )}
                          <p className="px-5">
                            {variant.optionValues
                              .map((opt) => opt.value)
                              .join(" / ")}
                          </p>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <CurrencyInput
                          suffix=" ₫"
                          className="border px-4 py-2 w-full rounded-md"
                          placeholder="0 ₫"
                          value={variant?.price?.toString()}
                          decimalsLimit={0}
                          groupSeparator=","
                          onValueChange={(value) =>
                            handlePriceChange(index, value || "0")
                          }
                        />
                      </td>
                      <td className="py-4 px-4 flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRowClick(index)}
                          className="hover:bg-gray-100 cursor-pointer rounded-full"
                        >
                          <EllipsisVertical size={16} strokeWidth={1.7} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteVariant(index)}
                          className="hover:bg-gray-100 cursor-pointer rounded-full text-red-500"
                        >
                          <FaTrash />
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
          </div>
        )}
      </div>

      <DeleteModal
        title="Are you sure you want to delete this variant?"
        handle={confirmDeleteVariant}
        open={showDeleteModal}
        button2="Cancel"
        button="Confirm"
        isLoad={loadingDelete}
      />
      <DeleteModal
        title="Are you sure you want to delete this option?"
        handle={confirmDeleteOption}
        open={showDeleteOption}
        button2="Cancel"
        button="Confirm"
        isLoad={loadingDelete}
      />
    </div>
  );
};

export default VariantOption;
