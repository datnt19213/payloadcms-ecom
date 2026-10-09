import React, { useCallback, useEffect, useState } from "react";

import { APIGet, APIPost } from "../../api";

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
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";
import { LinkBtn } from "../../components/buttons";

import { FaArrowCircleLeft } from "react-icons/fa";

import Notification from "./components/ComponentsCreate/Notification";
import VariantOption from "./components/ComponentsCreate/VariantOption";
import Pricing from "./components/ComponentsCreate/Pricing";
import Inventory from "./components/ComponentsCreate/Inventory";
import Dropzone from "./components/ComponentsCreate/Dropzone";
import axios from "axios";
import { RemoveOneLocalStorage } from "../../utils";
import { CRUDContainer } from "../../components/container";
import { Redirect } from "react-router-dom";

interface Option {
  id: number;
  optionName: string;
  optionValues: { text: string }[];
}

const CreateProduct: AdminViewComponent = ({ canAccessAdmin, user }) => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();
  const { setStepNav } = useStepNav();
  const [tokenPayLoad, setTokenPayLoad] = useState("");

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
  const [options, setOptions] = useState<Option[]>([]); // State for options
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

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

  useEffect(() => {
    console.log("Variants: ", variants);
  }, [variants]);

  useEffect(() => {
    setStepNav([
      {
        label: "Product",
        url: "/admin/collections/products",
      },
      {
        label: "Create Product",
      },
    ]);
  }, [setStepNav]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users/me");
        console.log("Token payload", response.data.token);
        setTokenPayLoad(response.data.token);
        console.log("Token medusa", user.token);
      } catch (error) {
        console.log("Failed to get token payload cms", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
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
  }, [user?.token]);

  const handleName = (val: string) => {
    setProductName(val);
  };

  const handleDescription = (val: string) => {
    console.log("Description from Editor:", val);
    setProductDescription(val);
  };

  const handlePriceChange = (price: number) => {
    // Only update if the price actually changes
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
    setVariants(
      newVariants.map((variant) => ({
        ...variant,
        prices: [
          {
            currency_code: "vnd",
            amount: variant.price,
          },
        ],
        images: variant.images || [],
      }))
    );
  }, []);

  const handleOptionsChange = useCallback((newOptions: Option[]) => {
    setOptions(newOptions);
  }, []);

  const handleDrop = (acceptedFiles: File[]) => {
    const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setMediaFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setMediaPreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const handleRemoveImage = (index: number) => {
    setMediaFiles((files) => files.filter((_, i) => i !== index));
    setMediaPreviews((previews) => previews.filter((_, i) => i !== index));
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

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const uploadImageToPayload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        return response.data.doc.url;
      }
      throw new Error("Failed to upload image");
    } catch (error) {
      console.error("Error uploading image to Payload CMS:", error);
      return null;
    }
  };

  const uniqueOptions = (options) => {
    const unique = [];
    const map = new Map();

    for (const option of options) {
      if (!map.has(option.optionName)) {
        map.set(option.optionName, true); // set any value to Map
        unique.push(option);
      }
    }
    return unique;
  };

  const handleCreateProduct = async () => {
    setSaveProduct(true);
    try {
      let uploadedImages = [];
      let variantImageUrls = [];

      // Xử lý tải hình ảnh sản phẩm
      if (mediaFiles.length > 0) {
        const uploadPromises = mediaFiles.map((file) =>
          uploadImageToPayload(file)
        );
        uploadedImages = await Promise.all(uploadPromises);
      }

      // Xử lý tải hình ảnh variant
      const variantUploadPromises = variants.flatMap((variant) =>
        variant.imageFile ? [uploadImageToPayload(variant.imageFile)] : []
      );
      variantImageUrls = await Promise.all(variantUploadPromises);

      const thumbnailUrl = uploadedImages.length > 0 ? uploadedImages[0] : null;
      const allImages = [...uploadedImages, ...variantImageUrls];

      console.log("Thumbnail url: ", thumbnailUrl);
      console.log("All images: ", allImages);

      const productData = {
        title: productName,
        subtitle: "Subtitle here",
        description: productDescription,
        status: status?.value,
        handle: productName.toLowerCase().replace(/ /g, "-"),
        categories: selectedCategories.map((category) => ({
          id: category.value,
        })),
        options: uniqueOptions(options).map((option) => ({
          title: option.optionName,
        })),
        variants: variants.map((variant, index) => ({
          title: variant.optionValues.join(" / "),
          prices: variant.prices,
          inventory_quantity: variant.available,
          sku: variant.sku,
          barcode: variant.barcode,
          allow_backorder: false,
          manage_inventory: true,
          options: options.map((option, i) => ({
            value: variant.optionValues[i],
          })),
          metadata: variantImageUrls[index]
            ? {
                image: {
                  url: variantImageUrls[index],
                },
              }
            : {},
        })),
        tags: tags.map((tag) => ({ value: tag })),
        thumbnail: thumbnailUrl,
        images: allImages,
      };

      try {
        const response = await APIPost(
          "/admin/products",
          productData,
          user?.token.toString()
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

              console.log("Inventory id: ", inventoryId);

              await Promise.all(
                Object.keys(variants[index].quantities).map(
                  async (locationId) => {
                    const stockedQuantity =
                      variants[index].quantities[locationId];
                    await APIPost(
                      `/admin/inventory-items/${inventoryId}/location-levels`,
                      {
                        location_id: locationId,
                        stocked_quantity: stockedQuantity,
                      },
                      user.token.toString()
                    );
                  }
                )
              );
            })
          );
          RemoveOneLocalStorage("tgs-ls");
          setShowNotification(true);
        }
      } catch (error) {
        console.error("Error creating product:", error);
      }
    } catch (error) {
      console.error("Error during creating product:", error);
    } finally {
      setSaveProduct(false);
    }
  };

  const isUserAuthorized = user?.roles === "admin" || user?.roles === "manager";

  if (!user || !canAccessAdmin || !isUserAuthorized) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  return (
    <CRUDContainer
      title="Create Product"
      toBack="/admin/collections/products"
      className="!max-w-[1296px] !mx-auto"
    >
      {showNotification && (
        <Notification title={productName} status={status?.label || ""} />
      )}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col w-full lg:w-8/12 gap-6">
          <div className="bg-white p-6 rounded-md shadow-md border">
            <div className="!px-5">
              <TextField
                title="Title"
                data={productName}
                onChange={handleName}
              />
            </div>
            <div className="!px-5">
              <Editor
                title="Description"
                withToolbar={true}
                content={productDescription}
                onChange={handleDescription}
              />
            </div>
            {mediaPreviews.length === 0 && <Dropzone onDrop={handleDrop} />}
            {mediaPreviews.map((preview, index) => (
              <div
                key={index}
                className="relative bg-white rounded-lg border-border mb-4 px-5 py-5 mt-5 flex justify-center"
              >
                <img src={preview} alt={`media-${index}`} className="mb-4" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            ))}
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
          {/* <Pricing
              productPrice={productPrice}
              compareAtPrice={compareAtPrice}
              onPriceChange={handlePriceChange}
              onCompareAtPriceChange={handleCompareAtPriceChange}
            /> */}
          <VariantOption
            stockLocations={stockLocations}
            onVariantsChange={handleVariantsChange}
            onOptionsChange={handleOptionsChange}
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
            />
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <TagField title="Tags" onChange={handleTagsChange} />
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
              onClick={handleCreateProduct}
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
    </CRUDContainer>
  );
};

export default CreateProduct;
