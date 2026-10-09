import React, { useCallback, useEffect, useState } from "react";
import { APIGet, APIPost, APIDelete } from "../../api";

import type { AdminViewComponent } from "payload/config";
import { useConfig } from "payload/components/utilities";
import { useStepNav } from "payload/dist/admin/components/elements/StepNav";

import Default from "payload/dist/admin/components/templates/Default";
import { Gutter } from "payload/components/elements";

import { Editor } from "../../components/Editor";
import { TextField } from "../../components/fields";
import { RelationshipMultiField } from "../../components/fields";
import { RelationshipSingleField } from "../../components/fields";
import { TagField } from "../../components/fields";

import { FaArrowCircleLeft } from "react-icons/fa";

import Notification from "./components/ComponentsUpdate/Notification";
import VariantOption from "./components/ComponentsUpdate/VariantOption";
import Pricing from "./components/ComponentsUpdate/Pricing";
import Inventory from "./components/ComponentsUpdate/Inventory";
import Dropzone from "./components/ComponentsUpdate/Dropzone";

import { GetLastStringFromUrl } from "../../utils";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import { RemoveOneLocalStorage } from "../../utils";
import { CRUDContainer } from "../../components/container";
import { SkeletonComp } from "../../components/skeleton";
import { Redirect } from "react-router-dom";

interface Option {
  id: number | string; // Allow id to be a string for new options
  optionName: string;
  optionValues: { text: string }[];
}

const UpdateProduct: AdminViewComponent = ({ canAccessAdmin, user }) => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();
  const { setStepNav } = useStepNav();

  const [productId, setProductId] = useState("");

  const [hasSku, setHasSku] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [trackQuantity, setTrackQuantity] = useState(false);
  const [continueSelling, setContinueSelling] = useState(false);
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isSaveProduct, setSaveProduct] = useState(false);

  const [variants, setVariants] = useState([]); // State for variants
  const [initialVariants, setInitialVariants] = useState([]); // State for initial variants
  const [options, setOptions] = useState<Option[]>([]); // State for options
  const [initialOptions, setInitialOptions] = useState<Option[]>([]); // State for initial options
  const [mediaFile, setMediaFile] = useState<string | null>(null); // State for media file
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]); // State for category options
  const [selectedCategories, setSelectedCategories] = useState<
    { value: string; label: string }[]
  >([]); // State for selected categories
  const [statusOptions, setStatusOptions] = useState([
    { value: "draft", label: "Draft" },
    { value: "proposed", label: "Proposed" },
    { value: "published", label: "Published" },
    { value: "rejected", label: "Rejected" },
  ]); // State for status options
  const [status, setStatus] = useState<{ value: string; label: string } | null>(
    null
  );
  const [tags, setTags] = useState<string[]>([]); // State for tags
  const [stockLocations, setStockLocations] = useState([]);
  const [currentProductImages, setCurrentProductImages] = useState<string[]>(
    []
  ); // State for current product images

  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    setStepNav([
      {
        label: "Product",
        url: "/admin/collections/products",
      },
      {
        label: "Update Product",
      },
    ]);
  }, [setStepNav]);

  useEffect(() => {
    const param = GetLastStringFromUrl();
    if (param) {
      setProductId(param);
    } else {
      window.location.href = "/admin/collections/products";
    }
  }, []);

  const fetchProductData = async () => {
    setSkeleton(true);
    try {
      const productResponse = await APIGet(
        `/admin/products/${productId}`,
        user.token.toString()
      );
      const productData = productResponse.data.product;

      setProductName(productData?.title);
      setProductDescription(productData?.description);
      setSku(productData?.variants[0]?.sku || "");
      setBarcode(productData?.variants[0]?.barcode || "");
      setMediaFile(productData?.thumbnail);
      setCurrentProductImages(productData?.images.map((img) => img.url) || []); // Save current images

      const convertedOptions = productData.options.map((option: any) => ({
        id: option.id,
        optionName: option.title,
        optionValues: removeDuplicateValues(option.values).map(
          (value: any) => ({
            text: value.value,
          })
        ),
        isInitial: true, // Đánh dấu đây là dữ liệu khởi tạo
      }));

      const convertedVariants = await Promise.all(
        productData.variants.map(async (variant: any, index: number) => {
          const variantInventoryResponse = await APIGet(
            `/admin/variants/${variant.id}/inventory`,
            user.token.toString()
          );
          const variantInventoryData =
            variantInventoryResponse.data.variant.inventory;

          const quantities = {};
          variantInventoryData[0]?.location_levels.forEach((level) => {
            quantities[level.location_id] = level.stocked_quantity;
          });

          return {
            id: variant.id,
            optionValues: variant.options.map((opt: any) => ({
              value: opt.value,
              option_id: opt.option_id,
            })),
            price: variant.prices[0]?.amount,
            available: variant.inventory_quantity,
            image: variant.metadata?.image || null, // Get image from metadata
            stockLocations: [],
            sku: variant.sku,
            barcode: variant.barcode,
            quantities: quantities,
            isInitial: true, // Đánh dấu đây là dữ liệu khởi tạo
          };
        })
      );

      setVariants(convertedVariants);
      setInitialVariants(JSON.parse(JSON.stringify(convertedVariants))); // Create a deep copy
      setOptions(convertedOptions);
      setInitialOptions(JSON.parse(JSON.stringify(convertedOptions))); // Create a deep copy
      setSelectedCategories(
        productData.categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      );
      setStatus(
        statusOptions.find((status) => status.value === productData.status) ||
          null
      );
      if (productData) {
        let data = [];
        productData.tags.map((tag) => data.push(tag.value));
        setTags(data);
      }
      setSkeleton(false);
    } catch (error) {
      console.error("Error fetching updated product data:", error);
      setSkeleton(false);
    }
  };

  useEffect(() => {
    if (!productId) return;

    fetchProductData();

    APIGet("/admin/product-categories", user.token.toString()).then(
      (response) => {
        const categoryOptions = response.data.product_categories.map(
          (category: any) => ({
            value: category.id,
            label: category.name,
          })
        );
        setCategoryOptions(categoryOptions);
      }
    );

    APIGet("/admin/stock-locations", user.token.toString()).then((response) => {
      setStockLocations(response.data.stock_locations);
    });
  }, [user?.token, productId, statusOptions]);

  const removeDuplicateValues = (values) => {
    const seen = new Set();
    return values.filter((item) => {
      const isDuplicate = seen.has(item.value);
      seen.add(item.value);
      return !isDuplicate;
    });
  };

  const handleName = useCallback((val: string) => {
    setProductName(val);
  }, []);

  const handleDescription = (val: string) => {
    setProductDescription(val);
    console.log("Val: ", val);
  };

  const handlePriceChange = (price: number) => {
    if (price !== productPrice) {
      setProductPrice(price);
    }
  };

  const handleCompareAtPriceChange = (price: number) => {
    setCompareAtPrice(price);
  };

  const handleQuantityChange = (quantity: number) => {
    setQuantity(quantity);
  };

  const handleTrackQuantityChange = (track: boolean) => {
    setTrackQuantity(track);
  };

  const handleContinueSellingChange = (continueSelling: boolean) => {
    setContinueSelling(continueSelling);
  };

  const handleSkuChange = (sku: string) => {
    setSku(sku);
  };

  const handleBarcodeChange = (barcode: string) => {
    setBarcode(barcode);
  };

  const handleVariantsChange = useCallback((newVariants: any[]) => {
    console.log("New variants: ", newVariants);
    setVariants(newVariants);
  }, []);

  const handleOptionsChange = useCallback((newOptions: Option[]) => {
    console.log("New options: ", newOptions);
    setOptions(newOptions);
  }, []);

  const handleDrop = (acceptedFiles: File[]) => {
    const newMediaFile = URL.createObjectURL(acceptedFiles[0]);
    setMediaFile(newMediaFile);
  };

  const handleRemoveImage = () => {
    setMediaFile(null);
  };

  const handleStatusChange = (selectedStatus: {
    value: string;
    label: string;
  }) => {
    setStatus(selectedStatus);
  };

  const handleCategoryChange = (
    selectedCategories: { value: string; label: string }[]
  ) => {
    setSelectedCategories(selectedCategories);
  };

  const handleTagsChange = useCallback(
    (newTags: string[]) => {
      if (tags.length > 0 && tags.length == newTags.length) return;
      setTags(newTags);
    },
    [tags]
  );

  const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 7); // Generate a random string
    const extension = originalName.split(".").pop(); // Get the file extension
    return `${timestamp}-${randomString}.${extension}`;
  };

  const urlToFile = async (url, filename, mimeType) => {
    try {
      const response = await fetch(url, { mode: "no-cors" });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      return new File([buffer], filename, { type: mimeType });
    } catch (error) {
      console.error("Error fetching URL: ", error);
      throw error;
    }
  };

  const uploadImage = async (file) => {
    if (!file || file.size === 0) {
      throw new Error("File is empty or invalid");
    }

    try {
      const formData = new FormData();
      const uniqueFilename = generateUniqueFilename(file.name);
      formData.append("file", file, uniqueFilename);

      const response = await axios.post(`/api/media`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.doc.url;
    } catch (error) {
      console.error("Error during upload: ", error);
      throw error;
    }
  };

  const createOptions = async (productId, newOptions, userToken) => {
    const optionIdMap = new Map();
    for (const option of newOptions) {
      const optionResponse = await APIPost(
        `/admin/products/${productId}/options`,
        {
          title: option.optionName,
        },
        userToken
      );
      const createdOption = optionResponse.data.product.options.find(
        (opt) => opt.title === option.optionName
      );
      if (createdOption) {
        const optionId = createdOption.id;
        optionIdMap.set(option.id, optionId);
      }
    }
    return optionIdMap;
  };
  const createVariants = async (productId, variants, optionIdMap, userToken) => {
    const images = [];
    for (const variant of variants) {
      const variantData = {
        title: `${variant.optionValues.map((opt) => opt.value).join(" / ")}`,
        options: variant.optionValues.map((opt) => ({
          option_id: optionIdMap.get(opt.option_id) || opt.option_id,
          value: opt.value,
        })),
        prices: [{ currency_code: "vnd", amount: variant.price }],
        inventory_quantity: variant.available,
        sku: variant.sku,
        barcode: variant.barcode,
        metadata: {},
      };
  
      // Tải và lưu ảnh nếu có
      if (variant.image && variant.image.url) {
        try {
          const file = await urlToFile(variant.image.url, generateUniqueFilename("image.jpg"), "image/jpeg");
          const imageUrl = await uploadImage(file);
          images.push(imageUrl);
          variantData.metadata = { image: { url: imageUrl } };
        } catch (error) {
          console.error("Error uploading image for variant:", error);
        }
      }
  
      try {
        // Tạo variant mới
        const response = await APIPost(`/admin/products/${productId}/variants`, variantData, userToken);
        if (response.success && response.data && response.data.product && response.data.product.variants) {
          // Xử lý inventory cho từng variant
          await Promise.all(response.data.product.variants.map(async (newVariant) => {
            const inventoryResponse = await APIGet(`/admin/variants/${newVariant.id}/inventory`, userToken);
            const inventoryData = inventoryResponse.data.variant.inventory;
            
            if (inventoryData && inventoryData.length > 0) {
              const inventoryId = inventoryData[0].id;
              await Promise.all(Object.entries(variant.quantities).map(async ([locationId, quantity]) => {
                const existingLocationLevel = inventoryData[0].location_levels.find(level => level.location_id === locationId);
                if (existingLocationLevel) {
                  await APIPost(`/admin/inventory-items/${inventoryId}/location-levels/${existingLocationLevel.id}`, {
                    stocked_quantity: quantity
                  }, userToken);
                } else {
                  await APIPost(`/admin/inventory-items/${inventoryId}/location-levels`, {
                    location_id: locationId,
                    stocked_quantity: quantity
                  }, userToken);
                }
              }));
            }
          }));
        }
      } catch (error) {
        console.error("Error creating product variants:", error);
      }
    }
    return images;
  };  

  const updateProductImages = async (productId, updatedProduct, userToken) => {
    try {
      await APIPost(`/admin/products/${productId}`, updatedProduct, userToken);
      console.log("Product images updated successfully.");
    } catch (error) {
      console.error("Error updating product images:", error);
    }
  };

  const handleSaveProduct = async () => {
    setSaveProduct(true);

    try {
      const filteredOptions = options.map((option) => ({
        ...option,
        optionValues: option.optionValues.filter(
          (value) => value.text.trim() !== ""
        ),
      }));

      let productImages = [...currentProductImages]; // Array to hold all product images, including new ones
      let thumbnailUrl = null;

      // Upload new main product image if present
      if (mediaFile && mediaFile.startsWith("blob:")) {
        const file = await urlToFile(
          mediaFile,
          generateUniqueFilename("image.jpg"),
          "image/jpeg"
        );
        const imageUrl = await uploadImage(file);
        thumbnailUrl = imageUrl; // Save URL for thumbnail
        productImages.push(imageUrl); // Add new image to productImages array
      } else if (mediaFile) {
        thumbnailUrl = mediaFile; // If mediaFile is not new, use the existing URL
      }

      const uniqueProductImages = Array.from(new Set(productImages)); // Loại bỏ các ảnh trùng lặp

      const updatedProduct = {
        title: productName,
        subtitle: "Subtitle here",
        description: productDescription,
        status: status?.value,
        handle: productName.toLowerCase().replace(/ /g, "-"),
        categories: selectedCategories.map((category) => ({
          id: category.value,
        })),
        tags: tags.map((tag) => ({ value: tag })),
        images: uniqueProductImages, // Include all images (old and new)
        thumbnail: thumbnailUrl, // Update thumbnail
      };

      const newOptions = filteredOptions.filter(
        (option) =>
          !initialOptions.some(
            (initialOption) => initialOption.id === option.id
          )
      );

      let optionIdMap = new Map();

      if (newOptions.length > 0) {
        optionIdMap = await createOptions(
          productId,
          newOptions,
          user.token.toString()
        );

        const allOptions = [...initialOptions, ...newOptions].map((option) => ({
          ...option,
          id: optionIdMap.get(option.id) || option.id,
          optionValues: option.optionValues.filter(
            (value) => value.text.trim() !== ""
          ),
        }));

        const mappedVariants = variants.map((variant) => ({
          ...variant,
          optionValues: variant.optionValues.map((optValue) => ({
            ...optValue,
            option_id:
              optionIdMap.get(optValue.option_id) || optValue.option_id,
          })),
        }));

        const images = await createVariants(
          productId,
          mappedVariants,
          optionIdMap,
          user.token.toString()
        );

        updatedProduct.images = [...uniqueProductImages, ...images];
      } else {
        const images = await updateExistingOptionsAndVariants(
          updatedProduct,
          uniqueProductImages
        );
        updatedProduct.images = [...uniqueProductImages, ...images];
      }

      // Always call updateProductImages
      await updateProductImages(
        productId,
        updatedProduct,
        user.token.toString()
      );

      await fetchProductData();
      RemoveOneLocalStorage("tgs-ls");
      setShowNotification(true);
    } catch (error) {
      console.error("Error during product update:", error);
    } finally {
      setSaveProduct(false);
    }
  };

  const updateExistingOptionsAndVariants = async (
    updatedProduct,
    productImages
  ) => {
    const allOptions = options.map((option) => ({
      ...option,
      optionValues: option.optionValues.filter(
        (value) => value.text.trim() !== ""
      ),
    }));

    const mappedVariants = variants.map((variant) => ({
      ...variant,
      optionValues: variant.optionValues.map((optValue) => ({
        ...optValue,
        option_id: optValue.option_id,
      })),
    }));

    const newVariants = mappedVariants.filter((variant) => !variant.isInitial);

    const images = [];
    try {
      if (newVariants.length > 0) {
        const optionIdMap = new Map(
          allOptions.map((option) => [option.id, option.id])
        );

        console.log("Option map", optionIdMap);

        const newImages = await createVariants(
          productId,
          newVariants,
          optionIdMap,
          user.token.toString()
        );

        images.push(...newImages);
      } else {
        await Promise.all(
          mappedVariants.map(async (variant) => {
            let imageUrl = variant.image?.url || null;

            if (variant.image && variant.image.url.startsWith("blob:")) {
              const response = await fetch(variant.image.url);
              const buffer = await response.arrayBuffer();
              const file = new File(
                [buffer],
                generateUniqueFilename("image.jpg"),
                { type: "image/jpeg" }
              );
              imageUrl = await uploadImage(file);
              images.push(imageUrl);
            }

            const variantData = {
              title: `${variant.optionValues
                .map((opt) => opt.value)
                .join(" / ")}`,
              sku: variant.sku,
              barcode: variant.barcode,
              inventory_quantity: variant.available,
              manage_inventory: true,
              prices: [
                {
                  currency_code: "vnd",
                  amount: variant.price,
                },
              ],
              options: variant.optionValues.map((opt) => ({
                option_id: opt.option_id,
                value: opt.value,
              })),
              metadata: variant.metadata || {},
            };

            if (imageUrl) {
              variantData.metadata = {
                ...variantData.metadata,
                image: { url: imageUrl },
              };
            }

            const response = await APIPost(
              `/admin/products/${productId}/variants/${variant.id}`,
              variantData,
              user.token.toString()
            );
            if (response.success) {
              const variantIds = response.data.product.variants.map(
                (variant: any) => variant.id
              );
              await Promise.all(
                variantIds.map(async (variantId: string, index: number) => {
                  const inventoryResponse = await APIGet(
                    `/admin/variants/${variantId}/inventory`,
                    user.token.toString()
                  );
                  const inventoryId =
                    inventoryResponse.data.variant.inventory[0].id;

                  await Promise.all(
                    Object.keys(variants[index].quantities).map(
                      async (locationId) => {
                        const stockedQuantity =
                          variants[index].quantities[locationId];

                        try {
                          const existingLocationLevel =
                            inventoryResponse.data.variant.inventory[0].location_levels.find(
                              (level) => level.location_id === locationId
                            );
                          if (existingLocationLevel) {
                            await APIPost(
                              `/admin/inventory-items/${inventoryId}/location-levels/${locationId}`,
                              { stocked_quantity: stockedQuantity },
                              user.token.toString()
                            );
                          } else {
                            // Tạo location level mới
                            await APIPost(
                              `/admin/inventory-items/${inventoryId}/location-levels`,
                              {
                                location_id: locationId,
                                stocked_quantity: stockedQuantity,
                              },
                              user.token.toString()
                            );
                          }
                        } catch (error) {
                          console.error(
                            "Error updating location level:",
                            error
                          );
                        }
                      }
                    )
                  );
                })
              );
              RemoveOneLocalStorage("tgs-ls");
              setShowNotification(true);
            }
          })
        );
      }

      if (productImages.length > 0) {
        updatedProduct.images = [...updatedProduct.images, ...productImages];
      }
    } catch (error) {
      console.error("Error updating existing options and variants:", error);
    }
    return images;
  };

  const onDeleteVariant = async (variantId) => {
    setSaveProduct(true);
    try {
      // Lấy thông tin inventory của variant
      const inventoryResponse = await APIGet(
        `/admin/variants/${variantId}/inventory`,
        user.token.toString()
      );

      const inventoryData = inventoryResponse.data.variant.inventory;

      // Xóa từng inventory item liên quan
      for (const item of inventoryData) {
        await APIDelete(
          `/admin/inventory-items`,
          item.id,
          user.token.toString()
        );
      }

      // Xóa variant sau khi đã xóa các inventory item
      await APIDelete(
        `/admin/products`,
        `${productId}/variants/${variantId}`,
        user.token.toString()
      );

      console.log(`Variant ${variantId} deleted successfully`);
      await fetchProductData();
      setSaveProduct(false);
    } catch (error) {
      console.error(`Error deleting variant ${variantId}:`, error);
      setSaveProduct(false);
    }
  };

  const deleteOption = async (optionId) => {
    setSaveProduct(true);
    try {
      await APIDelete(
        `/admin/products`,
        `/${productId}/options/${optionId}`,
        user.token.toString()
      );
      console.log(`Option ${optionId} deleted successfully`);

      await fetchProductData();
      setSaveProduct(false);
    } catch (error) {
      console.error(`Error deleting option ${optionId}:`, error);
    }
    setSaveProduct(false);
  };

  const isUserAuthorized = user?.roles === "admin" || user?.roles === "manager";

  if (!user || !canAccessAdmin || !isUserAuthorized) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  return (
    <CRUDContainer
      title="Update Product"
      toBack="/admin/collections/products"
      className="!max-w-[1296px] !mx-auto"
    >
      {skeleton ? (
        <SkeletonComp />
      ) : (
        <div>
          {showNotification && (
            <Notification title={productName} status={status?.label || ""} />
          )}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col w-full lg:w-8/12 gap-6">
              <div className="bg-white p-6 rounded-md shadow-md border">
                {skeleton ? (
                  <SkeletonComp />
                ) : (
                  <div className="!px-5">
                    <TextField
                      title="Title"
                      data={productName}
                      onChange={handleName}
                    />
                  </div>
                )}
                <div className="!px-5">
                  <Editor
                    title="Description"
                    withToolbar={true}
                    content={productDescription}
                    onChange={handleDescription}
                  />
                </div>
                {!mediaFile && <Dropzone onDrop={handleDrop} />}
                {mediaFile && (
                  <div className="relative bg-white rounded-lg border-border mb-4 px-5 py-5 mt-5 flex justify-center">
                    <img src={mediaFile} alt="media" className="mb-4" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                )}
                <div className="p-5 rounded-md w-full max-w-full">
                  <label className="block text-gray-700 text-sm font-bold">
                    Category
                  </label>
                  <RelationshipMultiField
                    className="!px-0"
                    options={categoryOptions}
                    defaultValue={selectedCategories}
                    onChange={handleCategoryChange}
                    size="fit"
                  />
                </div>
              </div>
              {/* Pricing*/}
              {/* <Pricing
              productPrice={productPrice}
              compareAtPrice={compareAtPrice}
              onPriceChange={handlePriceChange}
              onCompareAtPriceChange={handleCompareAtPriceChange}
            /> */}
              {/* Variants */}
              <VariantOption
                stockLocations={stockLocations}
                initialOptions={initialOptions}
                initialVariants={initialVariants}
                options={options}
                variants={variants}
                onVariantsChange={handleVariantsChange}
                onOptionsChange={handleOptionsChange}
                onDeleteVariant={onDeleteVariant}
                onDeleteOption={deleteOption} // Truyền hàm deleteOption vào đây
                setInitialOptions={setInitialOptions} // Truyền setInitialOptions vào đ
                setInitialVariants={setInitialVariants}
              />
            </div>
            <div className="flex flex-col w-full lg:w-4/12 gap-6">
              <div className="bg-white rounded-md shadow-md p-6">
                <label className="block mb-1 text-gray-700 text-sm font-bold">
                  Status
                </label>
                <RelationshipSingleField
                  className="!px-0"
                  options={statusOptions}
                  onChange={handleStatusChange}
                  size="fit"
                  defaultValue={status}
                />
              </div>
              <div className="bg-white p-6 rounded-md shadow-md">
                <TagField
                  title="Tags"
                  onChange={handleTagsChange}
                  defaultData={tags}
                />
              </div>
              <div className="flex items-center p-4 border border-purple-500 rounded-lg cursor-pointer hover:bg-purple-100 transition">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-purple-600 border-purple-500 focus:ring-purple-500"
                  defaultChecked
                />
                <label className="ml-3 flex flex-col">
                  <span className="font-bold text-black">
                    Kênh Thương mại điện tử
                  </span>
                </label>
              </div>
              <div className="bg-white rounded-md shadow-md">
                <Button
                  className={`${
                    isSaveProduct && "pointer-events-none select-none"
                  } bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2 w-full`}
                  onClick={handleSaveProduct}
                  disabled={isSaveProduct}
                >
                  {isSaveProduct ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Product"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CRUDContainer>
  );
};

export default UpdateProduct;
