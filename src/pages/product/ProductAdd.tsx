import React, {useEffect, useState, useCallback} from "react";
import {Redirect} from "react-router-dom";
import {Gutter} from "payload/components/elements";
import Default from "payload/dist/admin/components/templates/Default";
import type {AdminViewComponent} from "payload/config";
import {useStepNav} from "payload/dist/admin/components/elements/StepNav";
import {useConfig} from "payload/components/utilities";
import {getParams} from "../../utils";
import {MdVpnKey, MdVisibility, MdAccessTime} from "react-icons/md";
import axios from "axios";
import {CheckboxField, TextField} from "../../components/fields";
import {Button} from "../../components/ui/button";
import {GridCol10, GridCol2, GridRow2} from "../../components/container";
import {Label} from "../../components/ui/label";
import {Editor} from "../../components/Editor";
import {MdInfoOutline, MdHelpOutline} from "react-icons/md";
import {APIGet, APIPost} from "../../api";
import {toast, ToastContainer} from "react-toastify";
import {Novu} from "@novu/node";
import Select from "react-select";
import {CategoriesComponent, Notification} from "../../components/particals";
import {ProductCategory, Stocklocation} from "../../types";
import ImageUploader from "./ImageUploader";
import {useDropzone} from "react-dropzone";

const attributeOptions = {
  "Màu sắc": [
    {value: "Red", label: "Red"},
    {value: "Blue", label: "Blue"},
    {value: "Green", label: "Green"},
  ],
  "Thương hiệu": [
    {value: "BrandA", label: "BrandA"},
    {value: "BrandB", label: "BrandB"},
    {value: "BrandC", label: "BrandC"},
  ],
  Size: [
    {value: "S", label: "S"},
    {value: "M", label: "M"},
    {value: "L", label: "L"},
    {value: "XL", label: "XL"},
  ],
};

const ProductAdd: AdminViewComponent = ({canAccessAdmin, user}) => {
  const {
    routes: {admin: adminRoute},
  } = useConfig();

  const {setStepNav} = useStepNav();
  const [state, setState] = useState("");
  const [isComponentVisible, setIsComponentVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("chung");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [visibility, setVisibility] = useState("Công khai");
  const [isEditingVisibility, setIsEditingVisibility] = useState(false);
  const [catalogVisibility, setCatalogVisibility] = useState(
    "Cửa hàng và kết quả tìm kiếm"
  );
  const [isEditingCatalogVisibility, setIsEditingCatalogVisibility] =
    useState(false);
  const [status, setStatus] = useState("Bản nháp");
  const [editingStatus, setEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(status);
  const [tempVisibility, setTempVisibility] = useState(visibility);
  const [tempCatalogVisibility, setTempCatalogVisibility] =
    useState(catalogVisibility);
  const [publishDate, setPublishDate] = useState(new Date());
  const [publishDateTime, setPublishDateTime] = useState("");
  const [editingPublishDate, setEditingPublishDate] = useState(false);
  const [productType, setProductType] = useState("Sản phẩm đơn giản");
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [productCodeE, setProductCode] = useState("");
  const [limitPurchase, setLimitPurchase] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTabMedia, setActiveTabMedia] = useState("media");
  const [attributeCombinations, setAttributeCombinations] = useState([]);
  const [expandedAttributes, setExpandedAttributes] = useState([]);
  const [categoriesList, setCategoriesList] = useState<ProductCategory[]>([]);
  const [isManagingLocations, setIsManagingLocations] = useState<
    Stocklocation[]
  >([]);

  const [isActionReload, setActionReload] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState(
    new Array(isManagingLocations.length).fill(false)
  );
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [locationQuantities, setLocationQuantities] = useState(
    new Array(isManagingLocations.length).fill(0)
  );
  const [skus, setSkus] = useState({});
  const [variantLocationQuantities, setVariantLocationQuantities] = useState(
    {}
  );
  const [variantPrices, setVariantPrices] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState({});

  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setThumbnail(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )[0]
    );
  }, []);

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await APIGet("/admin/product-categories", user.token.toString()).then(
        (response) => {
          if (response.data.count > 0) {
            setCategoriesList(response.data.product_categories);
          }
        }
      );
      await APIGet("/admin/stock-locations", user.token.toString()).then(
        (response) => {
          if (response.data.count > 0) {
            setIsManagingLocations(response.data.stock_locations);
            setLocationQuantities(
              new Array(response.data.stock_locations.length).fill(0)
            );
            setSelectedLocations(
              new Array(response.data.stock_locations.length).fill(false)
            ); // Initialize selectedLocations with false
          }
        }
      );
    };

    fetchData();
  }, [isActionReload]);

  useEffect(() => {
    const param = getParams("id");
    if (param) {
      setState(param);
    }
  }, []);

  useEffect(() => {
    console.log("Categories: ", selectedCategories);
  }, [selectedCategories]);

  useEffect(() => {
    const attributeName =
      productType === "Sản phẩm có biến thể" ? "Màu sắc" : "Default Name";
    setAttributes(
      attributes.map((attr) => ({
        ...attr,
        name: attributeName,
      }))
    );
  }, [productType]);

  const handleImageChange = (index, image) => {
    setSelectedImages((prevImages) => ({
      ...prevImages,
      [index]: image,
    }));
  };

  // Hàm tăng
  const handleIncrement = (variantKey, index) => {
    setVariantLocationQuantities((prev) => {
      const updatedQuantities = {...prev};
      if (!updatedQuantities[variantKey]) {
        updatedQuantities[variantKey] = new Array(
          isManagingLocations.length
        ).fill(0);
      }
      updatedQuantities[variantKey][index] += 1;
      return updatedQuantities;
    });
  };

  // Hàm giảm
  const handleDecrement = (variantKey, index) => {
    setVariantLocationQuantities((prev) => {
      const updatedQuantities = {...prev};
      if (!updatedQuantities[variantKey]) {
        updatedQuantities[variantKey] = new Array(
          isManagingLocations.length
        ).fill(0);
      }
      if (updatedQuantities[variantKey][index] > 0) {
        updatedQuantities[variantKey][index] -= 1;
      }
      return updatedQuantities;
    });
  };

  // Hàm xử lý giá
  const handlePriceChange = (variantKey, value) => {
    setVariantPrices((prevPrices) => ({
      ...prevPrices,
      [variantKey]: value,
    }));

    // Kiểm tra nếu giá trị input là trống thì thiết lập lỗi
    if (!value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [variantKey]: {
          ...prevErrors[variantKey],
          price: "Price is required",
        },
      }));
    } else {
      // Xóa lỗi nếu input không trống
      setErrors((prevErrors) => {
        const updatedErrors = {...prevErrors};
        if (updatedErrors[variantKey]) {
          delete updatedErrors[variantKey].price;
          if (Object.keys(updatedErrors[variantKey]).length === 0) {
            delete updatedErrors[variantKey];
          }
        }
        return updatedErrors;
      });
    }
  };

  // Hàm sku
  const handleSkuChange = (variantKey, value) => {
    setSkus((prevSkus) => ({
      ...prevSkus,
      [variantKey]: value,
    }));

    // Kiểm tra nếu giá trị input là trống thì thiết lập lỗi
    if (!value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [variantKey]: {
          ...prevErrors[variantKey],
          sku: "SKU is required",
        },
      }));
    } else {
      // Xóa lỗi nếu input không trống
      setErrors((prevErrors) => {
        const updatedErrors = {...prevErrors};
        if (updatedErrors[variantKey]) {
          delete updatedErrors[variantKey].sku;
          if (Object.keys(updatedErrors[variantKey]).length === 0) {
            delete updatedErrors[variantKey];
          }
        }
        return updatedErrors;
      });
    }
  };

  const reloadActionEvent = (val: boolean) => {
    setActionReload(val);
  };

  // Hàm chọn tất chọn
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedLocations(
      new Array(isManagingLocations.length).fill(!selectAll)
    );
  };

  // Hàm xử lý location
  const handleLocationChange = (index) => {
    const updatedSelectedLocations = selectedLocations.map((selected, i) =>
      i === index ? !selected : selected
    );
    setSelectedLocations(updatedSelectedLocations);

    // Khởi tạo giá trị của locationQuantities nếu cần thiết
    const updatedQuantities = [...locationQuantities];
    if (updatedSelectedLocations[index]) {
      if (updatedQuantities[index] === 0) {
        updatedQuantities[index] = 1;
      }
    } else {
      updatedQuantities[index] = 0;
    }
    setLocationQuantities(updatedQuantities);

    if (updatedSelectedLocations.includes(false)) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  };

  // Hàm generate combinations
  const generateCombinations = (attributes) => {
    const selectedAttributes = attributes.filter(
      (attr) => attr.value.length > 0
    );
    const combinations = [];

    const generate = (comb, index) => {
      if (index === selectedAttributes.length) {
        const formattedComb = comb
          .map((item) => `${Object.values(item)[0]}`)
          .join(" / ");
        combinations.push({
          combination: comb
            .map((item) => `${Object.keys(item)[0]}: ${Object.values(item)[0]}`)
            .join(", "),
          formattedComb,
        });
        return;
      }

      selectedAttributes[index].value.forEach((value) => {
        generate(
          [...comb, {[selectedAttributes[index].name]: value.label}],
          index + 1
        );
      });
    };

    generate([], 0);
    return combinations;
  };

  // Hàm thêm thuộc tính
  const addAttribute = () => {
    const attributeName =
      productType === "Sản phẩm có biến thể" ? "Màu sắc" : "Default Name";
    setAttributes([
      ...attributes,
      {
        id: Date.now(),
        name: attributeName,
        value: [],
        open: true,
      },
    ]);
  };

  // Hàm thêm thuộc tính đang tồn tại
  const addExistingAttribute = (name) => {
    setAttributes([
      ...attributes,
      {
        id: Date.now(),
        name,
        value: [],
        open: true,
      },
    ]);
  };

  // Hàm xoá thuộc tính
  const removeAttribute = (id: number) => {
    const updatedAttributes = attributes.filter(
      (attribute) => attribute.id !== id
    );
    setAttributes(updatedAttributes);
  };

  // Hàm xử lý thay đổi thuộc tính
  const handleAttributeChange = (id: number, field: string, value: any) => {
    setAttributes(
      attributes.map((attribute) =>
        attribute.id === id ? {...attribute, [field]: value} : attribute
      )
    );
  };

  // Toggle thuộc tính
  const toggleAttribute = (id: number) => {
    setAttributes(
      attributes.map((attribute) =>
        attribute.id === id ? {...attribute, open: !attribute.open} : attribute
      )
    );
  };

  // Hàm lưu thuộc tính
  const handleSaveAttributes = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newCombinations = generateCombinations(attributes);
      setAttributeCombinations(newCombinations);
      setAttributes(
        attributes.map((attribute) => ({...attribute, open: false}))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error saving attributes:", error);
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    console.log("New category:", newCategoryName, parentCategory);
    setShowNewCategory(false);
    setNewCategoryName("");
    setParentCategory("");
  };

  const normalPrice = (val: string) => {
    console.log("normal price" + val);
  };

  const salePrice = (val: string) => {
    console.log("sale price" + val);
  };

  const productCode = (val: string) => {
    return;
  };

  const productNameFnc = (val: string) => {
    setProductName(val);
  };

  const productDescFnc = (val: string) => {
    setProductDescription(val);
  };

  const normalizeProductName = (productName) => {
    return productName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const getCategories = (value: any) => {
    setSelectedCategories(value);
  };

  const createInventoryLevels = async (variantId, variantKey) => {
    try {
      if (!variantId) {
        throw new Error("Invalid variant ID");
      }

      const inventoryResponse = await APIGet(
        `/admin/variants/${variantId}/inventory`,
        user?.token.toString()
      );
      const inventories = inventoryResponse.data.variant.inventory;

      for (const inventory of inventories) {
        const inventoryId = inventory.id;
        const entries = Array.from(isManagingLocations.entries());

        for (const [index, location] of entries) {
          if (selectedLocations[index]) {
            const payload = {
              location_id: location.id,
              stocked_quantity:
                variantLocationQuantities[variantKey]?.[index] || 0,
            };
            console.log(
              `Updating inventory for variant ${variantId} at location ${location.id}:`,
              payload
            );

            await APIPost(
              `/admin/inventory-items/${inventoryId}/location-levels`,
              payload,
              user?.token.toString()
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Error creating inventory levels:",
        error.response?.data || error.message || error
      );
    }
  };

  const createVariant = async (productId, options) => {
    try {
      if (!options || options.length === 0) {
        throw new Error("No options found for the product");
      }

      if (!attributeCombinations || attributeCombinations.length === 0) {
        throw new Error("No attribute combinations found");
      }

      for (const combination of attributeCombinations) {
        const variantKey = combination.formattedComb;
        const variantPayload = {
          sku: skus[variantKey] || "",
          title: variantKey,
          prices: [
            {
              amount: parseFloat(variantPrices[variantKey]) || 1000,
              currency_code: "vnd",
            },
          ],
          options: combination.combination.split(", ").map((attr) => {
            const [name, value] = attr.split(": ");
            const option = options.find((opt) => opt.title === name);

            if (!option || !option.id) {
              throw new Error(`Option or option ID not found for ${name}`);
            }

            return {
              option_id: option.id.toString(),
              value,
            };
          }),
          inventory_quantity: (
            variantLocationQuantities[variantKey] || []
          ).reduce((total, qty) => total + qty, 0), // Tổng số lượng cho các location
        };

        console.log("Creating variant with payload:", variantPayload);

        const variantResponse = await APIPost(
          `/admin/products/${productId}/variants`,
          variantPayload,
          user?.token.toString()
        );

        if (!variantResponse || !variantResponse.data) {
          throw new Error("Variant response or response data is undefined");
        }

        // Fetch the list of variants for the product
        const fetchedVariantsResponse = await APIGet(
          `/admin/products/${productId}/variants`,
          user?.token.toString()
        );

        if (
          !fetchedVariantsResponse.data ||
          !fetchedVariantsResponse.data.variants
        ) {
          throw new Error("Failed to retrieve the variants.");
        }

        const createdVariant = fetchedVariantsResponse.data.variants.find(
          (v) => v.title === combination.formattedComb
        );

        if (!createdVariant) {
          throw new Error(
            `Variant with title ${combination.formattedComb} not found.`
          );
        }

        console.log("Retrieved variant:", createdVariant.id);

        await createInventoryLevels(createdVariant.id, variantKey);
      }
    } catch (error) {
      console.error(
        "Error creating variant for combination:",
        error.response?.data || error.message || error
      );
    }
  };

  const handleSubmit = async () => {
    let validationErrors = {};

    attributeCombinations.forEach((combination) => {
      const variantKey = combination.formattedComb;

      if (!variantPrices[variantKey]?.trim()) {
        validationErrors[variantKey] = {
          ...validationErrors[variantKey],
          price: "Price is required",
        };
      }

      if (!skus[variantKey]?.trim()) {
        validationErrors[variantKey] = {
          ...validationErrors[variantKey],
          sku: "SKU is required",
        };
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    const formattedCategories = selectedCategories.map((id) => ({id}));
    const options = attributes.map((attribute) => ({
      title: attribute.name,
    }));

    let dataForm = {
      title: productName,
      subtitle: productName.toLowerCase(),
      description: productDescription,
      handle: normalizeProductName(productName),
      is_giftcard: false,
      categories: formattedCategories,
      options,
      thumbnail: thumbnail ? thumbnail.name : null,
    };

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          if (user.token) {
            const response = await APIPost(
              "/admin/products",
              dataForm,
              user?.token.toString()
            );

            if (response.success) {
              const productId = response.data.product.id;
              const productOptions = response.data.product.options;

              if (productOptions && productOptions.length > 0) {
                await createVariant(productId, productOptions);
              } else {
                console.error("No options found for the product");
              }

              try {
                const novuResponse = await axios.post(
                  "https://novu-api.dev-tn.com/v1/events/trigger",
                  {
                    name: "notification",
                    to: {
                      subscriberId: "6698b985d252266aca5ff1b0",
                    },
                    payload: {dataForm},
                    tenant: null,
                  },
                  {
                    headers: {
                      Authorization: "ApiKey 182af8725dbdba63fbe8decb8701391f",
                      "Content-Type": "application/json",
                    },
                  }
                );

                console.log("Event triggered successfully", novuResponse.data);
              } catch (error) {
                console.error("Error triggering event", error);
              }

              resolve("Product created successfully");
            } else {
              reject("Product creation failed");
            }
          } else {
            reject("User is not authenticated");
          }
        } catch (error) {
          reject("Product creation failed");
        }
      }),
      {
        pending: "Creating product, please wait...",
        success: "Product created successfully",
        error: "Product creation failed",
      }
    );
  };

  const handleStatusChange = (event) => {
    setTempStatus(event.target.value);
  };

  const handleVisibilityChange = (event) => {
    setTempVisibility(event.target.value);
  };

  const handleCatalogVisibilityChange = (event) => {
    setTempCatalogVisibility(event.target.value);
  };

  const saveStatus = () => {
    setStatus(tempStatus);
    setEditingStatus(false);
  };

  const cancelStatusEdit = () => {
    setTempStatus(status);
    setEditingStatus(false);
  };

  const saveVisibility = () => {
    setVisibility(tempVisibility);
    setIsEditingVisibility(false);
  };

  const cancelVisibilityEdit = () => {
    setTempVisibility(visibility);
    setIsEditingVisibility(false);
  };

  const saveCatalogVisibility = () => {
    setCatalogVisibility(tempCatalogVisibility);
    setIsEditingCatalogVisibility(false);
  };

  const cancelCatalogVisibilityEdit = () => {
    setTempCatalogVisibility(catalogVisibility);
    setIsEditingCatalogVisibility(false);
  };

  const handleDateChange = (event) => {
    setPublishDate(new Date(event.target.value));
  };

  const handleTimeChange = (event) => {
    const time = event.target.value.split(":");
    const hours = parseInt(time[0], 10);
    const minutes = parseInt(time[1], 10);
    setPublishDate((prev) => {
      const newDate = new Date(prev);
      newDate.setHours(hours, minutes);
      return newDate;
    });
  };

  const saveDate = () => {
    const formattedDate = `${publishDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} vào lúc ${publishDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    setPublishDateTime(formattedDate);
    setEditingPublishDate(false);
  };

  const cancelDateEdit = () => {
    setEditingPublishDate(false);
  };

  const toggleExpandedAttribute = (index) => {
    setExpandedAttributes((prevExpandedAttributes) => {
      const updatedExpandedAttributes = [...prevExpandedAttributes];
      updatedExpandedAttributes[index] = !updatedExpandedAttributes[index];
      return updatedExpandedAttributes;
    });
  };

  const toggleVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const isUserAuthorized =
    user?.roles === "admin" ||
    user?.roles === "manager" ||
    user?.roles === "customer";

  if (!user || !canAccessAdmin || !isUserAuthorized) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  const renderAttributesTab = () => {
    if (productType === "Sản phẩm có biến thể") {
      if (attributeCombinations.length === 0) {
        return (
          <div className="dark:text-white dark:bg-transparent flex flex-col items-center justify-center h-screen text-center">
            <img
              aria-hidden="true"
              alt="abstract-icon"
              src="https://openui.fly.dev/openui/50x50.svg?text=🔺"
              className="dark:text-white dark:bg-transparent mb-4"
            />
            <p className="dark:text-white dark:bg-transparent text-muted-foreground">
              No variations yet. Generate them from all added attributes or add
              a new variation manually.
            </p>
          </div>
        );
      } else {
        return (
          <div className="dark:text-white dark:bg-transparent p-6 bg-gray-100 rounded-lg shadow-md px-5 mt-4">
            <div className="dark:text-white dark:bg-transparent flex justify-between items-center mb-4">
              <p className="dark:text-white dark:bg-transparent text-gray-500">
                Variations that do not have prices will not be shown in your
                store.
              </p>
            </div>
            <div className="space-y-2">
              {attributeCombinations.map((combination, index) => {
                const variantKey = combination.formattedComb;
                return (
                  <div key={index}>
                    <div
                      className="flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
                      key={index}
                      onClick={() => toggleExpandedAttribute(index)}
                    >
                      <div>
                        <span className="text-gray-500">#12233</span>
                        {combination?.combination
                          ?.split(", ")
                          .map((item, idx) => (
                            <select
                              className="border p-2 rounded ml-2"
                              key={idx}
                            >
                              <option>{item}</option>
                              <option>Blue</option>
                              <option>Red</option>
                              <option>Yellow</option>
                            </select>
                          ))}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700 transition duration-300">
                          <img
                            aria-hidden="true"
                            alt="menu"
                            src="https://openui.fly.dev/openui/24x24.svg?text=☰"
                          />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700 transition duration-300"
                          onClick={() => removeAttribute(index)}
                        >
                          Xóa
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 transition duration-300">
                          Sửa
                        </button>
                      </div>
                    </div>
                    {expandedAttributes[index] && (
                      <div className="flex flex-col space-y-4">
                        <div
                          className={isComponentVisible ? "block" : "hidden"}
                        >
                          <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-300 transition-all duration-500 ease-in-out">
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-xl font-semibold text-gray-800">
                                Thêm biến thể
                              </h2>
                            </div>
                            <div className="space-y-6 mb-5">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  General<span className="text-red-500">*</span>
                                </h3>
                                <p className="text-gray-500">
                                  Cấu hình thông tin chung cho biến thể này.
                                </p>
                                <div className="mt-4 gap-4">
                                  <div className="flex justify-between space-x-4 mb-4 ">
                                    <ImageUploader
                                      index={index}
                                      image={selectedImages[index]}
                                      onImageChange={handleImageChange}
                                    />
                                    <div className="space-y-2 w-2/4 pl-2">
                                      <label className="block">
                                        <span>Tuỳ chỉnh tiêu đề</span>
                                        <input
                                          type="text"
                                          className="common-input w-full bg-input border border-border rounded p-2"
                                          placeholder="Green / XL..."
                                          value={combination?.formattedComb}
                                          readOnly
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div className="grid gap-4 mb-5">
                                    <div>
                                      <label
                                        htmlFor="sku"
                                        className="block text-sm font-medium text-gray-500 mb-1"
                                      >
                                        Đơn vị lưu kho (SKU)
                                      </label>
                                      <input
                                        type="text"
                                        id="sku"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="SUN-G, JK1234..."
                                        value={skus[variantKey] || ""}
                                        onChange={(e) =>
                                          handleSkuChange(
                                            variantKey,
                                            e.target.value
                                          )
                                        }
                                      />
                                      {errors[variantKey]?.sku && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {errors[variantKey].sku}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2 mt-2">
                                      <label className="block">
                                        <span>Cân nặng (g)</span>
                                        <input
                                          type="text"
                                          className="w-full bg-input border border-border rounded p-2"
                                        />
                                      </label>
                                      <label className="block"></label>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="block">
                                        <span>Kích cỡ (D×R×C)(cm)</span>
                                      </label>
                                      <div className="flex space-x-2">
                                        <input
                                          type="text"
                                          placeholder="Dài"
                                          className="w-full bg-input border border-border rounded p-2"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Rộng"
                                          className="w-full bg-input border border-border rounded p-2"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Cao"
                                          className="w-full bg-input border border-border rounded p-2"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                      <label className="block">
                                        <span>Giá (₫)</span>
                                        <input
                                          type="text"
                                          placeholder="Giá thường (bắt buộc)"
                                          className="w-full bg-input border border-border rounded p-2"
                                          value={
                                            variantPrices[variantKey] || ""
                                          }
                                          onChange={(e) =>
                                            handlePriceChange(
                                              variantKey,
                                              e.target.value
                                            )
                                          }
                                        />
                                        {errors[variantKey]?.price && (
                                          <p className="text-red-500 text-sm mt-1">
                                            {errors[variantKey].price}
                                          </p>
                                        )}
                                      </label>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="block">
                                        <div className="flex justify-between items-center">
                                          <span>Giá ưu đãi (₫)</span>
                                          <a href="#" className="text-primary">
                                            Lên lịch
                                          </a>
                                        </div>
                                        <input
                                          type="text"
                                          className="w-full bg-input border border-border rounded p-2"
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div className="space-y-2 mb-4">
                                    <label className="block">
                                      <span>Trạng thái kho hàng</span>
                                      <select className="w-full bg-input border border-border rounded p-2">
                                        <option>Còn hàng</option>
                                        <option>Hết hàng</option>
                                        <option>Đang về</option>
                                      </select>
                                    </label>
                                  </div>
                                  <div className="space-y-2 mb-4">
                                    <label className="block">
                                      <span>Lớp giao hàng</span>
                                      <select className="w-full bg-input border border-border rounded p-2">
                                        <option>Tương tự bản gốc</option>
                                        <option>Khác bản gốc</option>
                                      </select>
                                    </label>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block">
                                      <span>Mô tả</span>
                                      <textarea className="w-full bg-input border border-border rounded p-2"></textarea>
                                    </label>
                                  </div>
                                  <div className="bg-white rounded-lg mx-auto">
                                    <div className="flex justify-between items-center mb-4">
                                      <h2 className="text-xl font-semibold text-gray-800">
                                        Manage locations
                                      </h2>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                      <p className="text-gray-500 mb-4">
                                        Select locations that stock the selected
                                        variant (0 of 2 selected)
                                      </p>
                                      <button
                                        onClick={handleSelectAll}
                                        className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md mb-4"
                                      >
                                        {selectAll
                                          ? "Unselect All"
                                          : "Select All"}
                                      </button>
                                    </div>
                                    <div className="space-y-4">
                                      {isManagingLocations?.length > 0
                                        ? isManagingLocations?.map(
                                            (location, index) => (
                                              <div
                                                className="flex justify-between items-center p-4 bg-gray-200 rounded-md"
                                                key={location?.id}
                                              >
                                                <div className="flex items-center space-x-4">
                                                  <img
                                                    aria-hidden="true"
                                                    alt="location-icon"
                                                    src="https://openui.fly.dev/openui/24x24.svg?text=🏢"
                                                  />
                                                  <span className="text-gray-800">
                                                    {location?.name}
                                                  </span>
                                                </div>
                                                <div className="flex items-center ">
                                                  {selectedLocations[index] && (
                                                    <div className="flex items-center border border-border rounded-md bg-white">
                                                      <button
                                                        className="px-2 py-1 text-secondary-foreground hover:bg-secondary/80"
                                                        onClick={() =>
                                                          handleDecrement(
                                                            variantKey,
                                                            index
                                                          )
                                                        }
                                                      >
                                                        −
                                                      </button>
                                                      <span className="px-4">
                                                        {isNaN(
                                                          variantLocationQuantities[
                                                            variantKey
                                                          ]?.[index]
                                                        )
                                                          ? 0
                                                          : variantLocationQuantities[
                                                              variantKey
                                                            ]?.[index]}
                                                      </span>
                                                      <button
                                                        className="px-2 py-1 text-secondary-foreground hover:bg-secondary/80"
                                                        onClick={() =>
                                                          handleIncrement(
                                                            variantKey,
                                                            index
                                                          )
                                                        }
                                                      >
                                                        +
                                                      </button>
                                                    </div>
                                                  )}
                                                  <label className="relative inline-flex items-center cursor-pointer mx-4">
                                                    <input
                                                      type="checkbox"
                                                      className="sr-only peer"
                                                      checked={
                                                        selectedLocations[index]
                                                      }
                                                      onChange={() =>
                                                        handleLocationChange(
                                                          index
                                                        )
                                                      }
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                  </label>
                                                </div>
                                              </div>
                                            )
                                          )
                                        : "Không có"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="dark:text-white dark:bg-transparent flex justify-between items-center mt-4">
              <button
                className="dark:text-white dark:bg-transparent bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                onClick={handleSaveAttributes}
              >
                Lưu thuộc tính
              </button>
              <button className="dark:text-white dark:bg-transparent bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300">
                Hủy
              </button>
            </div>
            <p className="dark:text-white dark:bg-transparent text-gray-500 mt-2">
              {attributeCombinations.length} biến thể (Mở ra / Đóng)
            </p>
          </div>
        );
      }
    } else {
      return (
        <div className="dark:text-white dark:bg-transparent space-y-4">
          <TextField
            title="Giá bán thường (₫)"
            data=""
            onChange={normalPrice}
            className="dark:text-white dark:bg-transparent !px-1"
          />
          <TextField
            title="Giá khuyến mãi (₫)"
            data=""
            onChange={salePrice}
            className="dark:text-white dark:bg-transparent !px-1"
          />
          <Button variant="link">Lên lịch</Button>
        </div>
      );
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "chung":
        return renderAttributesTab();
      case "thuoc-tinh":
        return (
          <div className="dark:text-white dark:bg-transparent flex flex-col space-y-4">
            <div className="dark:text-white dark:bg-transparent px-5">
              <input
                type="text"
                placeholder="Add descriptive pieces of information that customers can use to search for this product on your store, such as 'Material' or 'Brand'."
                className="dark:text-white dark:bg-transparent w-full border border-border rounded p-2 bg-input text-foreground mb-4 mt-4"
              />
            </div>
            <div className="dark:text-white dark:bg-transparent flex space-x-2 px-5 mt-4">
              <button
                className="dark:text-white dark:bg-transparent bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={addAttribute}
              >
                Thêm mới
              </button>
              <select
                className="dark:text-white dark:bg-transparent border border-border rounded p-2 bg-input text-foreground"
                onChange={(e) => addExistingAttribute(e.target.value)}
              >
                <option value="">Add existing</option>
                <option value="Màu sắc">Màu sắc</option>
                <option value="Thương hiệu">Thương hiệu</option>
                <option value="Size">Size</option>
              </select>
            </div>
            {attributes.map((attribute, index) => (
              <div
                key={attribute.id}
                className="dark:text-white dark:bg-transparent flex flex-col space-y-2 mt-4 border-t border-border pt-4 px-5"
              >
                <div className="dark:text-white dark:bg-transparent flex items-center justify-between">
                  <label className="dark:text-white dark:bg-transparent text-sm font-medium">
                    {attribute.name || "New attribute"}
                  </label>
                  <div>
                    <button
                      className="dark:text-white dark:bg-transparent text-red-600 hover:text-red-800 mr-2"
                      onClick={() => removeAttribute(attribute.id)}
                    >
                      Xoá
                    </button>
                    <button
                      className="dark:text-white dark:bg-transparent text-blue-600 hover:text-blue-800"
                      onClick={() => toggleAttribute(attribute.id)}
                    >
                      {attribute.open ? "Đóng" : "Mở"}
                    </button>
                  </div>
                </div>
                {attribute.open && (
                  <>
                    <div className="dark:text-white dark:bg-transparent flex space-x-4">
                      <div className="dark:text-white dark:bg-transparent w-1/4">
                        <label className="dark:text-white dark:bg-transparent block text-sm font-medium mb-1">
                          Tên
                        </label>
                        <input
                          type="text"
                          value={attribute.name}
                          onChange={(e) =>
                            handleAttributeChange(
                              attribute.id,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="f.e. size or color"
                          className="dark:text-white dark:bg-transparent w-full border border-border rounded p-2 bg-input text-foreground"
                        />
                      </div>
                      <div className="dark:text-white dark:bg-transparent w-3/4">
                        <label className="dark:text-white dark:bg-transparent block text-sm font-medium mb-1">
                          Giá trị (s)
                        </label>
                        <Select
                          isMulti
                          value={attribute.value}
                          onChange={(selected) =>
                            handleAttributeChange(
                              attribute.id,
                              "value",
                              selected
                            )
                          }
                          options={attributeOptions[attribute.name] || []}
                          placeholder="Select values"
                          className="dark:text-white dark:bg-transparent basic-multi-select shadow-md"
                          classNamePrefix="select"
                        />
                      </div>
                    </div>
                    <div className="dark:text-white dark:bg-transparent flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="dark:text-white dark:bg-transparent form-checkbox text-primary"
                      />
                      <label>Có thể nhìn thấy trên trang sản phẩm</label>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="dark:text-white dark:bg-transparent px-5">
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline mt-4 ${
                  attributes.length === 0 || loading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                type="button"
                onClick={handleSaveAttributes}
                disabled={attributes.length === 0 || loading}
              >
                {loading ? "Đang lưu..." : "Lưu thuộc tính"}
              </button>
            </div>
          </div>
        );
      case "nang-cao":
        return (
          <div className="dark:text-white dark:bg-transparent space-y-4 px-5 mt-4">
            <div className="dark:text-white dark:bg-transparent flex items-center space-x-2">
              <label className="dark:text-white dark:bg-transparent w-1/4 text-sm font-medium">
                Ghi chú thanh toán
              </label>
              <textarea className="dark:text-white dark:bg-transparent w-3/4 border border-input rounded p-2 bg-background text-foreground" />
            </div>
            <div className="dark:text-white dark:bg-transparent flex items-center space-x-2">
              <label className="dark:text-white dark:bg-transparent w-1/4 text-sm font-medium">
                Menu đơn hàng
              </label>
              <input
                type="text"
                className="dark:text-white dark:bg-transparent w-3/4 border border-input rounded p-2 bg-background text-foreground"
                defaultValue="0"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dark:text-white dark:bg-transparent">
      <Default>
        <Gutter className="dark:text-white dark:bg-transparent py-12">
          <Notification />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold dark:text-white">
              Update Product
            </h2>
            <Button onClick={handleSubmit}>Đăng</Button>
          </div>

          <GridCol10 className="dark:text-white dark:bg-transparent w-full gap-5">
            <div className="dark:text-white dark:bg-transparent flex-1 col-span-1 lg:col-span-7">
              <div className="dark:text-white dark:bg-transparent bg-white shadow rounded p-5">
                <TextField
                  title="Tên sản phẩm"
                  data={productName}
                  onChange={productNameFnc}
                />
                <Editor
                  title="Mô tả sản phẩm"
                  withToolbar={true}
                  content={productDescription}
                  onChange={productDescFnc}
                />
              </div>
              <div className="dark:text-white dark:bg-transparent p-4 border rounded-lg shadow-sm bg-card text-card-foreground mt-2">
                <div className="dark:text-white dark:bg-transparent flex flex-col">
                  <div className="dark:text-white dark:bg-transparent flex items-center justify-between mb-4 px-5">
                    <div className="dark:text-white dark:bg-transparent flex space-x-4">
                      <div
                        className={`flex items-center space-x-2 text-secondary hover:bg-secondary/10 p-2 rounded cursor-pointer ${
                          activeTab === "chung" && "bg-secondary/10"
                        }`}
                        onClick={() => setActiveTab("chung")}
                      >
                        <img
                          aria-hidden="true"
                          alt="tool"
                          src="https://openui.fly.dev/openui/24x24.svg?text=🛠️"
                        />
                        <span>Chung</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 text-secondary hover:bg-secondary/10 p-2 rounded cursor-pointer ${
                          activeTab === "thuoc-tinh" && "bg-secondary/10"
                        }`}
                        onClick={() => setActiveTab("thuoc-tinh")}
                      >
                        <img
                          aria-hidden="true"
                          alt="attributes"
                          src="https://openui.fly.dev/openui/24x24.svg?text=🔧"
                        />
                        <span>Các thuộc tính</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 text-secondary hover:bg-secondary/10 p-2 rounded cursor-pointer ${
                          activeTab === "nang-cao" && "bg-secondary/10"
                        }`}
                        onClick={() => setActiveTab("nang-cao")}
                      >
                        <img
                          aria-hidden="true"
                          alt="advanced"
                          src="https://openui.fly.dev/openui/24x24.svg?text=⚙️"
                        />
                        <span>Nâng cao</span>
                      </div>
                    </div>
                  </div>
                  <div className="dark:text-white dark:bg-transparent flex items-center space-x-2 px-5">
                    <select
                      className="dark:text-white dark:bg-transparent border border-input rounded p-1 bg-background text-foreground"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    >
                      <option value="Sản phẩm đơn giản">
                        Sản phẩm đơn giản
                      </option>
                      <option value="Sản phẩm có biến thể">
                        Sản phẩm có biến thể
                      </option>
                    </select>
                  </div>
                  <div className="dark:text-white dark:bg-transparent w-full">
                    {renderContent()}
                  </div>
                </div>
              </div>
            </div>
            <div className="dark:text-white dark:bg-transparent p-2 bg-gray-100 col-span-1 lg:col-span-3">
              <div>
                <div className="flex items-center justify-between bg-white rounded-lg border border-border p-4 mb-4">
                  <h3 className="text-xl font-bold">Thumbnail</h3>
                  <button
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"
                    onClick={() => setShowThumbnailModal(true)}
                  >
                    Upload
                  </button>
                </div>
                {thumbnail && (
                  <div className="relative bg-white rounded-lg border border-border mb-4">
                    <img
                      src={thumbnail.preview}
                      alt="Thumbnail"
                      className="w-full h-auto mb-4"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                      onClick={() => setThumbnail(null)}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
              <div className="dark:text-white dark:bg-transparent bg-white shadow p-4 rounded mb-4">
                <h3 className="dark:text-white dark:bg-transparent text-lg font-bold mb-2">
                  Album hình ảnh sản phẩm
                </h3>
                <Button
                  variant="link"
                  className="dark:text-white dark:bg-transparent text-blue-500 hover:text-blue-700"
                  onClick={() => setShowImageLibrary(true)}
                >
                  Thêm ảnh thư viện sản phẩm
                </Button>
              </div>
              <CategoriesComponent
                options={categoriesList}
                token={user.token.toString()}
                reload={reloadActionEvent}
                reloadCurrent={isActionReload}
                onChange={getCategories}
                selectedCategories={selectedCategories}
              />
            </div>
          </GridCol10>
        </Gutter>
      </Default>
      {showImageLibrary && (
        <div className="dark:text-white dark:bg-transparent fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="dark:text-white dark:bg-transparent bg-white dark:bg-zinc-800 rounded-lg shadow-lg w-11/12 max-w-7xl">
            <div className="dark:text-white dark:bg-transparent flex justify-between items-center p-4 dark:border-zinc-700">
              <h2 className="dark:text-white dark:bg-transparent text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Thêm ảnh vào thư viện
              </h2>
              <button
                className="dark:text-white dark:bg-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 focus:outline-none"
                onClick={() => setShowImageLibrary(false)}
              >
                <span className="dark:text-white dark:bg-transparent sr-only">
                  Close
                </span>
                &times;
              </button>
            </div>
            <div className="dark:text-white dark:bg-transparent flex border-b border-muted">
              <button
                className="dark:text-white dark:bg-transparent px-4 py-2 text-primary-foreground bg-primary hover:bg-primary/80"
                onClick={() => setActiveTabMedia("upload")}
              >
                Tải file
              </button>
              <button
                className="dark:text-white dark:bg-transparent px-4 py-2 text-muted-foreground hover:text-primary"
                onClick={() => setActiveTabMedia("media")}
              >
                Media
              </button>
            </div>
            {activeTabMedia === "media" ? (
              <div className="dark:text-white dark:bg-transparent p-4">
                <div className="dark:text-white dark:bg-transparent flex justify-between mb-4">
                  <div>
                    <label className="dark:text-white dark:bg-transparent block text-zinc-700 dark:text-zinc-300 mb-2">
                      Lọc media
                    </label>
                    <div className="dark:text-white dark:bg-transparent flex space-x-2">
                      <select className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded p-2 bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        <option>Tất cả</option>
                      </select>
                      <select className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded p-2 bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        <option>Tất cả các ngày</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="dark:text-white dark:bg-transparent block text-zinc-700 dark:text-zinc-300 mb-2">
                      Tìm kiếm
                    </label>
                    <input
                      type="text"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded p-2 bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 w-[18.5rem]"
                      placeholder="Tìm kiếm"
                    />
                  </div>
                </div>
                <div className="dark:text-white dark:bg-transparent flex">
                  <div className="dark:text-white dark:bg-transparent grid grid-cols-6 gap-4 flex-grow overflow-auto h-[400px]">
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 1"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 2"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 3"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 4"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 5"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 6"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 7"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 8"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 9"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 10"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 11"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 12"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 13"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 14"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 15"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 16"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 17"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                    <img
                      src="https://placehold.co/100x100"
                      alt="Media 18"
                      className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded"
                    />
                  </div>
                  <div className="dark:text-white dark:bg-transparent w-1/4 pl-4">
                    <div className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded p-4">
                      <img
                        src="https://placehold.co/100x100"
                        alt="Selected Media"
                        className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded mb-4"
                      />
                      <p className="dark:text-white dark:bg-transparent text-zinc-700 dark:text-zinc-300 mb-2">
                        LOGO-NVB-PLAY-NEW-01.png
                      </p>
                      <p className="dark:text-white dark:bg-transparent text-zinc-700 dark:text-zinc-300 mb-2">
                        3 Tháng Bảy, 2024
                      </p>
                      <p className="dark:text-white dark:bg-transparent text-zinc-700 dark:text-zinc-300 mb-2">
                        13 KB
                      </p>
                      <p className="dark:text-white dark:bg-transparent text-zinc-700 dark:text-zinc-300 mb-2">
                        512 dài và rộng 512 pixel
                      </p>
                      <a
                        href="#"
                        className="dark:text-white dark:bg-transparent text-blue-500 dark:text-blue-400 hover:underline mb-2 block"
                      >
                        Edit with Elementor AI
                      </a>
                      <a
                        href="#"
                        className="dark:text-white dark:bg-transparent text-blue-500 dark:text-blue-400 hover:underline mb-2 block"
                      >
                        Sửa ảnh
                      </a>
                      <a
                        href="#"
                        className="dark:text-white dark:bg-transparent text-red-500 dark:text-red-400 hover:underline mb-2 block"
                      >
                        Xóa vĩnh viễn
                      </a>
                      <textarea
                        className="dark:text-white dark:bg-transparent border border-zinc-300 dark:border-zinc-600 rounded p-2 bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 w-full mt-4"
                        placeholder="Văn bản thay thế"
                      ></textarea>
                      <a
                        href="#"
                        className="dark:text-white dark:bg-transparent text-blue-500 dark:text-blue-400 hover:underline mt-2 block"
                      >
                        Xem cách mô tả nội dung ảnh
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dark:text-white dark:bg-transparent flex flex-col items-center justify-center h-[500px] bg-background text-foreground border-t-4 border-primary">
                <div className="dark:text-white dark:bg-transparent border border-border rounded-lg p-8 text-center">
                  <p className="dark:text-white dark:bg-transparent text-lg font-semibold mb-2">
                    Thả các tập tin để tải lên
                  </p>
                  <p className="dark:text-white dark:bg-transparent text-muted-foreground mb-4">
                    hoặc
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="dark:text-white dark:bg-transparent cursor-pointer inline-block bg-transparent border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition"
                  >
                    Chọn tập tin
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="dark:text-white dark:bg-transparent hidden"
                    {...getInputProps()}
                  />
                  <p className="dark:text-white dark:bg-transparent text-muted-foreground mt-4">
                    Kích thước tập tin tải lên tối đa: 1 GB
                  </p>
                </div>
              </div>
            )}
            <div className="dark:text-white dark:bg-transparent flex justify-end p-4 border-t border-zinc-200 dark:border-zinc-700">
              <button
                className="dark:text-white dark:bg-transparent bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setShowThumbnailModal(false)}
              >
                Thêm vào thư viện
              </button>
            </div>
          </div>
        </div>
      )}
      {showThumbnailModal && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-zinc-600 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6 max-w-4xl w-full mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Upload Thumbnail
              </h2>
              <button
                id="close-modal"
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 focus:outline-none"
                onClick={() => setShowThumbnailModal(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Used to represent your product during checkout, social sharing and
              more.
            </p>
            <div
              className="border-dashed border-2 border-muted mt-4 rounded-lg p-4 text-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-muted-foreground">
                Drop your images here, or{" "}
                <span className="text-accent cursor-pointer">
                  click to browse
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                1200 × 1600 (3:4) recommended, up to 10MB each
              </p>
            </div>
            {thumbnail && (
              <div className="mt-4">
                <div className="flex items-center justify-between p-2 bg-zinc-100 dark:bg-muted rounded-md border border-border">
                  <img
                    src={thumbnail.preview}
                    alt="Thumbnail image"
                    className="h-8 w-8 rounded-md mr-2"
                  />
                  <span className="text-sm text-foreground">
                    {thumbnail.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(thumbnail.size / 1024).toFixed(2)} KB
                  </span>
                  <button
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => setThumbnail(null)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <button
                className="bg-muted text-muted-foreground hover:bg-muted/80 py-2 px-4 rounded"
                onClick={() => setShowThumbnailModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-primary-foreground hover:bg-primary/80 py-2 px-4 rounded"
                onClick={() => setShowThumbnailModal(false)}
              >
                Save and Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdd;
