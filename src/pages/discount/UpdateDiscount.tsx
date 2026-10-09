import React, { useEffect, useState, useRef } from "react";
import type { AdminViewComponent } from "payload/config";
import { useConfig } from "payload/components/utilities";
import { useStepNav } from "payload/dist/admin/components/elements/StepNav";

import { CRUDContainer } from "../../components/container";
import { GetLastStringFromUrl } from "../../utils";

import { HiDotsVertical, HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa";

import { APIGet, APIPost, APIDelete } from "../../api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiTrash } from "react-icons/bi";

import { RelationshipMultiField } from "../../components/fields";
import { AiOutlineLeft, AiOutlinePlus } from "react-icons/ai";
import { NoDataAvailableTable } from "../../components/empty/Empty";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import { Checkbox } from "../../components/ui/checkbox";
import { SkeletonTable } from "../../components/skeleton";
import { StatusSpan } from "../../components/elements";
import { capitalizeFirstLetter, GetStatusColor } from "../../utils";
import { ChevronDownIcon, ClockIcon, Loader2 } from "lucide-react";

import { Modal as DeleteModal } from "../../components/modal";
import { Obj } from "../../types";
import axios from "axios";
import { Enum } from "../../common/data";

import { DatePickerWithRange } from "../discount/components/calendar";
import { format, parseISO, addHours } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Paginations } from "../../components/particals";
import { Redirect } from "react-router-dom";
import CurrencyInput from "react-currency-input-field";

const BASE_URL = Enum.MEDUSA_ENDPOINT;
interface Region {
  value: string;
  label: string;
}

interface Condition {
  id: string;
  type: string;
  operator: string;
  discount_rule_id: string;
}

interface Rule {
  id: string;
  description: string;
  type: string;
  value: number;
  allocation: string;
  conditions: Condition[];
}

interface Discount {
  id: string;
  code: string;
  rule: Rule;
  regions: Region[];
  is_disabled: boolean;
  usage_count: number;
  metadata?: Record<string, string>;
}

interface MetadataEntry {
  key: string;
  value: string;
}

interface DiscountData {
  starts_at: string | null;
  ends_at: string | null;
  usage_limit?: number;
}

const UpdateDiscount: AdminViewComponent = ({ canAccessAdmin, user }) => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();
  const { setStepNav } = useStepNav();

  const [discountId, setDiscountId] = useState<string | null>(null);
  const [discountData, setDiscountData] = useState<Discount | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);

  const [code, setCode] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [metadata, setMetadata] = useState<{ key: string; value: string }[]>(
    []
  );
  const [configuration, setConfiguration] = useState([]);

  const [deletedMetadataKeys, setDeletedMetadataKeys] = useState<string[]>([]);
  const [valueType, setValueType] = useState<string>("percentage");
  const [showConditionModal, setShowConditionModal] = useState<boolean>(false);

  const [showConditionAddInModal, setShowConditionAddInModal] =
    useState<boolean>(false);
  const [showConditionAddInTagModal, setShowConditionAddTagInModal] =
    useState<boolean>(false);
  const [showConditionAddInCustomerModal, setShowConditionAddCustomerInModal] =
    useState<boolean>(false);

  const [selectedProductAddCondition, setSelectedProductAddCondition] =
    useState("in");
  const [selectedAddTagsCondition, setSelectedAddTagsCondition] =
    useState("in");
  const [selectedAddCustomersCondition, setSelectedAddCustomersCondition] =
    useState("in");

  const [deletedAddConditionAll, setDeleteAddConditionAll] =
    useState<boolean>(false);
  const [deletedAddTagConditionAll, setDeleteAddTagConditionAll] =
    useState<boolean>(false);
  const [deletedAddCustomerConditionAll, setDeleteAddCustomerConditionAll] =
    useState<boolean>(false);

  const [selectedAddProductToCall, setSelectedAddProductToCall] = useState<
    string[]
  >([]);
  const [selectedAddTagToCall, setSelectedAddTagToCall] = useState<string[]>(
    []
  );
  const [selectedAddCustomerToCall, setSelectedAddCustomerToCall] = useState<
    string[]
  >([]);

  // Products
  const [showAddConditionModal, setShowAddConditionModal] = useState(false);
  const [selectedProductCondition, setSelectedProductCondition] =
    useState("in");
  const [deletedAll, setDeleteAll] = useState<boolean>(false);
  const [deletedAddProductAll, setDeleteAddProductAll] =
    useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedAddProduct, setSelectedAddProduct] = useState<string[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addProducts, setAddProducts] = useState([]);

  // Tags
  const [tags, setTags] = useState([]);
  const [addTags, setAddTags] = useState([]);
  const [showAddTags, setShowAddTags] = useState(false);
  const [showTagSelectionModal, setShowTagSelectionModal] = useState(false);
  const [selectedTagsCondition, setSelectedTagsCondition] = useState("in");
  const [deletedTagsAll, setDeleteTagsAll] = useState(false);
  const [deletedAddTagsAll, setDeleteAddTagsAll] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAddTags, setSelectedAddTags] = useState<string[]>([]);

  // Customer group
  const [showCustomerSelectionModal, setShowCustomerSelectionModal] =
    useState(false);
  const [customers, setCustomers] = useState([]);
  const [addCustomers, setAddCustomer] = useState([]);
  const [selectedCustomerCondition, setSelectedCustomerCondition] =
    useState("in");
  const [deletedCustomerAll, setDeleteCustomerAll] = useState<boolean>(false);
  const [deletedAddCustomerAll, setDeleteAddCustomerAll] =
    useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string[]>([]);
  const [selectedAddCustomer, setSelectedAddCustomer] = useState<string[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const popoverRef = useRef(null);
  const [popoverAddOpen, setPopoverAddOpen] = useState<boolean>(false);
  const popoverAddRef = useRef(null);
  const [popoverOpenConfiguration, setPopoverOpenConfiguration] =
    useState<boolean>(false);
  const popoverAddRefConfiguration = useRef(null);
  const [showAddConfiguration, setShowAddConfiguration] =
    useState<boolean>(false);

  // Deleted
  const [conditionId, setConditionId] = useState("");
  const [conditionDeletedId, setCondtionDeletedId] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [showDeleteTagModal, setShowDeleteTagModal] = useState(false);
  const [showDeleteCustomerModal, setShowDeleteCustomerModal] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);

  const [showConfiguration, setShowConfiguration] = useState(false);

  const [checked, setChecked] = useState(false);
  const [checkedExpiry, setCheckedExpiry] = useState(false);
  const [checkedLimit, setCheckedLimit] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("00:00");

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [expiryTime, setExpiryTime] = useState<string>("00:00");

  const [usageLimit, setUsageLimit] = useState<string>("5");

  const currentHour = startTime.split(":")[0];
  const currentMinute = startTime.split(":")[1].split(" ")[0];

  const currentHourExpiry = expiryTime.split(":")[0];
  const currentMinuteExpiry = expiryTime.split(":")[1].split(" ")[0];

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  //
  const [currentPageAddCondition, setCurrentPageAddCondition] = useState(1);
  const [totalPageAddCondition, setTotalPageAddCondition] = useState<number>(0);

  // Get products
  const getProduct = async () => {
    setSkeleton(true);
    try {
      const response = await APIGet(
        `/admin/products?limit=10&offset=${(currentPage - 1) * 10}`,
        user?.token.toString()
      );
      setTotalPage(Math.ceil(response.data.count / 10));
      setAddProducts(response.data.products);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setSkeleton(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [currentPage]);

  // Pagination product
  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  // Get product tags
  const getProductTags = async () => {
    setSkeleton(true);
    try {
      const response = await APIGet(
        "/admin/product-tags",
        user?.token.toString()
      );
      setAddTags(response.data.product_tags);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setSkeleton(false);
    }
  };

  // Get customer group
  const getCustomerGroup = async () => {
    setSkeleton(true);
    try {
      const response = await APIGet(
        "/admin/customer-groups",
        user?.token.toString()
      );
      console.log(response);
      setAddCustomer(response.data.customer_groups);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setSkeleton(false);
    }
  };

  // UseEffect
  useEffect(() => {
    getProductTags();
    getCustomerGroup();
  }, []);

  useEffect(() => {
    const param = GetLastStringFromUrl();
    console.log("Param:", param);

    if (param) {
      setDiscountId(param);
    } else {
      console.error("No discount ID found in URL.");
      window.location.href = "/admin/collections/discount";
    }
  }, []);

  useEffect(() => {
    setStepNav([
      {
        label: "Discount",
        url: "/admin/collections/discount",
      },
      {
        label: "Update Discount",
      },
    ]);
  }, [setStepNav]);

  // Fetch discount data
  const fetchDiscountData = async () => {
    if (!discountId || !user?.token) {
      console.error("Missing discountId or user token.");
      return;
    }

    try {
      const discountResponse = await APIGet(
        `/admin/discounts/${discountId}`,
        user.token.toString()
      );
      const discount = discountResponse.data.discount;
      console.log(discountResponse.data);
      setDiscountData(discount);

      const regionsOptions = discount.regions.map((region: any) => ({
        value: region.id,
        label: region.name,
      }));

      if (discount.starts_at) {
        setShowConfiguration(true);
        setStartDate(discount.starts_at);
        setStartTime(formatUTC(discount.starts_at));
        setChecked(true);
      }

      if (discount.ends_at) {
        setExpiryDate(discount.ends_at);
        setExpiryTime(formatUTC(discount.ends_at));
        setCheckedExpiry(true);
      }

      if (discount.usage_limit !== null) {
        setCheckedLimit(true);
        setUsageLimit(discount.usage_limit);
      }

      const tempConfig = [];

      if (discount.starts_at) {
        tempConfig.push({
          key: "startDate",
          label: "Start date",
          value: formatDate(discount.starts_at),
        });
      }

      if (discount.ends_at) {
        tempConfig.push({
          key: "endDate",
          label: "End date",
          value: formatDate(discount.ends_at),
        });
      }

      if (discount.usage_limit !== null) {
        tempConfig.push({
          key: "usageLimit",
          label: "Number of redemptions",
          value: { date: "", time: discount.usage_limit },
        });
      }

      setConfiguration(tempConfig);

      setRegions(regionsOptions);
      setSelectedRegions(regionsOptions);

      setCode(discount.code);
      setValue(discount.rule.value.toString());
      setValueType(discount.rule.type === "fixed" ? "amount" : "percentage");
      setDescription(discount.rule.description);
      setMetadata(
        discount.metadata && Object.keys(discount.metadata).length > 0
          ? Object.entries(discount.metadata).map(([key, value]) => ({
              key,
              value: value as string,
            }))
          : [{ key: "", value: "" }] // Ensures there's always one empty row for input when no metadata exists
      );
    } catch (error) {
      console.error("Error fetching discount data:", error);
    }
  };

  const formatUTC = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().substring(11, 16);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-GB", {
      weekday: "short",
      timeZone: "UTC",
    });
    const dateStr = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    const timeStr = date.toISOString().substring(11, 16); // HH:mm in UTC
    return {
      date: `${day}, ${dateStr}`,
      time: `UTC ${timeStr}`,
    };
  };

  // UseEffect fetch discount data
  useEffect(() => {
    if (discountId && user?.token) {
      fetchDiscountData();
    }
  }, [discountId, user?.token]);

  // UseEffect selected
  useEffect(() => {
    const selectAllRows = () => {
      if (deletedAll && products.length > 0) {
        let arr = [];
        products.forEach((product) => arr.push(product?.id));
        setSelected(arr);
      } else {
        setSelected([]);
      }
      if (deletedAddProductAll && addProducts.length > 0) {
        let arr = [];
        addProducts.forEach((product) => arr.push(product?.id));
        setSelectedAddProduct(arr);
      } else {
        setSelectedAddProduct([]);
      }
      if (deletedAddConditionAll && addProducts.length > 0) {
        let arr = [];
        addProducts.forEach((product) => arr.push(product?.id));
        setSelectedAddProductToCall(arr);
      } else {
        setSelectedAddProductToCall([]);
      }
      if (deletedTagsAll && tags.length > 0) {
        let arr = [];
        tags.forEach((tags) => arr.push(tags?.id));
        setSelectedTags(arr);
      } else {
        setSelectedTags([]);
      }
      if (deletedAddTagsAll && addTags.length > 0) {
        let arr = [];
        addTags.forEach((tags) => arr.push(tags?.id));
        setSelectedAddTags(arr);
      } else {
        setSelectedAddTags([]);
      }
      if (deletedAddTagConditionAll && addTags.length > 0) {
        let arr = [];
        addTags.forEach((tags) => arr.push(tags?.id));
        setSelectedAddTagToCall(arr);
      } else {
        setSelectedAddTagToCall([]);
      }
      if (deletedCustomerAll && customers.length > 0) {
        let arr = [];
        customers.forEach((customers) => arr.push(customers?.id));
        setSelectedCustomer(arr);
      } else {
        setSelectedCustomer([]);
      }
      if (deletedAddCustomerAll && addCustomers.length > 0) {
        let arr = [];
        addCustomers.forEach((customers) => arr.push(customers?.id));
        setSelectedAddCustomer(arr);
      } else {
        setSelectedAddCustomer([]);
      }
      if (deletedAddCustomerConditionAll && addCustomers.length > 0) {
        let arr = [];
        addCustomers.forEach((customers) => arr.push(customers?.id));
        setSelectedAddCustomerToCall(arr);
      } else {
        setSelectedAddCustomerToCall([]);
      }
    };

    selectAllRows();
  }, [
    deletedAll,
    deletedAddProductAll,
    deletedAddConditionAll,
    deletedTagsAll,
    deletedAddTagsAll,
    deletedAddTagConditionAll,
    deletedCustomerAll,
    deletedAddCustomerAll,
    deletedAddCustomerConditionAll,
  ]);

  // Handle Region Change
  const handleRegionChange = (selectedRegions: Region[]) => {
    setSelectedRegions(selectedRegions);
  };

  // Handle metadata change
  const handleMetadataChange = (index: number, key: string, value: string) => {
    setMetadata((prevMetadata) =>
      prevMetadata.map((entry, i) =>
        i === index ? { ...entry, key, value } : entry
      )
    );
  };

  // Handle fetch Condition Edit
  const fetchConditionData = async (conditionId) => {
    try {
      const conditionResponse = await APIGet(
        `/admin/discounts/${discountId}/conditions/${conditionId}`,
        user.token.toString()
      );
      const condition = conditionResponse.data.discount_condition;

      console.log("Condition: ", condition);
      setConditionId(condition.id);
      let endpoint = `/admin/products?discount_condition_id=${condition.id}&limit=100&offset=0`;
      switch (condition.type) {
        case "product_tags":
          endpoint = `/admin/product-tags?discount_condition_id=${condition.id}&limit=100&offset=0`;
          break;
        case "customer_groups":
          endpoint = `/admin/customer-groups?discount_condition_id=${condition.id}&limit=12&offset=0`;
          break;
        default:
          break;
      }

      try {
        const response = await APIGet(endpoint, user.token.toString());
        console.log("Fetched data:", response.data);
        setTotalPageAddCondition(Math.ceil(response.data.count / 10));
        if (condition.type === "product_tags") {
          setTags(response.data.product_tags);
          setSelectedTagsCondition(condition.operator);
          setShowTagSelectionModal(true);
        } else if (condition.type === "customer_groups") {
          setCustomers(response.data.customer_groups);
          setSelectedCustomerCondition(condition.operator);
          setShowCustomerSelectionModal(true);
        } else {
          setProducts(response.data.products);
          setSelectedProductCondition(condition.operator);
          setShowAddConditionModal(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setSkeleton(false);
      }
    } catch (error) {
      console.error("Error fetching condition data:", error);
    }
  };

  useEffect(() => {
    fetchConditionData(conditionId);
  }, [currentPageAddCondition]);

  // Add condition Pagination
  const handlePaginationAddCondition = (page: number) => {
    setCurrentPageAddCondition(page);
  };

  // Handle save discount
  const handleSave = async () => {
    try {
      if (!discountData) return;

      const metadataToSend = metadata.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key.trim()] = value.trim();
        return acc;
      }, {});

      deletedMetadataKeys.forEach((key) => {
        metadataToSend[key] = "";
      });

      const updatedData = {
        code,
        rule: {
          id: discountData.rule.id,
          description,
          value: parseFloat(value),
        },
        regions: selectedRegions.map((region) => region.value),
        metadata: metadataToSend,
      };

      console.log("Updated data to send:", updatedData);

      await APIPost(
        `/admin/discounts/${discountId}`,
        updatedData,
        user.token.toString()
      );

      setIsModalOpen(false);
      fetchDiscountData();
    } catch (error) {
      console.error("Error updating discount data:", error);
    }
  };

  // Function to handle actions
  const handleMetadataAction = (index: number, action: string) => {
    switch (action) {
      case "insertAbove":
        setMetadata((prev) => [
          ...prev.slice(0, index),
          { key: "", value: "" },
          ...prev.slice(index),
        ]);
        break;
      case "insertBelow":
        setMetadata((prev) => [
          ...prev.slice(0, index + 1),
          { key: "", value: "" },
          ...prev.slice(index + 1),
        ]);
        break;
      case "duplicate":
        setMetadata((prev) => [
          ...prev.slice(0, index + 1),
          { ...prev[index] },
          ...prev.slice(index + 1),
        ]);
        break;
      case "clear":
        handleMetadataChange(index, metadata[index].key, "");
        break;
      case "delete":
        const deletedKey = metadata[index].key;
        if (deletedKey) {
          setDeletedMetadataKeys((prev) => [...prev, deletedKey]);
        }
        setMetadata((prev) => prev.filter((_, idx) => idx !== index));
        break;
    }
  };

  // UseEffect Add Open
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverAddRef.current &&
        !popoverAddRef.current.contains(event.target)
      ) {
        setPopoverAddOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverAddRef]);

  // UseEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  // UseEffect Add Open Configuration
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverAddRefConfiguration.current &&
        !popoverAddRefConfiguration.current.contains(event.target)
      ) {
        setPopoverOpenConfiguration(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverAddRefConfiguration]);

  // Set selected product function
  const SetSelectedFnc = (id: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Set selected add product to call API
  const SetSelectedAddProductToCallFnc = (id: string) => {
    setSelectedAddProductToCall((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Set selected add product function
  const SetSelectedAddProductFnc = (id: string) => {
    setSelectedAddProduct((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Set selected tag function
  const SetSelectedTagFnc = (id: string) => {
    setSelectedTags((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Set selected add tag function
  const SetSelectedAddTagFnc = (id: string) => {
    setSelectedAddTags((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Set selected tag function
  const SetSelectedAddTagToCallFnc = (id: string) => {
    setSelectedAddTagToCall((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Set selected customer function
  const SetSelectedCustomerFnc = (id: string) => {
    setSelectedCustomer((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Set selected add customer function
  const SetSelectedAddCustomerFnc = (id: string) => {
    setSelectedAddCustomer((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Set selected customer function
  const SetSelectedAddCustomerToCallFnc = (id: string) => {
    setSelectedAddCustomerToCall((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(true);
    setPopoverOpen(false);
  };

  // Handle Save Product Condition Changed
  const handleSaveProductCondition = async () => {
    console.log("Selected Products:", selectedAddProduct);
    console.log("Product: ", products);

    const allProductIds = Array.from(
      new Set([...products.map((product) => product.id), ...selectedAddProduct])
    );

    console.log("All Product IDs:", allProductIds);

    try {
      const body = {
        products: allProductIds,
      };

      const response = await APIPost(
        `/admin/discounts/${discountId}/conditions/${conditionId}`,
        body,
        user?.token.toString()
      );
      if (response) {
        console.log("Thành công");
        setShowAddConditionModal(false);
        setShowAddProduct(false);
      }
    } catch (error) {
      console.log("Lỗi", error);
    }
  };

  // Handle Save Tag Condition Changed
  const handleSaveTagCondition = async () => {
    console.log("Selected Products:", selectedAddTags);
    console.log("Product: ", tags);

    const allTagIds = Array.from(
      new Set([...tags.map((tag) => tag.id), ...selectedAddTags])
    );

    console.log("All Tags IDs:", allTagIds);
    try {
      const body = {
        product_tags: allTagIds,
      };

      const response = await APIPost(
        `/admin/discounts/${discountId}/conditions/${conditionId}`,
        body,
        user?.token.toString()
      );
      if (response) {
        console.log("Thành công");
        setShowTagSelectionModal(false);
        setShowAddTags(false);
      }
    } catch (error) {
      console.log("Lỗi", error);
    }
  };

  // Handle Save Customer Condition Changed
  const handleSaveCustomerCondition = async () => {
    const allCustomerIds = Array.from(
      new Set([
        ...customers.map((customer) => customer.id),
        ...selectedAddCustomer,
      ])
    );

    console.log("All Customers IDs:", allCustomerIds);
    try {
      const body = {
        customer_groups: allCustomerIds,
      };

      const response = await APIPost(
        `/admin/discounts/${discountId}/conditions/${conditionId}`,
        body,
        user?.token.toString()
      );
      if (response) {
        console.log("Thành công");
        setShowCustomerSelectionModal(false);
        setShowAddCustomer(false);
      }
    } catch (error) {
      console.log("Lỗi", error);
    }
  };

  // Confirm Delete Condition
  const confirmDeleteCondition = async (val: Obj) => {
    if (val.key === "NoExecute") {
      setShowDeleteModal(false);
      return;
    } else {
      setLoadingDelete(true);
      try {
        const response = await APIDelete(
          `/admin/discounts/${discountId}/conditions`,
          conditionDeletedId,
          user?.token.toString()
        );
        if (response) {
          fetchDiscountData();
          setShowDeleteModal(false);
          setLoadingDelete(false);
        }
      } catch (error) {
        console.error("Error", error);
      }
      setShowDeleteModal(false);
      setLoadingDelete(false);
    }
  };

  // Set condition id to delete and open modal delete
  const deleteConditon = (index: string) => {
    setCondtionDeletedId(index);
    setShowDeleteModal(true);
  };

  // Confirm removed product condition
  const confirmProductCondition = async (val: Obj) => {
    if (val.key === "NoExecute") {
      setShowDeleteProductModal(false);
      return;
    } else {
      setLoadingDelete(true);
      try {
        const body = {
          resources: selected.map((id) => ({ id })),
        };

        const response = await axios.delete(
          `${BASE_URL}/admin/discounts/${discountId}/conditions/${conditionId}/batch`,
          {
            data: body,
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          const conditionResponse = await APIGet(
            `/admin/discounts/${discountId}/conditions/${conditionId}`,
            user.token.toString()
          );

          if (conditionResponse) {
            const condition = conditionResponse.data.discount_condition;
            const dataProduct = await APIGet(
              `/admin/products?discount_condition_id=${conditionId}&limit=100&offset=0`,
              user.token.toString()
            );
            setProducts(dataProduct.data.products);
            setSelectedProductCondition(condition.operator);
            setSelected([]);
            setLoadingDelete(false);
            setShowDeleteProductModal(false);
          }
        }
      } catch (error) {
        console.error("Error", error);
      }
      setLoadingDelete(false);
      setShowDeleteProductModal(false);
    }
  };

  // Confirm removed tag condition
  const confirmTagCondition = async (val: Obj) => {
    if (val.key === "NoExecute") {
      setShowDeleteTagModal(false);
      return;
    } else {
      setLoadingDelete(true);
      try {
        const body = {
          resources: selectedTags.map((id) => ({ id })),
        };

        const response = await axios.delete(
          `${BASE_URL}/admin/discounts/${discountId}/conditions/${conditionId}/batch`,
          {
            data: body,
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          const conditionResponse = await APIGet(
            `/admin/discounts/${discountId}/conditions/${conditionId}`,
            user.token.toString()
          );

          if (conditionResponse) {
            const condition = conditionResponse.data.discount_condition;
            const dataProduct = await APIGet(
              `/admin/product-tags?discount_condition_id=${conditionId}&limit=100&offset=0`,
              user.token.toString()
            );
            setTags(dataProduct.data.product_tags);
            setSelectedTagsCondition(condition.operator);
            setSelectedTags([]);
            setLoadingDelete(false);
            setShowDeleteTagModal(false);
          }
        }
      } catch (error) {
        console.error("Error", error);
      }
      setLoadingDelete(false);
      setShowDeleteTagModal(false);
    }
  };

  // Confirm removed customer condition
  const confirmCustomerCondition = async (val: Obj) => {
    if (val.key === "NoExecute") {
      setShowDeleteCustomerModal(false);
      return;
    } else {
      setLoadingDelete(true);
      try {
        const body = {
          resources: selectedCustomer.map((id) => ({ id })),
        };

        const response = await axios.delete(
          `${BASE_URL}/admin/discounts/${discountId}/conditions/${conditionId}/batch`,
          {
            data: body,
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          const conditionResponse = await APIGet(
            `/admin/discounts/${discountId}/conditions/${conditionId}`,
            user.token.toString()
          );

          if (conditionResponse) {
            const condition = conditionResponse.data.discount_condition;
            const dataProduct = await APIGet(
              `/admin/customer-groups?discount_condition_id=${conditionId}&limit=100&offset=0`,
              user.token.toString()
            );
            setCustomers(dataProduct.data.customer_groups);
            setSelectedCustomerCondition(condition.operator);
            setSelectedCustomer([]);
            setLoadingDelete(false);
            setShowDeleteCustomerModal(false);
          }
        }
      } catch (error) {
        console.error("Error", error);
      }
      setLoadingDelete(false);
      setShowDeleteCustomerModal(false);
    }
  };

  // Handle add condition
  const handleAddProductCondition = async () => {
    setIsPublished(true);
    let rules: any = {
      id: discountData.rule.id,
      conditions: [
        {
          operator: selectedProductAddCondition,
          products: selectedAddProductToCall,
        },
      ],
    };
    try {
      const discountData = {
        rule: rules,
      };
      const response = await APIPost(
        `/admin/discounts/${discountId}`,
        discountData,
        user?.token.toString()
      );
      if (response) {
        console.log("Thành công");
        fetchDiscountData();
        setIsPublished(false);
        setShowConditionAddInModal(false), setShowConditionModal(false);
      }
    } catch (error) {
      console.error("Error: ", error);
      setIsPublished(false);
    }
    setIsPublished(false);
  };

  // Handle add tag condition
  const handleAddTagsCondition = async () => {
    setIsPublished(true);
    let rules: any = {
      id: discountData.rule.id,
      conditions: [
        {
          operator: selectedAddTagsCondition,
          product_tags: selectedAddTagToCall,
        },
      ],
    };
    try {
      const discountData = {
        rule: rules,
      };
      const response = await APIPost(
        `/admin/discounts/${discountId}`,
        discountData,
        user?.token.toString()
      );
      if (response) {
        console.log("Thành công");
        fetchDiscountData();
        setIsPublished(false);
        setShowConditionAddTagInModal(false), setShowConditionModal(false);
      }
    } catch (error) {
      console.error("Error: ", error);
      setIsPublished(false);
    }
    setIsPublished(false);
  };

  // Handle add customer condition
  const handleAddCustomerCondition = async () => {
    setIsPublished(true);
    let rules: any = {
      id: discountData.rule.id,
      conditions: [
        {
          operator: selectedAddCustomersCondition,
          customer_groups: selectedAddCustomerToCall,
        },
      ],
    };
    try {
      const discountData = {
        rule: rules,
      };
      const response = await APIPost(
        `/admin/discounts/${discountId}`,
        discountData,
        user?.token.toString()
      );
      if (response) {
        console.log("Thành công");
        fetchDiscountData();
        setIsPublished(false);
        setShowConditionAddCustomerInModal(false);
        setShowConditionModal(false);
      }
    } catch (error) {
      console.error("Error: ", error);
      setIsPublished(false);
    }
    setIsPublished(false);
  };

  const handleDeleteConfiguration = async (key) => {
    let payload = {};
    if (key === "endDate") {
      payload = { ends_at: null };
    } else if (key === "usageLimit") {
      payload = { usage_limit: null };
    } else {
      console.log(`Cannot delete configuration for key: ${key}`);
      return;
    }
    try {
      const response = await APIPost(
        `/admin/discounts/${discountId}`,
        payload,
        user?.token.toString()
      );
      if (response) {
        fetchDiscountData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTimeChange = (hour, minute) => {
    const newTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    setStartTime(newTime);
  };

  const handleTimeExpiryChange = (hour, minute) => {
    const newTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    setExpiryTime(newTime);
  };
  // Handle increase number
  const handleIncrease = () => {
    const currentValue = parseInt(usageLimit, 10);
    if (!isNaN(currentValue)) {
      setUsageLimit((currentValue + 1).toString());
    }
  };

  // Handle decrease number
  const handleDecrease = () => {
    const currentValue = parseInt(usageLimit, 10);
    if (!isNaN(currentValue) && currentValue > 0) {
      setUsageLimit((currentValue - 1).toString());
    }
  };

  // Handle change number
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUsageLimit(value);
    }
  };

  const handleToggle = () => {
    setChecked(!checked);
  };

  const handleExpiry = () => {
    setCheckedExpiry(!checkedExpiry);
  };

  const handleLimit = () => {
    setCheckedLimit(!checkedLimit);
  };

  const handleSaveConfiguration = async () => {
    const startDateTimeUTC = combineDateTime(startDate, startTime);

    let expiryDateTimeUTC = null;

    if (checkedExpiry) {
      expiryDateTimeUTC = combineDateTime(expiryDate, expiryTime);
    }

    const discountData = {
      starts_at: startDateTimeUTC,
      ends_at: expiryDateTimeUTC,
      usage_limit: checkedLimit ? Number(usageLimit) || null : null,
    };

    try {
      const response = await APIPost(
        `/admin/discounts/${discountId}`,
        discountData,
        user?.token.toString()
      );
      if (response) {
        toast.success("Discount updated successfully");
        fetchDiscountData();
        setShowAddConfiguration(false);
      }
    } catch (error) {
      console.error("Error saving discount configuration:", error);
    }
  };

  const handleValueChange = (value: string | undefined) => {
    if (valueType === "percentage") {
      const numericValue = value ? parseFloat(value) : 0;
      if (numericValue <= 100) {
        setValue(value || "");
      }
    } else {
      setValue(value || "");
    }
  };

  const combineDateTime = (date, time) => {
    if (!date) return null;

    const dateObj = typeof date === "string" ? new Date(date) : date;

    const [hours, minutes] = time.split(":").map((num) => parseInt(num, 10));

    dateObj.setHours(
      hours - dateObj.getTimezoneOffset() / 60,
      minutes - (dateObj.getTimezoneOffset() % 60),
      0
    );

    return dateObj.toISOString();
  };

  const isUserAuthorized = user?.roles === "admin" || user?.roles === "manager";

  if (!user || !canAccessAdmin || !isUserAuthorized) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <CRUDContainer
        title="Update Discount"
        toBack="/admin/collections/discount"
      >
        {!discountData ? (
          <>
            <SkeletonCardInfo />
            <SkeletonCardCondition />
          </>
        ) : (
          <>
            {/* ---------------------------------------------- Card Information ----------------------------------------------------- */}
            <div className="w-full mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">{discountData.code}</h1>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 bg-transparent hover:bg-gray-100 px-3 py-1 rounded-full transition duration-200">
                    <span
                      className={`flex items-center justify-center w-3 h-3 ${discountData.is_disabled ? "bg-red-500" : "bg-green-500"} rounded-full`}
                    ></span>
                    <span
                      className={`text-sm font-semibold ${discountData.is_disabled ? "text-red-500" : "text-green-500"}`}
                    >
                      {discountData.is_disabled ? "Disabled" : "Published"}
                    </span>
                  </button>
                  <Popover open={popoverOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="p-2 hover:bg-gray-200 rounded-full"
                        onClick={() => setPopoverOpen(true)}
                        ref={popoverRef}
                      >
                        <HiOutlineDotsHorizontal size={24} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-white rounded-lg shadow-lg">
                      <div className="flex flex-col">
                        <Button
                          className="flex items-center px-4 py-2 text-white-700 bg-gray-100 w-full hover:text-cyan-50"
                          onClick={handleCloseModal}
                        >
                          <FaRegEdit className="mr-2" /> Edit general
                          information
                        </Button>
                        <button className="flex items-center px-4 py-2 mt-1 text-red-500 hover:bg-red-100 w-full">
                          <RiDeleteBin6Line className="mr-2" /> Delete discount
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                {discountData.rule.description}
              </p>
              <div className="grid grid-cols-3 gap-4 py-5">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {discountData.rule.type === "fixed"
                      ? `₫${discountData.rule.value.toLocaleString("vi-VN")} VND`
                      : `${discountData.rule.value}%`}
                  </p>
                  <p className="text-sm text-gray-500 uppercase">
                    Discount Amount
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {discountData.regions.length}
                  </p>
                  <p className="text-sm text-gray-500 uppercase">
                    Valid Regions
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {discountData.usage_count}
                  </p>
                  <p className="text-sm text-gray-500 uppercase">
                    Total Redemptions
                  </p>
                </div>
              </div>
            </div>
            {/* ------------------------------------------- Configuration Condition ----------------------------------------------------- */}
            <div className="w-full mx-auto px-4 py-6 bg-white rounded-lg border border-gray-200 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Configuration</h2>
                <Popover open={popoverOpenConfiguration}>
                  <PopoverTrigger asChild>
                    <button
                      className="p-2 hover:bg-gray-200 rounded-full"
                      onClick={() => setPopoverOpenConfiguration(true)}
                      ref={popoverAddRefConfiguration}
                    >
                      <HiOutlineDotsHorizontal size={24} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white rounded-lg shadow-lg">
                    <div className="flex flex-col">
                      <Button
                        className="flex items-center px-4 py-2 text-white-700 bg-gray-100 w-full hover:text-cyan-50"
                        onClick={() => {
                          setShowAddConfiguration(true);
                          setPopoverOpenConfiguration(false);
                        }}
                      >
                        <FaRegEdit className="mr-2" /> Edit Configuration
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {configuration.length > 0 ? (
                  configuration.map((config, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="bg-gray-200 text-gray-800 text-base font-semibold p-4 rounded-full">
                          §{index + 1}
                        </span>
                        <div>
                          <p className="text-base font-semibold">
                            {config.label}
                          </p>
                          <p className="text-xs text-gray-600">
                            {config.value.date}
                          </p>
                          {config.value.time && (
                            <p className="text-xs text-gray-600">
                              {config.value.time}
                            </p>
                          )}
                        </div>
                      </div>
                      {config.key !== "startDate" && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                              <HiOutlineDotsHorizontal />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="bg-white rounded-lg shadow-lg">
                            <div className="flex flex-col">
                              <button
                                className="flex items-center px-4 py-2 mt-1 text-red-500 hover:bg-red-100 w-full"
                                onClick={() =>
                                  handleDeleteConfiguration(config.key)
                                }
                              >
                                <RiDeleteBin6Line className="mr-2" /> Delete
                                configuration
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500">
                    No configurations available.
                  </div>
                )}
              </div>
            </div>
            {/* ---------------------------------------------- Card Condition ----------------------------------------------------- */}
            <div className="w-full mx-auto px-4 py-6 bg-white rounded-lg border border-gray-200 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Conditions</h2>

                <Popover open={popoverAddOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                      onClick={() => setPopoverAddOpen(true)}
                      ref={popoverAddRef}
                    >
                      <HiOutlineDotsHorizontal />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white rounded-lg shadow-lg">
                    <div className="flex flex-col">
                      <Button
                        className="flex items-center px-4 py-2 text-white-700 bg-gray-100 w-full hover:text-cyan-50"
                        onClick={() => setShowConditionModal(true)}
                      >
                        <FaRegEdit className="mr-2" /> Add condition
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {discountData.rule.conditions.length > 0 ? (
                  discountData.rule.conditions.map(
                    (condition: Condition, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="bg-gray-200 text-gray-800 text-base font-semibold p-4 rounded-full">
                            §{index + 1}
                          </span>
                          <div>
                            <p className="text-base font-semibold">
                              {condition.type.replace("_", " ")}
                            </p>
                            <p className="text-xs text-gray-600">
                              Discount is applicable to{" "}
                              {condition.type.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                        <Popover key={condition.id}>
                          <PopoverTrigger asChild>
                            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                              <HiOutlineDotsHorizontal />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="bg-white rounded-lg shadow-lg">
                            <div className="flex flex-col">
                              <Button
                                className="flex items-center px-4 py-2 text-white-700 bg-gray-100 w-full hover:text-cyan-50"
                                onClick={() => fetchConditionData(condition.id)}
                              >
                                <FaRegEdit className="mr-2" /> Edit condition
                              </Button>
                              <button
                                className="flex items-center px-4 py-2 mt-1 text-red-500 hover:bg-red-100 w-full"
                                onClick={() => deleteConditon(condition.id)}
                              >
                                <RiDeleteBin6Line className="mr-2" /> Delete
                                condition
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )
                  )
                ) : (
                  <div className="col-span-2 text-center text-gray-500">
                    No conditions available.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CRUDContainer>
      {/*------------------------------------------------- Show Information condition -----------------------------------------------*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-6xl p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center pb-3">
              <h2 className="text-2xl font-semibold">
                Edit general information
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-4 border border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 focus:outline-none"
              >
                <IoCloseOutline className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 text-base font-bold mb-2">
                  Choose valid regions
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <RelationshipMultiField
                    className="!px-0"
                    options={regions}
                    defaultValue={selectedRegions}
                    onChange={handleRegionChange}
                    size="fit"
                  />
                </div>
              </div>
              <div className="flex items-start justify-between space-x-8">
                <div className="w-1/2 mb-4">
                  <label className="block text-gray-700 text-base font-bold mb-2">
                    Code<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="SUMMERSALE2025"
                    className="shadow appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <p className="text-base mt-2 text-gray-600">
                    The code your customers will enter during checkout. This
                    will appear on your customer's invoice. Uppercase letters
                    and numbers only.
                  </p>
                </div>
                <div className="w-1/2 mb-4">
                  <label className="block text-gray-700 text-base font-bold mb-2">
                    {valueType === "amount" ? "Amount" : "Percentage"}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <CurrencyInput
                    id="value-input"
                    name="value"
                    className="shadow appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={valueType === "amount" ? "₫ 100,000" : "% 10"}
                    value={value}
                    decimalsLimit={2}
                    suffix={valueType === "percentage" ? "%" : ""}
                    prefix={valueType === "amount" ? "₫" : ""}
                    onValueChange={(value) => handleValueChange(value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-base font-bold mb-2">
                  Description<span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter the description here..."
                  rows={6}
                  className="shadow appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
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
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metadata.map((item, index) => (
                      <tr key={index} className="border">
                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value={item.key}
                            onChange={(e) =>
                              handleMetadataChange(
                                index,
                                e.target.value,
                                item.value
                              )
                            }
                            placeholder="Key"
                            className="appearance-none rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) =>
                              handleMetadataChange(
                                index,
                                item.key,
                                e.target.value
                              )
                            }
                            placeholder="Value"
                            className="appearance-none rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                          />
                        </td>
                        <td className="px-8 py-3 whitespace-nowrap text-sm text-gray-500">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                <HiDotsVertical className="w-5 h-5" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                              <div className="py-1">
                                <Button
                                  onClick={() =>
                                    handleMetadataAction(index, "insertAbove")
                                  }
                                  className="w-full text-left px-4 py-2 text-base text-white hover:bg-gray-100 hover:text-gray-700 mt-2"
                                >
                                  Insert above
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleMetadataAction(index, "insertBelow")
                                  }
                                  className="w-full text-left px-4 py-2 text-base text-white hover:bg-gray-100 hover:text-gray-700 mt-2"
                                >
                                  Insert below
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleMetadataAction(index, "duplicate")
                                  }
                                  className="w-full text-left px-4 py-2 text-base text-white hover:bg-gray-100 hover:text-gray-700 mt-2"
                                >
                                  Duplicate
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleMetadataAction(index, "clear")
                                  }
                                  className="w-full text-left px-4 py-2 text-base text-white hover:bg-gray-100 hover:text-gray-700 mt-2"
                                >
                                  Clear contents
                                </Button>
                                {metadata.length > 1 && (
                                  <Button
                                    onClick={() =>
                                      handleMetadataAction(index, "delete")
                                    }
                                    className="mt-2 w-full text-left px-4 py-2 text-base text-white hover:bg-red-100 hover:text-red-600"
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none"
                  onClick={handleSave}
                >
                  Save and close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*-------------------------------------------------- Show Edit Configuration -----------------------------------------------*/}
      {showAddConfiguration && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center cursor-pointer py-3 border-b mb-5">
              <span className="text-4xl font-bold text-gray-700">
                Edit configurations
              </span>
              <button className="p-2 hover:bg-gray-200 rounded">
                <IoCloseOutline
                  size={24}
                  onClick={() => {
                    setShowAddConfiguration(false);
                  }}
                />
              </button>
            </div>
            <div className="border-b border-gray-700 mt-5">
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  showConfiguration ? "max-h-[1000px] mb-5" : "max-h-0"
                }`}
              >
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <label className="flex items-center text-lg font-medium text-foreground">
                        Start date
                        <IoIosInformationCircleOutline className="text-muted-foreground ml-2" />
                      </label>
                      <span className="text-muted-foreground">
                        Schedule the discount to activate in the future.
                      </span>
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={handleToggle}
                        />
                        <span className="relative">
                          <span
                            className={`block w-14 h-8 rounded-full transition ${
                              checked ? "bg-purple-700" : "bg-zinc-300"
                            }`}
                          ></span>
                          <span
                            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                              checked ? "translate-x-full" : ""
                            }`}
                          ></span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      checked ? "max-h-[1000px] mb-5" : "max-h-0"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <DatePickerWithRange
                        value={startDate}
                        onChange={(newDate) => {
                          setStartDate(newDate);
                        }}
                        className="w-full h-20"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="
          flex justify-between items-center w-full h-20 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        "
                          >
                            <span className="flex items-center">
                              <ClockIcon className="w-5 h-5 mr-2 text-gray-400" />
                              <span className="text-gray-700">
                                UTC {startTime}
                              </span>
                            </span>
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 max-h-64 overflow-y-auto"
                          side="bottom"
                          align="center"
                        >
                          <div className="flex space-x-2">
                            <div className="h-32 w-24 overflow-y-auto">
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = String(i).padStart(2, "0");
                                return (
                                  <button
                                    key={i}
                                    className={`w-full py-1 text-center rounded-md ${
                                      currentHour === hour
                                        ? "bg-purple-500 text-white"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                      handleTimeChange(hour, currentMinute)
                                    }
                                  >
                                    {hour}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="h-32 w-24 overflow-y-auto">
                              {Array.from({ length: 60 }, (_, i) => {
                                const minute = String(i).padStart(2, "0");
                                return (
                                  <button
                                    key={i}
                                    className={`w-full py-1 text-center rounded-md ${
                                      currentMinute === minute
                                        ? "bg-purple-500 text-white"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                      handleTimeChange(currentHour, minute)
                                    }
                                  >
                                    {minute}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <label className="flex items-center text-lg font-medium text-foreground">
                        Discount has an expiry date?
                        <IoIosInformationCircleOutline className="text-muted-foreground ml-2" />
                      </label>
                      <span className="text-muted-foreground">
                        Schedule the discount to deactivate in the future.
                      </span>
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checkedExpiry}
                          onChange={handleExpiry}
                        />
                        <span className="relative">
                          <span
                            className={`block w-14 h-8 rounded-full transition ${
                              checkedExpiry ? "bg-purple-700" : "bg-zinc-300"
                            }`}
                          ></span>
                          <span
                            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                              checkedExpiry ? "translate-x-full" : ""
                            }`}
                          ></span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      checkedExpiry ? "max-h-[1000px] mb-5" : "max-h-0"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <DatePickerWithRange
                        value={expiryDate}
                        onChange={(newDate) => {
                          setExpiryDate(newDate);
                        }}
                        className="w-full h-20"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="
          flex justify-between items-center w-full h-20 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        "
                          >
                            <span className="flex items-center">
                              <ClockIcon className="w-5 h-5 mr-2 text-gray-400" />
                              <span className="text-gray-700">
                                UTC {expiryTime}
                              </span>
                            </span>
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 max-h-64 overflow-y-auto"
                          side="bottom"
                          align="center"
                        >
                          <div className="flex space-x-2">
                            <div className="h-32 w-24 overflow-y-auto">
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = String(i).padStart(2, "0");
                                return (
                                  <button
                                    key={i}
                                    className={`w-full py-1 text-center rounded-md ${
                                      currentHourExpiry === hour
                                        ? "bg-purple-500 text-white"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                      handleTimeExpiryChange(
                                        hour,
                                        currentMinuteExpiry
                                      )
                                    }
                                  >
                                    {hour}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="h-32 w-24 overflow-y-auto">
                              {Array.from({ length: 60 }, (_, i) => {
                                const minute = String(i).padStart(2, "0");
                                return (
                                  <button
                                    key={i}
                                    className={`w-full py-1 text-center rounded-md ${
                                      currentMinuteExpiry === minute
                                        ? "bg-purple-500 text-white"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                      handleTimeExpiryChange(
                                        currentHourExpiry,
                                        minute
                                      )
                                    }
                                  >
                                    {minute}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <label className="flex items-center text-lg font-medium text-foreground">
                        Limit the number of redemptions?
                        <IoIosInformationCircleOutline className="text-muted-foreground ml-2" />
                      </label>
                      <span className="text-muted-foreground">
                        Limit applies across all customers, not per customer.
                      </span>
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checkedLimit}
                          onChange={handleLimit}
                        />
                        <span className="relative">
                          <span
                            className={`block w-14 h-8 rounded-full transition ${
                              checkedLimit ? "bg-purple-700" : "bg-zinc-300"
                            }`}
                          ></span>
                          <span
                            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                              checkedLimit ? "translate-x-full" : ""
                            }`}
                          ></span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      checkedLimit ? "max-h-[1000px] mb-5" : "max-h-0"
                    }`}
                  >
                    <div className="w-full mt-2">
                      <label className="block text-lg font-bold text-gray-700">
                        Number of redemptions
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          className="w-full p-4 border border-gray-300 rounded pr-12"
                          placeholder="5"
                          value={usageLimit}
                          onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <button
                            className="p-4 rounded-l"
                            onClick={handleDecrease}
                            disabled={parseInt(usageLimit, 10) <= 0}
                            type="button"
                          >
                            <FaMinus />
                          </button>
                          <button
                            className="p-4 rounded-r"
                            type="button"
                            onClick={handleIncrease}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveConfiguration}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/*-------------------------------------------------- Show Products condition -----------------------------------------------*/}
      {showAddConditionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-end items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => setShowAddConditionModal(false)}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="flex space-x-4 mb-4">
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedProductCondition === "in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedProductCondition("in")}
                  >
                    <input
                      type="radio"
                      id="in"
                      name="condition"
                      value="in"
                      checked={selectedProductCondition === "in"}
                      onChange={() => setSelectedProductCondition("in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedProductCondition === "in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedProductCondition === "in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          In
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to the selected items.
                    </span>
                  </div>
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedProductCondition === "not_in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedProductCondition("not_in")}
                  >
                    <input
                      type="radio"
                      id="not_in"
                      name="condition"
                      value="not_in"
                      checked={selectedProductCondition === "not_in"}
                      onChange={() => setSelectedProductCondition("not_in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="not_in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedProductCondition === "not_in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedProductCondition === "not_in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          Not in
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to all items except the selected items.
                    </span>
                  </div>
                </div>
                <div className="flex justify-end items-center pb-3">
                  {selected.length > 0 && (
                    <button
                      className="ml-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
                      onClick={() => setShowDeleteProductModal(true)}
                    >
                      <BiTrash className="mr-2" />
                      Delete
                    </button>
                  )}
                  <button
                    className="ml-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => {
                      setShowAddProduct(true), setShowAddConditionModal(false);
                    }}
                  >
                    + Add
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedAll}
                            onCheckedChange={(e) =>
                              setDeleteAll((prevDeletedAll) => !prevDeletedAll)
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                          <span>Status</span>
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                          <span>Variants</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {skeleton ? (
                        <SkeletonTable />
                      ) : products.length > 0 ? (
                        products.map((product, index) => (
                          <TableRow
                            key={`product-${index}`}
                            className="grid grid-cols-12 min-h-12 cursor-default"
                          >
                            <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                              <Checkbox
                                checked={selected.includes(
                                  product?.id.toString()
                                )}
                                onCheckedChange={() =>
                                  SetSelectedFnc(product?.id.toString())
                                }
                              />
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                              <div className="h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={
                                    product?.thumbnail ||
                                    "https://via.placeholder.com/150"
                                  }
                                  alt="Image"
                                />
                              </div>
                              <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden">
                                {product?.title}
                              </span>
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium overflow-x-hidden flex justify-center items-center text-base px-5">
                              <StatusSpan
                                className="!bg-opacity-0"
                                color={
                                  product?.status === "published"
                                    ? GetStatusColor("completed")
                                    : product?.status === "draft"
                                      ? GetStatusColor("white")
                                      : product?.status === "rejected"
                                        ? GetStatusColor("canceled")
                                        : GetStatusColor("requires_action")
                                }
                              >
                                {product?.status &&
                                  capitalizeFirstLetter(product?.status)}
                              </StatusSpan>
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-center items-center font-medium text-base px-5">
                              <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden">
                                {product?.variants?.length}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                  {totalPageAddCondition > 0 && (
                    <Paginations
                      totalPages={totalPageAddCondition}
                      currentPage={currentPageAddCondition}
                      onPageChange={handlePaginationAddCondition}
                    />
                  )}
                </div>
                <div className="flex justify-end items-center pt-4">
                  <div className="flex space-x-2">
                    <Button
                      className="bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700"
                      onClick={() => setShowAddConditionModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowAddConditionModal(true);
                    setShowAddProduct(false);
                  }}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Add products
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowAddConditionModal(true);
                    setShowAddProduct(false);
                  }}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedAddProductAll}
                            onCheckedChange={(e) =>
                              setDeleteAddProductAll(
                                (prevDeletedAll) => !prevDeletedAll
                              )
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                          <span>Status</span>
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                          <span>Variants</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addProducts && addProducts.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            addProducts.map((product, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                                  <Checkbox
                                    checked={selectedAddProduct.includes(
                                      product?.id.toString()
                                    )}
                                    onCheckedChange={() =>
                                      SetSelectedAddProductFnc(
                                        product?.id.toString()
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                                  <div className="h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={
                                        product?.thumbnail ||
                                        "https://via.placeholder.com/150"
                                      }
                                      alt="Image"
                                    />
                                  </div>
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {product?.title}
                                  </span>
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium overflow-x-hidden flex justify-center items-center text-base px-5">
                                  <StatusSpan
                                    className="!bg-opacity-0"
                                    color={
                                      product?.status == "published"
                                        ? GetStatusColor("completed")
                                        : product?.status == "draft"
                                          ? GetStatusColor("white")
                                          : product?.status == "rejected"
                                            ? GetStatusColor("canceled")
                                            : GetStatusColor("requires_action")
                                    }
                                  >
                                    {product?.status &&
                                      capitalizeFirstLetter(product?.status)}
                                  </StatusSpan>
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-center items-center font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {product?.variants?.length}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </>
                      ) : skeleton ? (
                        <SkeletonTable />
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                </div>
                {totalPage > 0 && (
                  <Paginations
                    totalPages={totalPage}
                    currentPage={currentPage}
                    onPageChange={handlePagination}
                  />
                )}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => {
                      setShowAddConditionModal(true);
                      setShowAddProduct(false);
                    }}
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <Button
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      disabled={isPublished}
                      onClick={handleSaveProductCondition}
                    >
                      {isPublished ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteModal
        title="Are you sure you want to delete this product?"
        handle={confirmProductCondition}
        open={showDeleteProductModal}
        button2="Cancel"
        button="Confirm"
        isLoad={loadingDelete}
      />
      {/*---------------------------------------------------- Show Tags condition -----------------------------------------------*/}
      {showTagSelectionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => setShowTagSelectionModal(false)}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Choose tags
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => setShowTagSelectionModal(false)}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="flex space-x-4 mb-4">
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedTagsCondition === "in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedTagsCondition("in")}
                  >
                    <input
                      type="radio"
                      id="in"
                      name="condition"
                      value="in"
                      checked={selectedTagsCondition === "in"}
                      onChange={() => setSelectedTagsCondition("in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedTagsCondition === "in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedTagsCondition === "in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          In
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to the selected items.
                    </span>
                  </div>
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedTagsCondition === "not_in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedTagsCondition("not_in")}
                  >
                    <input
                      type="radio"
                      id="not_in"
                      name="condition"
                      value="not_in"
                      checked={selectedTagsCondition === "not_in"}
                      onChange={() => setSelectedTagsCondition("not_in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="not_in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedTagsCondition === "not_in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedTagsCondition === "not_in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          Not in
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to all items except the selected items.
                    </span>
                  </div>
                </div>
                <div className="flex justify-end items-center pb-3">
                  {selectedTags.length > 0 && (
                    <button
                      className="ml-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
                      onClick={() => setShowDeleteTagModal(true)}
                    >
                      <BiTrash className="mr-2" />
                      Delete
                    </button>
                  )}
                  <button
                    className="ml-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => {
                      setShowAddTags(true), setShowTagSelectionModal(false);
                    }}
                  >
                    + Add
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedTagsAll}
                            onCheckedChange={(e) =>
                              setDeleteTagsAll(
                                (prevDeletedAll) => !prevDeletedAll
                              )
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tags && tags.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            tags.map((tag, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                                  <Checkbox
                                    checked={selectedTags.includes(
                                      tag?.id.toString()
                                    )}
                                    onCheckedChange={() =>
                                      SetSelectedTagFnc(tag?.id.toString())
                                    }
                                  />
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {tag?.value}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </>
                      ) : skeleton ? (
                        <SkeletonTable />
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                    onClick={() => setShowTagSelectionModal(false)}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setShowTagSelectionModal(false);
                      }}
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      disabled={isPublished}
                    >
                      {isPublished ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddTags && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowAddTags(false);
                    setShowTagSelectionModal(true);
                  }}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Add tags
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowAddTags(false);
                    setShowTagSelectionModal(true);
                  }}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedAddTagsAll}
                            onCheckedChange={(e) =>
                              setDeleteAddTagsAll(
                                (prevDeletedAll) => !prevDeletedAll
                              )
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addTags && addTags.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            addTags.map((tag, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                                  <Checkbox
                                    checked={selectedAddTags.includes(
                                      tag?.id.toString()
                                    )}
                                    onCheckedChange={() =>
                                      SetSelectedAddTagFnc(tag?.id.toString())
                                    }
                                  />
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {tag?.value}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </>
                      ) : skeleton ? (
                        <SkeletonTable />
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                    onClick={() => {
                      setShowAddTags(false);
                      setShowTagSelectionModal(true);
                    }}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <Button
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      disabled={isPublished}
                      onClick={handleSaveTagCondition}
                    >
                      {isPublished ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteModal
        title="Are you sure you want to delete this tag?"
        handle={confirmTagCondition}
        open={showDeleteTagModal}
        button2="Cancel"
        button="Confirm"
        isLoad={loadingDelete}
      />
      {/*------------------------------------------------- Show Customers condition -----------------------------------------------*/}
      {showCustomerSelectionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowCustomerSelectionModal(false);
                  }}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Choose tags
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => setShowCustomerSelectionModal(false)}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="flex space-x-4 mb-4">
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedCustomerCondition === "in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedCustomerCondition("in")}
                  >
                    <input
                      type="radio"
                      id="in"
                      name="condition"
                      value="in"
                      checked={selectedCustomerCondition === "in"}
                      onChange={() => setSelectedCustomerCondition("in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedCustomerCondition === "in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedCustomerCondition === "in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          In
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to the selected items.
                    </span>
                  </div>
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedCustomerCondition === "not_in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedCustomerCondition("not_in")}
                  >
                    <input
                      type="radio"
                      id="not_in"
                      name="condition"
                      value="not_in"
                      checked={selectedCustomerCondition === "not_in"}
                      onChange={() => setSelectedCustomerCondition("not_in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="not_in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedCustomerCondition === "not_in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedCustomerCondition === "not_in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          Not in
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to all items except the selected items.
                    </span>
                  </div>
                </div>
                <div className="flex justify-end items-center pb-3">
                  {selectedCustomer.length > 0 && (
                    <button
                      className="ml-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
                      onClick={() => setShowDeleteCustomerModal(true)}
                    >
                      <BiTrash className="mr-2" />
                      Delete
                    </button>
                  )}
                  <button
                    className="ml-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => {
                      setShowAddCustomer(true),
                        setShowCustomerSelectionModal(false);
                    }}
                  >
                    + Add
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedCustomerAll}
                            onCheckedChange={(e) =>
                              setDeleteCustomerAll(
                                (prevDeletedAll) => !prevDeletedAll
                              )
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers && customers.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            customers.map((customer, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                                  <Checkbox
                                    checked={selectedCustomer.includes(
                                      customer?.id.toString()
                                    )}
                                    onCheckedChange={() =>
                                      SetSelectedCustomerFnc(
                                        customer?.id.toString()
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {customer?.name}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </>
                      ) : skeleton ? (
                        <SkeletonTable />
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                    onClick={() => setShowCustomerSelectionModal(false)}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setShowCustomerSelectionModal(false);
                      }}
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      disabled={isPublished}
                    >
                      {isPublished ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowAddCustomer(false);
                    setShowCustomerSelectionModal(true);
                  }}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Add tags
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowAddCustomer(false);
                    setShowCustomerSelectionModal(false);
                  }}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedAddCustomerAll}
                            onCheckedChange={(e) =>
                              setDeleteAddCustomerAll(
                                (prevDeletedAll) => !prevDeletedAll
                              )
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addCustomers && addCustomers.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            addCustomers.map((customer, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                                  <Checkbox
                                    checked={selectedAddCustomer.includes(
                                      customer?.id.toString()
                                    )}
                                    onCheckedChange={() =>
                                      SetSelectedAddCustomerFnc(
                                        customer?.id.toString()
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {customer?.name}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </>
                      ) : skeleton ? (
                        <SkeletonTable />
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                    onClick={() => {
                      setShowAddCustomer(false);
                      setShowCustomerSelectionModal(true);
                    }}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <Button
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      disabled={isPublished}
                      onClick={handleSaveCustomerCondition}
                    >
                      {isPublished ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteModal
        title="Are you sure you want to delete this customer?"
        handle={confirmCustomerCondition}
        open={showDeleteCustomerModal}
        button2="Cancel"
        button="Confirm"
        isLoad={loadingDelete}
      />
      {/*------------------------------------------------- Select condition deleted -----------------------------------------------*/}
      <DeleteModal
        title="Are you sure you want to delete this condition?"
        handle={confirmDeleteCondition}
        open={showDeleteModal}
        button2="Cancel"
        button="Confirm"
        isLoad={loadingDelete}
      />
      {/* ----------------------------------------------- Show add product condition modal -------------------------------------------------*/}
      {showConditionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="px-7">
                <h3 className="text-2xl p-4 font-bold leading-6 text-gray-900 mb-4 border-b">
                  Add Condition
                </h3>
                <div className="space-y-4">
                  <div
                    className={`p-4 border border-gray-300 rounded hover:bg-gray-100 transition flex justify-between items-center cursor-pointer ${
                      discountData.rule.conditions.some(
                        (condition) => condition.type === "products"
                      )
                        ? "hidden"
                        : ""
                    }`}
                    onClick={() => {
                      setShowConditionAddInModal(true);
                      setShowConditionModal(false);
                    }}
                  >
                    <div className="block">
                      <span>Product</span>
                      <p className="text-gray-500 text-sm">
                        Only for specific products
                      </p>
                    </div>
                    <AiOutlinePlus size={20} />
                  </div>
                  <div
                    onClick={() => {
                      setShowConditionAddCustomerInModal(true);
                      setShowConditionModal(false);
                    }}
                    className={`p-4 border border-gray-300 rounded hover:bg-gray-100 transition flex justify-between items-center cursor-pointer ${
                      discountData.rule.conditions.some(
                        (condition) => condition.type === "customer_groups"
                      )
                        ? "hidden"
                        : ""
                    }`}
                  >
                    <div className="block">
                      <span>Customer group</span>
                      <p className="text-gray-500 text-sm">
                        Only for specific customer groups
                      </p>
                    </div>
                    <AiOutlinePlus size={20} />
                  </div>
                  <div
                    onClick={() => {
                      setShowConditionAddTagInModal(true);
                      setShowConditionModal(false);
                    }}
                    className={`p-4 border border-gray-300 rounded hover:bg-gray-100 transition flex justify-between items-center cursor-pointer ${
                      discountData.rule.conditions.some(
                        (condition) => condition.type === "product_tags"
                      )
                        ? "hidden"
                        : ""
                    }`}
                  >
                    <div className="block">
                      <span>Tag</span>
                      <p className="text-gray-500 text-sm">
                        Only for specific tags
                      </p>
                    </div>
                    <AiOutlinePlus size={20} />
                  </div>
                </div>
                <div className="flex justify-end items-center pb-3 mt-3">
                  <div className="flex space-x-2">
                    <button
                      className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => setShowConditionModal(false)}
                    >
                      Cancel
                    </button>
                    <button className="bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConditionAddInModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowConditionAddInModal(false);
                    setShowConditionModal(true);
                  }}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Choose products
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowConditionAddInModal(false),
                      setShowConditionModal(false);
                  }}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="flex space-x-4 mb-4">
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedProductAddCondition === "in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedProductAddCondition("in")}
                  >
                    <input
                      type="radio"
                      id="in"
                      name="condition"
                      value="in"
                      checked={selectedProductAddCondition === "in"}
                      onChange={() => setSelectedProductAddCondition("in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedProductAddCondition === "in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedProductAddCondition === "in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          In
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to the selected items.
                    </span>
                  </div>
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedProductAddCondition === "not_in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedProductAddCondition("not_in")}
                  >
                    <input
                      type="radio"
                      id="not_in"
                      name="condition"
                      value="not_in"
                      checked={selectedProductAddCondition === "not_in"}
                      onChange={() => setSelectedProductAddCondition("not_in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="not_in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedProductAddCondition === "not_in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedProductAddCondition === "not_in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          Not in
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to all items except the selected items.
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedAddConditionAll}
                            onCheckedChange={(e) =>
                              setDeleteAddConditionAll(
                                (prevDeletedAll) => !prevDeletedAll
                              )
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                          <span>Status</span>
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                          <span>Variants</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addProducts && addProducts.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            addProducts.map((product, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                                  <Checkbox
                                    checked={selectedAddProductToCall.includes(
                                      product?.id.toString()
                                    )}
                                    onCheckedChange={() =>
                                      SetSelectedAddProductToCallFnc(
                                        product?.id.toString()
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                                  <div className="h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={
                                        product?.thumbnail ||
                                        "https://via.placeholder.com/150"
                                      }
                                      alt="Image"
                                    />
                                  </div>
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {product?.title}
                                  </span>
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium overflow-x-hidden flex justify-center items-center text-base px-5">
                                  <StatusSpan
                                    className="!bg-opacity-0"
                                    color={
                                      product?.status == "published"
                                        ? GetStatusColor("completed")
                                        : product?.status == "draft"
                                          ? GetStatusColor("white")
                                          : product?.status == "rejected"
                                            ? GetStatusColor("canceled")
                                            : GetStatusColor("requires_action")
                                    }
                                  >
                                    {product?.status &&
                                      capitalizeFirstLetter(product?.status)}
                                  </StatusSpan>
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-center items-center font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {product?.variants?.length}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </>
                      ) : skeleton ? (
                        <SkeletonTable />
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                </div>
                {totalPage > 0 && (
                  <Paginations
                    totalPages={totalPage}
                    currentPage={currentPage}
                    onPageChange={handlePagination}
                  />
                )}
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                    // onClick={() => setShowProductSelectionModal(false)}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <Button
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      onClick={() => {
                        handleAddProductCondition();
                        // setShowProductSelectionModal(false);
                      }}
                      disabled={isPublished}
                    >
                      {isPublished ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------------------ Show add tag condition modal -------------------------------------------------*/}
      {showConditionAddInTagModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowConditionAddTagInModal(false);
                    setShowConditionModal(true);
                  }}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Choose tags
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowConditionAddTagInModal(false);
                    setShowConditionModal(false);
                  }}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="flex space-x-4 mb-4">
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedAddTagsCondition === "in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedAddTagsCondition("in")}
                  >
                    <input
                      type="radio"
                      id="in"
                      name="condition"
                      value="in"
                      checked={selectedAddTagsCondition === "in"}
                      onChange={() => setSelectedAddTagsCondition("in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedAddTagsCondition === "in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedAddTagsCondition === "in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          In
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to the selected items.
                    </span>
                  </div>
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedAddTagsCondition === "not_in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedAddTagsCondition("not_in")}
                  >
                    <input
                      type="radio"
                      id="not_in"
                      name="condition"
                      value="not_in"
                      checked={selectedAddTagsCondition === "not_in"}
                      onChange={() => setSelectedAddTagsCondition("not_in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="not_in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedAddTagsCondition === "not_in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedAddTagsCondition === "not_in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          Not in
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to all items except the selected items.
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedAddTagConditionAll}
                            onCheckedChange={(e) =>
                              setDeleteAddTagConditionAll(
                                (prevDeletedAll) => !prevDeletedAll
                              )
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addTags && addTags.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            addTags.map((tag, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                                  <Checkbox
                                    checked={selectedAddTagToCall.includes(
                                      tag?.id.toString()
                                    )}
                                    onCheckedChange={() =>
                                      SetSelectedAddTagToCallFnc(
                                        tag?.id.toString()
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {tag?.value}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </>
                      ) : skeleton ? (
                        <SkeletonTable />
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                    onClick={() => {
                      setShowConditionAddInModal(false);
                      setShowConditionAddTagInModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAddTagsCondition()}
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      disabled={isPublished}
                    >
                      {isPublished ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ---------------------------------------------- Show add customer condition modal -------------------------------------------------*/}
      {showConditionAddInCustomerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowConditionAddCustomerInModal(false);
                    setShowConditionModal(true);
                  }}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Choose tags
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowConditionAddCustomerInModal(false);
                    setShowConditionModal(false);
                  }}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="px-7">
                <div className="flex space-x-4 mb-4">
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedAddCustomersCondition === "in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedAddCustomersCondition("in")}
                  >
                    <input
                      type="radio"
                      id="in"
                      name="condition"
                      value="in"
                      checked={selectedAddCustomersCondition === "in"}
                      onChange={() => setSelectedAddCustomersCondition("in")}
                      className="hidden"
                    />
                    <label
                      htmlFor="in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedAddCustomersCondition === "in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedAddCustomersCondition === "in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          In
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to the selected items.
                    </span>
                  </div>
                  <div
                    className={`cursor-pointer p-4 w-full rounded-lg border ${
                      selectedAddCustomersCondition === "not_in"
                        ? "border-purple-600"
                        : "border-gray-300"
                    } hover:border-purple-600 transition`}
                    onClick={() => setSelectedAddCustomersCondition("not_in")}
                  >
                    <input
                      type="radio"
                      id="not_in"
                      name="condition"
                      value="not_in"
                      checked={selectedAddCustomersCondition === "not_in"}
                      onChange={() =>
                        setSelectedAddCustomersCondition("not_in")
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="not_in"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedAddCustomersCondition === "not_in"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedAddCustomersCondition === "not_in"
                                ? "bg-white"
                                : "bg-transparent"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-2xl font-semibold px-5">
                          Not in
                        </span>
                      </div>
                    </label>
                    <span className="text-gray-500 text-sm">
                      Applies to all items except the selected items.
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                          <Checkbox
                            id="delete-all-cb"
                            checked={deletedAddCustomerConditionAll}
                            onCheckedChange={(e) =>
                              setDeleteAddCustomerConditionAll(
                                (prevDeletedAll) => !prevDeletedAll
                              )
                            }
                          />
                        </TableHead>
                        <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-left">
                          <span>Title</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addCustomers && addCustomers.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            addCustomers.map((customer, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                                  <Checkbox
                                    checked={selectedAddCustomerToCall.includes(
                                      customer?.id.toString()
                                    )}
                                    onCheckedChange={() =>
                                      SetSelectedAddCustomerToCallFnc(
                                        customer?.id.toString()
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex overflow-x-hidden justify-start gap-5 items-center font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                                    {customer?.name}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </>
                      ) : skeleton ? (
                        <SkeletonTable />
                      ) : (
                        <NoDataAvailableTable />
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                    onClick={() => {
                      setShowConditionAddCustomerInModal(false);
                      setShowConditionModal(true);
                    }}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleAddCustomerCondition}
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      disabled={isPublished}
                    >
                      {isPublished ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SkeletonCardInfo = () => (
  <div className="w-full mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
      <div className="flex items-center space-x-3">
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>
    </div>
    <div className="h-6 bg-gray-300 rounded mb-4"></div>
    <div className="grid grid-cols-3 gap-4 py-5">
      <div className="text-center">
        <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded mt-2"></div>
      </div>
      <div className="text-center">
        <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded mt-2"></div>
      </div>
      <div className="text-center">
        <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded mt-2"></div>
      </div>
    </div>
  </div>
);

const SkeletonCardCondition = () => (
  <div className="w-full mx-auto px-4 py-6 bg-white rounded-lg border border-gray-200 shadow animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
      <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
          </div>
        </div>
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
          </div>
        </div>
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default UpdateDiscount;
function utcToZonedTime(date: Date, arg1: string) {
  throw new Error("Function not implemented.");
}
