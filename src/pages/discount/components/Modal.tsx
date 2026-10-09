import React, { useEffect, useState, useRef } from "react";

// Icons
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaMinus, FaPlus, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaArrowDown } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

import CurrencyInput from "react-currency-input-field";

// User authorization
import { useAuth } from "payload/components/utilities";

import { APIGet, APIPost } from "../../../api";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "../../../components/ui/table";
import { SkeletonTable } from "../../../components/skeleton";
import { Checkbox } from "../../../components/ui/checkbox";
import { NoDataAvailableTable } from "../../../components/empty/Empty";
import { StatusSpan } from "../../../components/elements";
import { capitalizeFirstLetter, GetStatusColor } from "../../../utils";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../components/ui/popover";
import { RelationshipMultiField } from "../../../components/fields";

import { Button } from "../../../components/ui/button";
import { ChevronDownIcon, ClockIcon, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import { DatePickerWithRange } from "./calendar";
import "react-toastify/dist/ReactToastify.css";
import {Paginations} from "../../../components/particals";

interface User {
  id: number;
  email: string;
  token: string;
}

interface Props {
  handleShow: (boolean) => void;
  fetchDiscounts: () => void;
}

interface SectionHeaderProps {
  title: string;
  isRequired: boolean;
  isOpen: boolean;
  onClick: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isRequired,
  isOpen,
  onClick,
}) => (
  <div
    className="flex justify-between items-center cursor-pointer py-3"
    onClick={onClick}
  >
    <div className="flex items-center">
      <span className="text-lg font-bold text-gray-700">{title}</span>
      {isRequired && <span className="text-red-500 ml-1">*</span>}
      {title === "Discount type" && <BsInfoCircle className="ml-2" />}
    </div>
    <button
      className={`p-2 hover:bg-gray-200 rounded-full transform transition-transform duration-500 ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      {isOpen ? <AiOutlineMinus size={24} /> : <AiOutlinePlus size={24} />}
    </button>
  </div>
);

const DiscountModal: React.FC<Props> = ({handleShow, fetchDiscounts}) => {
  const {user} = useAuth<User>();

  const [selectedDiscount, setSelectedDiscount] = useState("percentage");
  const [selectedAllocation, setSelectedAllocation] = useState("total");

  const [selectedProductCondition, setSelectedProductCondition] =
    useState("in");
  const [selectedTagsCondition, setSelectedTagsCondition] = useState("in");
  const [selectedCustomerCondition, setSelectedCustomerCondition] =
    useState("in");

  const [discountCode, setDiscountCode] = useState("");
  const [description, setDescription] = useState("");

  const [percentageValue, setPercentageValue] = useState<string>("");
  const [fixedValue, setFixedValue] = useState<string>("");

  const [showDiscountType, setShowDiscountType] = useState<boolean>(false);
  const [showAllocation, setShowAllocation] = useState(false);
  const [showGeneral, setShowGeneral] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [showAddConditionModal, setShowAddConditionModal] = useState(false);

  const [deletedAll, setDeleteAll] = useState<boolean>(false);
  const [deletedTagsAll, setDeleteTagsAll] = useState<boolean>(false);
  const [deletedCustomerAll, setDeleteCustomerAll] = useState<boolean>(false);

  const [skeleton, setSkeleton] = useState(true);

  const [showProductSelectionModal, setShowProductSelectionModal] =
    useState(false);
  const [showTagSelectionModal, setShowTagSelectionModal] = useState(false);
  const [showCustomerSelectionModal, setShowCustomerSelectionModal] =
    useState(false);

  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [customers, setCustomer] = useState([]);
  const [regions, setRegions] = useState<{value: string; label: string}[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<
    {value: string; label: string}[]
  >([]);

  const [selected, setSelected] = useState<string[]>([]); // Selected for products
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Selected for tags
  const [selectedCustomer, setSelectedCustomer] = useState<string[]>([]); // Selected for customer

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [popoverTagOpen, setPopoverTagOpen] = useState<boolean>(false);
  const [popoverCustomerOpen, setPopoverCustomerOpen] =
    useState<boolean>(false);

  const [conditions, setConditions] = useState<any[]>([]); // Changed for storing products condition
  const [tagsCondition, setTagsCondition] = useState<any[]>([]); // Changed for storing tags condition
  const [customerCondition, setCustomerCondition] = useState<any[]>([]); // Changed for storing customer condition

  const [isPublished, setIsPublished] = useState(false);

  const popoverRef = useRef(null);
  const popoverTagRef = useRef(null);
  const popoverCustomerRef = useRef(null);

  const [date, setDate] = React.useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  // Get products
  const getProduct = async () => {
    setSkeleton(true);
    try {
      const response = await APIGet(
        `/admin/products?limit=10&offset=${(currentPage - 1) * 10}`,
        user?.token
      );
      setTotalPage(Math.ceil(response.data.count / 10));
      setProducts(response.data.products);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setSkeleton(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [currentPage]);

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  // Get tags
  const getProductTags = async () => {
    setSkeleton(true);
    try {
      const response = await APIGet("/admin/product-tags", user?.token);
      setTags(response.data.product_tags);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setSkeleton(false);
    }
  };

  // Get regions
  const getProductRegions = async () => {
    setSkeleton(true);
    try {
      const response = await APIGet("/admin/regions", user?.token);
      const regions = response.data.regions.map((region: any) => ({
        value: region.id,
        label: region.name,
      }));
      setRegions(regions);
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
      const response = await APIGet("/admin/customer-groups", user?.token);
      console.log(response);
      setCustomer(response.data.customer_groups);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setSkeleton(false);
    }
  };

  // Handle region change
  const handleRegionChange = (
    selectedRegions: {value: string; label: string}[]
  ) => {
    setSelectedRegions(selectedRegions);
  };

  // UseEffect
  useEffect(() => {
    getProductTags();
    getCustomerGroup();
    getProductRegions();
  }, []);

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
      if (deletedTagsAll && tags.length > 0) {
        let arr = [];
        tags.forEach((tags) => arr.push(tags?.id));
        setSelectedTags(arr);
      } else {
        setSelectedTags([]);
      }
      if (deletedCustomerAll && customers.length > 0) {
        let arr = [];
        customers.forEach((customers) => arr.push(customers?.id));
        setSelectedCustomer(arr);
      } else {
        setSelectedCustomer([]);
      }
    };

    selectAllRows();
  }, [deletedAll, deletedTagsAll, deletedCustomerAll]);

  // UseEffect products
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

  // UseEffect tags
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverTagRef.current &&
        !popoverTagRef.current.contains(event.target)
      ) {
        setPopoverTagOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverTagRef]);

  // UseEffect customer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverCustomerRef.current &&
        !popoverCustomerRef.current.contains(event.target)
      ) {
        setPopoverCustomerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverCustomerRef]);

  // Handle discount change
  const handleDiscountChange = (value) => {
    setSelectedDiscount(value);
    if (value === "fixed") {
      setShowAllocation(true);
    } else {
      setShowAllocation(false);
    }
  };

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

  // Add condition product
  const handleAddCondition = () => {
    setIsPublished(true);
    if (isEditing && editingIndex !== null) {
      const updatedConditions = [...conditions];
      updatedConditions[editingIndex] = {type: "Product", products: selected};
      setConditions(updatedConditions);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      setConditions([...conditions, {type: "Product", products: selected}]);
    }
    setSelected([]);
    setShowAddConditionModal(false);
    setShowProductSelectionModal(false);
    setIsPublished(false);
  };

  // Add condition tags
  const handleAddTagsCondition = () => {
    setIsPublished(true);
    if (isEditing && editingIndex !== null) {
      const updatedConditions = [...tagsCondition];
      updatedConditions[editingIndex] = {type: "Tag", tags: selectedTags};
      setTagsCondition(updatedConditions);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      setTagsCondition([...tagsCondition, {type: "Tag", tags: selectedTags}]);
    }
    setSelectedTags([]);
    setShowAddConditionModal(false);
    setShowTagSelectionModal(false);
    setIsPublished(false);
  };

  // Add condition customer
  const handleAddCustomerCondition = () => {
    setIsPublished(true);
    if (isEditing && editingIndex !== null) {
      const updatedConditions = [...customerCondition];
      updatedConditions[editingIndex] = {
        type: "Customer",
        customers: selectedCustomer,
      };
      setCustomerCondition(updatedConditions);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      setCustomerCondition([
        ...customerCondition,
        {type: "Customer", customers: selectedCustomer},
      ]);
    }
    setSelectedCustomer([]);
    setShowAddConditionModal(false);
    setShowCustomerSelectionModal(false);
    setIsPublished(false);
  };

  // Delete product condition
  const handleDeleteCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
    setDeleteAll(false);
    setPopoverOpen(false); // Close the popover
  };

  // Delete condition tags
  const handleDeleteTagCondition = (index) => {
    setTagsCondition(tagsCondition.filter((_, i) => i !== index));
    setDeleteTagsAll(false);
    setPopoverTagOpen(false); // Close the popover
  };

  // Delete condition customer
  const handleDeleteCustomerCondition = (index) => {
    setCustomerCondition(tagsCondition.filter((_, i) => i !== index));
    setDeleteCustomerAll(false);
    setPopoverCustomerOpen(false); // Close the popover
  };

  // Edit product condition
  const handleEditCondition = (index) => {
    setSelected(conditions[index].products);
    setIsEditing(true);
    setEditingIndex(index);
    setShowProductSelectionModal(true);
    setShowAddConditionModal(false);
    setPopoverOpen(false); // Close the popover
  };

  // Edit tag condition
  const handleEditTagCondition = (index) => {
    setSelectedTags(tagsCondition[index].tags);
    setIsEditing(true);
    setEditingIndex(index);
    setShowTagSelectionModal(true);
    setShowAddConditionModal(false);
    setPopoverTagOpen(false); // Close the popover
  };

  // Edit customer condition
  const handleEditCustomerCondition = (index) => {
    setSelectedCustomer(customerCondition[index].customers);
    setIsEditing(true);
    setEditingIndex(index);
    setShowCustomerSelectionModal(true);
    setShowAddConditionModal(false);
    setPopoverCustomerOpen(false); // Close the popover
  };

  // Handle Published
  const handlePublish = async () => {
    setIsPublished(true);
    if (!discountCode.trim()) {
      toast.warning("Discount code cannot be empty");
      setIsPublished(false);
      return;
    }

    if (!description.trim()) {
      toast.warning("Description cannot be empty");
      setIsPublished(false);
      return;
    }

    // Check if Start Date/Time is selected if checked
    if (checked) {
      if (!startDate || !startTime) {
        toast.warning("Please select a start date and time.");
        setIsPublished(false);
        return;
      }
    }

    // Check if Expiry Date/Time is selected if checkedExpiry
    if (checkedExpiry) {
      if (!expiryDate || !expiryTime) {
        toast.warning("Please select an expiry date and time.");
        setIsPublished(false);
        return;
      }
    }

    // Check if usage limit is entered if checkedLimit
    if (checkedLimit) {
      const usageLimitValue = parseInt(usageLimit, 10);
      if (!usageLimit || isNaN(usageLimitValue) || usageLimitValue <= 0) {
        toast.warning("Please enter a valid usage limit.");
        setIsPublished(false);
        return;
      }
    }

    const allConditions = [
      ...conditions.map((condition) => ({
        operator: selectedProductCondition,
        products: condition.products,
      })),
      ...tagsCondition.map((condition) => ({
        operator: selectedTagsCondition,
        product_tags: condition.tags,
      })),
      ...customerCondition.map((condition) => ({
        operator: selectedCustomerCondition,
        customer_groups: condition.customers,
      })),
    ];

    let rule: any = {
      allocation: selectedAllocation,
      description: description,
      conditions: allConditions,
    };

    if (selectedDiscount === "percentage") {
      const value = parseFloat(percentageValue);
      if (isNaN(value) || value <= 0) {
        alert("Percentage value must be a positive number");
        return;
      }
      rule = {...rule, value: value, type: selectedDiscount};
    } else if (selectedDiscount === "fixed") {
      const value = parseFloat(fixedValue);
      if (isNaN(value) || value <= 0) {
        alert("Fixed value must be a positive number");
        return;
      }
      rule = {...rule, value: value, type: selectedDiscount};
    } else if (selectedDiscount === "free_shipping") {
      rule = {...rule, type: "free_shipping"};
    } else {
      alert("Invalid discount type");
      return;
    }

    const discountData: {
      code: string;
      rule: any;
      is_dynamic: boolean;
      regions: string[];
      metadata: Record<string, unknown>;
      is_disabled: boolean;
      starts_at?: string; // optional
      ends_at?: string; // optional
      usage_limit?: number; // optional
    } = {
      code: discountCode,
      rule: rule,
      is_dynamic: false,
      regions: Array.isArray(selectedRegions)
        ? selectedRegions.map((region) => region.value)
        : [],
      metadata: {},
      is_disabled: false,
    };

    // Convert start date and time to ISO format
    if (checked && startDate && startTime) {
      const startDateTimeUTC = combineDateTime(startDate, startTime);
      discountData.starts_at = startDateTimeUTC;
    }

    // Convert expiry date and time to ISO format
    if (checkedExpiry && expiryDate && expiryTime) {
      const expiryDateTimeUTC = combineDateTime(expiryDate, expiryTime);
      discountData.ends_at = expiryDateTimeUTC;
    }

    // Add usage_limit if selected
    if (checkedLimit) {
      discountData.usage_limit = parseInt(usageLimit, 10);
    }

    console.log("Publish: ", discountData);
    try {
      const response = await APIPost(
        "/admin/discounts",
        discountData,
        user.token
      );
      if (response) {
        toast.success("Discount published successfully.");
        setIsPublished(false);
        fetchDiscounts();
        handleShow(false);
      }
    } catch (error) {
      console.error("Failed to publish discount", error);
    }
    setIsPublished(false);
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

  const handleChangeDate = (date: Date | null) => {
    setStartDate(date);
  };

  const handleChangeExpiryDate = (date: Date | null) => {
    setExpiryDate(date);
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

  const handlePercentageChange = (value: string | undefined) => {
    const numericValue = value ? parseFloat(value) : 0;
    if (numericValue <= 100) {
      setPercentageValue(value || "");
    }
  };

  const decreasePercentage = () => {
    const numericValue = percentageValue ? parseFloat(percentageValue) : 0;
    handlePercentageChange((numericValue - 1).toString());
  };

  const increasePercentage = () => {
    const numericValue = percentageValue ? parseFloat(percentageValue) : 0;
    handlePercentageChange((numericValue + 1).toString());
  };

  const handleFixedValueChange = (value: string | undefined) => {
    const numericValue = value ? parseFloat(value) : 0;
    setFixedValue(value || "");
  };

  const decreaseAmount = () => {
    const numericValue = fixedValue ? parseFloat(fixedValue) : 0;
    handleFixedValueChange((numericValue - 1).toFixed(2));
  };

  const increaseAmount = () => {
    const numericValue = fixedValue ? parseFloat(fixedValue) : 0;
    handleFixedValueChange((numericValue + 1).toFixed(2));
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div className="relative top-20 mx-auto p-5 border w-2/3 bottom-20 shadow-lg rounded-md bg-white">
          <div
            className={`${
              showAddConditionModal ||
              showProductSelectionModal ||
              showTagSelectionModal ||
              showCustomerSelectionModal
                ? "-translate-x-full hidden"
                : "translate-x-0"
            }`}
          >
            <div className="flex justify-between items-center pb-3">
              <button
                className="p-2 hover:bg-gray-200 rounded-full"
                onClick={() => handleShow(false)}
              >
                <IoCloseOutline size={24} />
              </button>
              <div className="flex space-x-2">
                {/* <button className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100">
                  Save as draft
                </button> */}
                <Button
                  className={`${
                    isPublished && "pointer-events-none select-none"
                  } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                  onClick={handlePublish}
                  disabled={isPublished}
                >
                  {isPublished ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-2" />
                      <p>Publishing</p>
                    </div>
                  ) : (
                    "Publish discount"
                  )}
                </Button>
              </div>
            </div>
            <div className="px-7">
              <h3 className="text-4xl font-bold leading-6 text-gray-900 mb-4">
                Create new discount
              </h3>
              {/* -------------------------------------------------Section Discount type-------------------------------------------------  */}
              <SectionHeader
                title="Discount type"
                isRequired={true}
                isOpen={showDiscountType}
                onClick={() => setShowDiscountType(!showDiscountType)}
              />
              <div className="border-b border-gray-700">
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showDiscountType ? "max-h-[1000px] mb-5" : "max-h-0"
                  }`}
                >
                  <div className="mt-2 flex justify-between space-x-4">
                    <div
                      onClick={() => handleDiscountChange("percentage")}
                      className={`cursor-pointer p-4 w-full rounded-lg border ${
                        selectedDiscount === "percentage"
                          ? "border-purple-600"
                          : "border-gray-300"
                      } hover:border-purple-600 transition`}
                    >
                      <input
                        type="radio"
                        id="percentage"
                        name="discount"
                        value="percentage"
                        checked={selectedDiscount === "percentage"}
                        onChange={() => handleDiscountChange("percentage")}
                        className="hidden"
                      />
                      <label
                        htmlFor="percentage"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              selectedDiscount === "percentage"
                                ? "border-purple-600 bg-purple-600"
                                : "border-gray-300"
                            } flex items-center justify-center`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                selectedDiscount === "percentage"
                                  ? "bg-white"
                                  : "bg-transparent"
                              }`}
                            ></div>
                          </div>
                          <span className="text-gray-700">Percentage</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          Discount applied in %
                        </span>
                      </label>
                    </div>
                    <div
                      onClick={() => handleDiscountChange("fixed")}
                      className={`cursor-pointer p-4 w-full rounded-lg border ${
                        selectedDiscount === "fixed"
                          ? "border-purple-600"
                          : "border-gray-300"
                      } hover:border-purple-600 transition`}
                    >
                      <input
                        type="radio"
                        id="fixed"
                        name="discount"
                        value="fixed"
                        checked={selectedDiscount === "fixed"}
                        onChange={() => handleDiscountChange("fixed")}
                        className="hidden"
                      />
                      <label
                        htmlFor="fixed"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              selectedDiscount === "fixed"
                                ? "border-purple-600 bg-purple-600"
                                : "border-gray-300"
                            } flex items-center justify-center`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                selectedDiscount === "fixed"
                                  ? "bg-white"
                                  : "bg-transparent"
                              }`}
                            ></div>
                          </div>
                          <span className="text-gray-700">Fixed amount</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          Discount in whole numbers
                        </span>
                      </label>
                    </div>
                    <div
                      onClick={() => handleDiscountChange("free_shipping")}
                      className={`cursor-pointer p-4 w-full rounded-lg border ${
                        selectedDiscount === "free_shipping"
                          ? "border-purple-600"
                          : "border-gray-300"
                      } hover:border-purple-600 transition`}
                    >
                      <input
                        type="radio"
                        id="free_shipping"
                        name="discount"
                        value="free_shipping"
                        checked={selectedDiscount === "free_shipping"}
                        onChange={() => handleDiscountChange("free_shipping")}
                        className="hidden"
                      />
                      <label
                        htmlFor="shipping"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              selectedDiscount === "free_shipping"
                                ? "border-purple-600 bg-purple-600"
                                : "border-gray-300"
                            } flex items-center justify-center`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                selectedDiscount === "free_shipping"
                                  ? "bg-white"
                                  : "bg-transparent"
                              }`}
                            ></div>
                          </div>
                          <span className="text-gray-700">Free shipping</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          Override delivery amount
                        </span>
                      </label>
                    </div>
                  </div>
                  {showAllocation && (
                    <div className="mt-6">
                      <label className="block text-lg font-bold text-gray-700">
                        Allocation<span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2 flex justify-between space-x-4">
                        <div
                          onClick={() => setSelectedAllocation("total")}
                          className={`cursor-pointer p-4 w-2/3 rounded-lg border ${
                            selectedAllocation === "total"
                              ? "border-purple-600"
                              : "border-gray-300"
                          } hover:border-purple-600 transition`}
                        >
                          <input
                            type="radio"
                            id="total"
                            name="allocation"
                            value="total"
                            checked={selectedAllocation === "total"}
                            onChange={() => setSelectedAllocation("total")}
                            className="hidden"
                          />
                          <label
                            htmlFor="total"
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-4 h-4 rounded-full border ${
                                  selectedAllocation === "total"
                                    ? "border-purple-600 bg-purple-600"
                                    : "border-gray-300"
                                } flex items-center justify-center`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    selectedAllocation === "total"
                                      ? "bg-white"
                                      : "bg-transparent"
                                  }`}
                                ></div>
                              </div>
                              <span className="text-gray-700">
                                Total amount
                              </span>
                            </div>
                            <span className="text-gray-500 text-sm">
                              Apply to the total amount
                            </span>
                          </label>
                        </div>
                        <div
                          onClick={() => setSelectedAllocation("item")}
                          className={`cursor-pointer p-4 w-2/3 rounded-lg border ${
                            selectedAllocation === "item"
                              ? "border-purple-600"
                              : "border-gray-300"
                          } hover:border-purple-600 transition`}
                        >
                          <input
                            type="radio"
                            id="item"
                            name="allocation"
                            value="item"
                            checked={selectedAllocation === "item"}
                            onChange={() => setSelectedAllocation("item")}
                            className="hidden"
                          />
                          <label
                            htmlFor="item"
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-4 h-4 rounded-full border ${
                                  selectedAllocation === "item"
                                    ? "border-purple-600 bg-purple-600"
                                    : "border-gray-300"
                                } flex items-center justify-center`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    selectedAllocation === "item"
                                      ? "bg-white"
                                      : "bg-transparent"
                                  }`}
                                ></div>
                              </div>
                              <span className="text-gray-700">
                                Item specific
                              </span>
                            </div>
                            <span className="text-gray-500 text-sm">
                              Apply to every allowed item
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* ----------------------------------------------------Section General----------------------------------------------------  */}
              <SectionHeader
                title="General"
                isRequired={true}
                isOpen={showGeneral}
                onClick={() => setShowGeneral(!showGeneral)}
              />
              <div className="border-b border-gray-700">
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showGeneral ? "max-h-[1000px] mb-5" : "max-h-0"
                  }`}
                >
                  <div className="mt-2">
                    <label className="block text-lg font-bold text-gray-700">
                      Choose valid regions
                      <span className="text-red-500">*</span>
                    </label>
                    <RelationshipMultiField
                      className="!px-0"
                      options={regions}
                      defaultValue={selectedRegions}
                      onChange={handleRegionChange}
                      size="fit"
                    />
                    <div className="mt-4 flex space-x-4">
                      <div className="w-full">
                        <label className="block text-lg font-bold text-gray-700">
                          Code<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full p-4 mt-2 border border-gray-300 rounded"
                          placeholder="SUMMERSALE10"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                        />
                      </div>
                      {selectedDiscount === "percentage" && (
                        <div className="w-full mt-2">
                          <label className="block text-lg font-bold text-gray-700">
                            Percentage<span className="text-red-500">*</span>
                          </label>
                          <div className="relative w-full">
                            <CurrencyInput
                              id="percentage-input"
                              name="percentage"
                              className="w-full p-4 border border-gray-300 rounded pr-12"
                              placeholder="% 10"
                              value={percentageValue}
                              suffix="%"
                              decimalsLimit={2}
                              onValueChange={(value) =>
                                handlePercentageChange(value)
                              }
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <button
                                className="p-4 rounded-l"
                                onClick={decreasePercentage}
                              >
                                <FaMinus />
                              </button>
                              <button
                                className="p-4 rounded-r"
                                onClick={increasePercentage}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedDiscount === "fixed" && (
                        <div className="w-full mt-2">
                          <label className="block text-lg font-bold text-gray-700">
                            Amount<span className="text-red-500">*</span>
                          </label>
                          <div className="relative w-full">
                            <CurrencyInput
                              id="fixed-amount-input"
                              name="amount"
                              className="w-full p-4 border border-gray-300 rounded pr-12"
                              placeholder="0.00"
                              value={fixedValue}
                              decimalsLimit={2}
                              onValueChange={(value) =>
                                handleFixedValueChange(value)
                              }
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <button
                                className="p-4 rounded-l"
                                onClick={decreaseAmount}
                              >
                                <FaMinus />
                              </button>
                              <button
                                className="p-4 rounded-r"
                                onClick={increaseAmount}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      The code your customers will enter during checkout. This
                      will appear on your customer's invoice. Uppercase letters
                      and numbers only.
                    </p>
                    <div className="mt-4">
                      <label className="block text-lg font-bold text-gray-700">
                        Description<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 mt-2 border border-gray-300 rounded"
                        placeholder="Summer Sale 2022..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="mt-4 flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">
                        This is a template discount
                      </span>
                      <BsInfoCircle className="ml-2" />
                    </div>
                  </div>
                </div>
              </div>
              {/* ------------------------------------------------- Section Configuration----------------------------------------------------  */}
              <SectionHeader
                title="Configuration"
                isRequired={false}
                isOpen={showConfiguration}
                onClick={() => setShowConfiguration(!showConfiguration)}
              />
              <div className="border-b border-gray-700">
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
                          onChange={handleChangeDate}
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
                                {Array.from({length: 24}, (_, i) => {
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
                                {Array.from({length: 60}, (_, i) => {
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
                          onChange={handleChangeExpiryDate}
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
                                {Array.from({length: 24}, (_, i) => {
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
                                {Array.from({length: 60}, (_, i) => {
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
              {/* ----------------------------------------------------Section Conditions-------------------------------------------------- */}
              <SectionHeader
                title="Conditions"
                isRequired={true}
                isOpen={showConditions}
                onClick={() => setShowConditions(!showConditions)}
              />
              <div className="border-b border-gray-700">
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showConditions ? "max-h-[1000px] mb-5" : "max-h-0"
                  }`}
                >
                  <div className="mt-2">
                    <p className="text-gray-500">
                      Discount code apply to all products if left untouched.
                    </p>
                    {conditions.length > 0 && (
                      <div className="mt-4">
                        {conditions.map((condition, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-300 rounded flex justify-between items-center mb-2"
                          >
                            <div>
                              <span className="font-semibold">Product</span>
                              <p className="text-gray-500">
                                {condition.products
                                  .map((productId) =>
                                    products.find(
                                      (product) => product.id === productId
                                    )
                                  )
                                  .map((product) => product?.title)
                                  .join(", ")}
                              </p>
                            </div>
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
                              <PopoverContent>
                                <button
                                  className="flex items-center p-5"
                                  onClick={() => handleEditCondition(index)}
                                >
                                  <FaRegEdit className="mr-2" /> Edit
                                </button>
                                <button
                                  className="flex items-center text-red-500 mt-2 p-5"
                                  onClick={() => handleDeleteCondition(index)}
                                >
                                  <RiDeleteBin6Line className="mr-2" /> Delete
                                </button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                      </div>
                    )}
                    {tagsCondition.length > 0 && (
                      <div className="mt-4">
                        {tagsCondition.map((condition, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-300 rounded flex justify-between items-center mb-2"
                          >
                            <div>
                              <span className="font-semibold">Tag</span>
                              <p className="text-gray-500">
                                {condition.tags
                                  .map((tagId) =>
                                    tags.find((tag) => tag.id === tagId)
                                  )
                                  .map((tag) => tag?.value)
                                  .join(", ")}
                              </p>
                            </div>
                            <Popover open={popoverTagOpen}>
                              <PopoverTrigger asChild>
                                <button
                                  className="p-2 hover:bg-gray-200 rounded-full"
                                  onClick={() => setPopoverTagOpen(true)}
                                  ref={popoverTagRef}
                                >
                                  <HiOutlineDotsHorizontal size={24} />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <button
                                  className="flex items-center p-5"
                                  onClick={() => handleEditTagCondition(index)}
                                >
                                  <FaRegEdit className="mr-2" /> Edit
                                </button>
                                <button
                                  className="flex items-center text-red-500 mt-2 p-5"
                                  onClick={() =>
                                    handleDeleteTagCondition(index)
                                  }
                                >
                                  <RiDeleteBin6Line className="mr-2" /> Delete
                                </button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                      </div>
                    )}
                    {customerCondition.length > 0 && (
                      <div className="mt-4">
                        {customerCondition.map((condition, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-300 rounded flex justify-between items-center mb-2"
                          >
                            <div>
                              <span className="font-semibold">Tag</span>
                              <p className="text-gray-500">
                                {condition.customers
                                  .map((customerId) =>
                                    customers.find(
                                      (customer) => customer.id === customerId
                                    )
                                  )
                                  .map((customer) => customer?.name)
                                  .join(", ")}
                              </p>
                            </div>
                            <Popover open={popoverCustomerOpen}>
                              <PopoverTrigger asChild>
                                <button
                                  className="p-2 hover:bg-gray-200 rounded-full"
                                  onClick={() => setPopoverCustomerOpen(true)}
                                  ref={popoverCustomerRef}
                                >
                                  <HiOutlineDotsHorizontal size={24} />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <button
                                  className="flex items-center p-5"
                                  onClick={() =>
                                    handleEditCustomerCondition(index)
                                  }
                                >
                                  <FaRegEdit className="mr-2" /> Edit
                                </button>
                                <button
                                  className="flex items-center text-red-500 mt-2 p-5"
                                  onClick={() =>
                                    handleDeleteCustomerCondition(index)
                                  }
                                >
                                  <RiDeleteBin6Line className="mr-2" /> Delete
                                </button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      className="w-full mt-4 p-4 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
                      onClick={() => setShowAddConditionModal(true)}
                    >
                      <AiOutlinePlus size={20} className="mr-2" />
                      Add Condition
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ----------------------------------------------------Show Add Condition Modal-------------------------------------------------- */}
          {showAddConditionModal && (
            <div>
              <div className="px-7">
                <h3 className="text-2xl p-4 font-bold leading-6 text-gray-900 mb-4 border-b">
                  Add Condition
                </h3>
                <div className="space-y-4">
                  <div
                    className={`p-4 border border-gray-300 rounded hover:bg-gray-100 transition flex justify-between items-center cursor-pointer ${
                      conditions.length ? "hidden" : ""
                    }`}
                    onClick={() => {
                      setShowProductSelectionModal(true);
                      setShowAddConditionModal(false);
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
                    className={`p-4 border border-gray-300 rounded hover:bg-gray-100 transition flex justify-between items-center cursor-pointer ${
                      customerCondition.length ? "hidden" : ""
                    }`}
                    onClick={() => {
                      setShowCustomerSelectionModal(true);
                      setShowAddConditionModal(false);
                    }}
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
                      setShowTagSelectionModal(true);
                      setShowAddConditionModal(false);
                    }}
                    className={`p-4 border border-gray-300 rounded hover:bg-gray-100 transition flex justify-between items-center cursor-pointer ${
                      tagsCondition.length ? "hidden" : ""
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
                      onClick={() => setShowAddConditionModal(false)}
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
          )}
          {/* ----------------------------------------------------Show Product Select Modal-------------------------------------------------- */}
          {showProductSelectionModal && (
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowProductSelectionModal(false);
                    setShowAddConditionModal(true);
                  }}
                >
                  <AiOutlineLeft size={24} />
                </button>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  Choose products
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => setShowProductSelectionModal(false)}
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
                      {products && products.length > 0 ? (
                        <>
                          {skeleton ? (
                            <SkeletonTable />
                          ) : (
                            products.map((product, index) => (
                              <TableRow
                                key={`o-${index}`}
                                className={`grid grid-cols-12 min-h-12 cursor-default`}
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
                <Paginations
                  totalPages={totalPage}
                  currentPage={currentPage}
                  onPageChange={handlePagination}
                />
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
                    onClick={() => setShowProductSelectionModal(false)}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddCondition}
                      className="bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700"
                    >
                      Save and add more
                    </button>
                    <Button
                      className={`${
                        isPublished && "pointer-events-none select-none"
                      } bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700`}
                      onClick={() => {
                        handleAddCondition();
                        setShowProductSelectionModal(false);
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
          )}
          {/* ------------------------------------------------------Show Tag Select Modal-------------------------------------------------- */}
          {showTagSelectionModal && (
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowTagSelectionModal(false);
                    setShowAddConditionModal(true);
                  }}
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
                    <button
                      onClick={handleAddTagsCondition}
                      className="bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700"
                    >
                      Save and add more
                    </button>
                    <Button
                      onClick={() => {
                        handleAddTagsCondition();
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
          )}
          {/* ----------------------------------------------------Show Customer Select Modal-------------------------------------------------- */}
          {showCustomerSelectionModal && (
            <div>
              <div className="flex justify-between items-center pb-3">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => {
                    setShowCustomerSelectionModal(false);
                    setShowAddConditionModal(true);
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
                    <button
                      onClick={handleAddCustomerCondition}
                      className="bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700"
                    >
                      Save and add more
                    </button>
                    <Button
                      onClick={() => {
                        handleAddCustomerCondition();
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
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
};

export default DiscountModal;
