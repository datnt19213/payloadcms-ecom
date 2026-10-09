import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "payload/components/utilities";

import { ManagementContainer } from "../../components/container";
import { Button } from "../../components/ui/button";
import { RelationshipMultiField } from "../../components/fields";

import { IoAddCircleOutline } from "react-icons/io5";
import { APIDelete, APIGet, APIPost } from "../../api";

import { SkeletonHeader, SkeletonBodyRow } from "./components/SkeletonRow";

import { DatePickerWithRange } from "../discount";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { ChevronDownIcon, ClockIcon, Loader2 } from "lucide-react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import { LinkBtn } from "../../components/buttons";
import { useHistory } from "react-router-dom";
import { Modal as DeleteModal } from "../../components/modal";
import { Obj } from "../../types";
import { IoIosInformationCircleOutline } from "react-icons/io";
import axios from "axios";

interface User {
  id: number;
  email: string;
  token: string;
}

interface GiftCardRequestBody {
  region_id: string;
  value: number;
  ends_at: string;
  metadata: {
    email: string;
    personal_message: string;
    start_at?: string;
  };
}

const GiftCards = () => {
  const { user } = useAuth<User>();
  const history = useHistory(); // Hook to access the history instance

  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedStartDate, setCheckedStartDate] = useState(false);

  const [startDateMetadata, setStartDateMetadata] = useState<Date | null>(null);
  const [startTimeMetadata, setStartTimeMetadata] = useState<string>("00:00");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("00:00");

  const [regionOptions, setRegionOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedRegions, setSelectedRegions] = useState<
    { value: string; label: string }[]
  >([]);

  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const currentHour = startTime.split(":")[0];
  const currentMinute = startTime.split(":")[1].split(" ")[0];

  const currentHourMetadata = startTimeMetadata.split(":")[0];
  const currentMinuteMetadata = startTimeMetadata.split(":")[1].split(" ")[0];

  const [regionError, setRegionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const getProductRegions = async () => {
    setLoading(true);
    try {
      const response = await APIGet("/admin/regions", user?.token);
      const regions = response.data.regions.map((region: any) => ({
        value: region.id,
        label: region.name,
      }));
      setRegionOptions(regions);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setLoading(false);
    }
  };

  const fetchGiftCards = async () => {
    setLoading(true);
    try {
      const response = await APIGet(
        "/admin/gift-cards",
        user?.token.toString()
      );
      if (response.data) {
        setGiftCards(response.data.gift_cards);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
    getProductRegions();
  }, []);

  const handleRegionChange = (
    selectedRegions: { value: string; label: string }[]
  ) => {
    setSelectedRegions(selectedRegions);
  };

  const handleTimeChange = (hour, minute) => {
    const newTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    setStartTime(newTime);
  };

  const handleTimeMetadataChange = (hour, minute) => {
    const newTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    setStartTimeMetadata(newTime);
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

  const handleCreateGiftCard = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    const startDateTimeUTC = combineDateTime(startDate, startTime);
    const startDateTimeMetadataUTC = combineDateTime(startDateMetadata, startTimeMetadata);
    let isValid = true;

    setRegionError("");
    setAmountError("");
    setEmailError("");

    if (!selectedRegions || selectedRegions.length === 0) {
      setRegionError("Region is required.");
      isValid = false;
      setCreateLoading(false);
    }

    if (!amount || amount.trim() === "") {
      setAmountError("Amount is required.");
      isValid = false;
      setCreateLoading(false);
    }

    if (!email || email.trim() === "") {
      setEmailError("Email is required.");
      isValid = false;
      setCreateLoading(false);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid.");
      isValid = false;
      setCreateLoading(false);
    }

    if (!isValid) {
      return;
    }

    for (const region of selectedRegions) {
      const requestBody: GiftCardRequestBody = {
        region_id: region.value,
        value: parseInt(amount, 10),
        ends_at: startDateTimeUTC,
        metadata: {
          email: email,
          personal_message: message,
        },
      };

      if (checkedStartDate && startDateTimeMetadataUTC) {
        requestBody.metadata.start_at = startDateTimeMetadataUTC;
      }
      try {
        const response = await APIPost(
          "/cms/api/create/gift-cards",
          requestBody,
          user?.token.toString()
        );

        if (response) {
          fetchGiftCards();
          toast.success("Gift Card Created for: " + region.label);
          setModalOpen(false);
          setCreateLoading(false);
        }
      } catch (error) {
        console.error(
          "Error creating gift card for region:",
          region.label,
          error
        );
        setCreateLoading(false);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const [popoverOpen, setPopoverOpen] = useState({});
  const popoverRef = useRef({});
  const [deleteDiscountId, setDeleteDiscountId] = useState(null);
  const [isModal, setIsModal] = useState(false);

  const togglePopover = (discountId) => {
    setPopoverOpen((prev) => ({
      ...prev,
      [discountId]: !prev[discountId],
    }));
  };

  const handleClickOutside = (event) => {
    Object.keys(popoverRef.current).forEach((key) => {
      if (
        popoverRef.current[key] &&
        !popoverRef.current[key].contains(event.target)
      ) {
        setPopoverOpen((prev) => ({
          ...prev,
          [key]: false,
        }));
      }
    });
  };

  useEffect(() => {
    fetchGiftCards();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const confirmDeleteVariant = async (val: Obj) => {
    setLoadingDelete(true);
    if (val.key === "NoExecute") {
      setIsModal(false);
      return;
    } else {
      try {
        const response = await APIDelete(
          "/admin/gift-cards/",
          deleteDiscountId,
          user?.token.toString()
        );
        if (response) {
          toast.success("Deleted gift card successfully!");
          fetchGiftCards();
          setIsModal(false);
          setLoadingDelete(false);
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  return (
    <>
      <ManagementContainer title="Gift Cards" maxWidth={true}>
        <div>
          <div className="text-left">
            <p className="mt-2 text-lg">
              Manage the Gift Cards of your NVB Play store
            </p>
          </div>
          <div className="mt-8 bg-white py-6 px-6 shadow sm:rounded-lg">
            <div className="flex items-center justify-between p=4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">History</h2>
                <p className="mt-1 text-base text-gray-600">
                  See the history of purchased Gift Cards
                </p>
              </div>
              <Button
                variant="default"
                className="px-4 py-2 bg-blue-500 text-white text-base rounded-md shadow flex items-center"
                onClick={() => setModalOpen(true)}
              >
                <IoAddCircleOutline className="mr-2" />
                Custom Gift Card
              </Button>
            </div>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-4">
              <table className="w-full text-base text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  {loading ? (
                    <SkeletonHeader />
                  ) : (
                    <tr>
                      <th scope="col" className="text-base py-3 px-6">
                        Code
                      </th>
                      <th scope="col" className="text-base py-3 px-6">
                        Order
                      </th>
                      <th scope="col" className="text-base py-3 px-6">
                        Original Amount
                      </th>
                      <th scope="col" className="text-base py-3 px-6">
                        Balance
                      </th>
                      <th scope="col" className="text-base py-3 px-6">
                        Created
                      </th>
                      <th scope="col" className="text-base py-3 px-6">
                        Action
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {loading
                    ? [...Array(2)].map((_, index) => (
                        <SkeletonBodyRow key={index} />
                      ))
                    : giftCards.map((item, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            history.push(`/admin/gift-cards/edit/${item?.id}`)
                          }
                        >
                          <td className="py-4 px-6">{item.code}</td>
                          <td className="py-4 px-6">
                            {item.order ? item.order : "-"}
                          </td>
                          <td className="py-4 px-6">
                            {formatCurrency(item.value)}
                          </td>
                          <td className="py-4 px-6">
                            {formatCurrency(item.balance)}
                          </td>
                          <td className="py-4 px-6">{item.created_at}</td>
                          <td className="py-4 px-6">
                            <Popover open={popoverOpen[item.id] || false}>
                              <PopoverTrigger asChild>
                                <button
                                  className="p-2 hover:bg-gray-200 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePopover(item.id);
                                  }}
                                  ref={(el) =>
                                    (popoverRef.current[item.id] = el)
                                  }
                                >
                                  <HiOutlineDotsHorizontal size={24} />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="bg-white rounded-lg shadow-lg">
                                <div className="flex flex-col">
                                  <button
                                    className="flex items-center px-4 py-2 mt-1 text-red-500 hover:bg-red-100 w-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteDiscountId(item.id);
                                      setIsModal(true);
                                    }}
                                  >
                                    <RiDeleteBin6Line className="mr-2" /> Delete
                                  </button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ManagementContainer>
      {modalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-xl leading-6 font-medium text-gray-900 px-7 py-3 border-b">
                Custom Gift Card
              </h3>
              <div className="mt-2 px-7 py-3">
                <form>
                  <h3 className="font-bold mb-4 text-lg">Details</h3>
                  <div className="flex items-center gap-6">
                    <div className="mb-4 w-full">
                      <label className="block text-gray-700 font-bold mb-2">
                        Region<span className="text-red-500">*</span>
                      </label>
                      <RelationshipMultiField
                        className="!px-0"
                        options={regionOptions}
                        defaultValue={selectedRegions}
                        onChange={handleRegionChange}
                        size="fit"
                      />
                      {regionError && (
                        <p className="text-red-500 text-xs italic">
                          {regionError}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full mt-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Amount<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="shadow appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="₫"
                      />
                      {amountError && (
                        <p className="text-red-500 text-xs italic">
                          {amountError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
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
                            checked={checkedStartDate}
                            onChange={() =>
                              setCheckedStartDate(!checkedStartDate)
                            }
                          />
                          <span className="relative">
                            <span
                              className={`block w-14 h-8 rounded-full transition ${
                                checkedStartDate ? "bg-purple-700" : "bg-zinc-300"
                              }`}
                            ></span>
                            <span
                              className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                                checkedStartDate ? "translate-x-full" : ""
                              }`}
                            ></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* --------------------------------------------------------- Show calendar -------------------------------------------------------------*/}
                  <div className="mb-4">
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        checkedStartDate ? "max-h-[1000px] mb-5" : "max-h-0"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <DatePickerWithRange
                          value={startDateMetadata}
                          onChange={(newDate) => {
                            setStartDateMetadata(newDate);
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
                                  UTC {startTimeMetadata}
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
                                        currentHourMetadata === hour
                                          ? "bg-purple-500 text-white"
                                          : "hover:bg-gray-100"
                                      }`}
                                      onClick={() =>
                                        handleTimeMetadataChange(
                                          hour,
                                          currentMinuteMetadata
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
                                        currentMinuteMetadata === minute
                                          ? "bg-purple-500 text-white"
                                          : "hover:bg-gray-100"
                                      }`}
                                      onClick={() =>
                                        handleTimeMetadataChange(
                                          currentHourMetadata,
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
                  <div className="mb-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 font-bold">
                          Gift Card has an expiry date?
                        </span>
                        <div className="text-sm">
                          Schedule the Gift Card to deactivate in the future.
                        </div>
                      </div>
                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={checked}
                            onChange={() => setChecked(!checked)}
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
                    </label>
                  </div>
                  {/* --------------------------------------------------------- Show calendar -------------------------------------------------------------*/}
                  <div className="mb-4">
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
                  <h3 className="font-bold mb-4 text-lg">Receiver</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="shadow appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Email..."
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs italic">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Personal Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="shadow appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Write a personal message here"
                    ></textarea>
                  </div>
                  <div className="items-center justify-between flex">
                    <Button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-4 rounded-l"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`${createLoading} ? "pointer-events-none select-none" : "bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-r cursor-pointer"`}
                      disabled={createLoading}
                      onClick={handleCreateGiftCard}
                      // onClick={handleTestCreateGiftCard}
                    >
                      {createLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="animate-spin mr-2" />
                          <p>Creating</p>
                        </div>
                      ) : (
                        "Create and send"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteModal
        title="Are you sure you want to delete this gift card?"
        handle={confirmDeleteVariant}
        open={isModal}
        button2="Cancel"
        button="Confirm"
        isLoad={loadingDelete}
      />
      <ToastContainer position="top-right" />
    </>
  );
};

export default GiftCards;
