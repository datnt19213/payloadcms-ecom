import React, { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Button } from "../../components/ui/button";
import { FcCurrencyExchange } from "react-icons/fc";
import { FaRegEdit } from "react-icons/fa";
import { CRUDContainer } from "../../components/container";

import type { AdminViewComponent } from "payload/config";
import { useConfig } from "payload/components/utilities";
import { useStepNav } from "payload/dist/admin/components/elements/StepNav";
import { Redirect } from "react-router-dom";
import { APIGet, APIPost, APIPut } from "../../api";
import { useHistory } from "react-router-dom";
import { RelationshipMultiField } from "../../components/fields";
import { DatePickerWithRange } from "../discount";
import { ChevronDownIcon, ClockIcon, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import CurrencyInput from "react-currency-input-field";
import { IoIosInformationCircleOutline } from "react-icons/io";

interface Metadata {
  start_at: any;
  email: string;
  personal_message: string;
}

interface Region {
  id: string;
  name: string;
  currency_code: string;
  tax_rate: number;
  tax_code: string;
  gift_cards_taxable: boolean;
  automatic_taxes: boolean;
  tax_provider_id?: string;
  metadata?: any;
}

interface GiftCard {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  code: string;
  value: number;
  balance: number;
  region_id: string;
  is_disabled: boolean;
  ends_at?: string;
  tax_rate?: number;
  metadata: Metadata;
  order?: any;
  region: Region;
}

interface GiftCardsResponse {
  gift_cards: GiftCard[];
  count: number;
  offset: number;
  limit: number;
}

interface GiftCardRequestBody {
  region_id: string;
  ends_at?: string | null; // Optional field, can be null or undefined
  metadata?: {
    start_at?: string; // Optional field
  };
}

const GetLastStringFromUrl = () => {
  const path = window.location.pathname; // Or use React Router's useLocation if you are using React Router
  const parts = path.split("/");
  return parts.pop(); // safely get the last part
};

const UpdateGiftCards: AdminViewComponent = ({ canAccessAdmin, user }) => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();
  const { setStepNav } = useStepNav();
  const history = useHistory();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const popoverRef = useRef(null);
  const [giftCardId, setGiftCardId] = useState<string | null>(null);
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [showEditBalances, setShowEditBalances] = useState(false);
  const [regionOptions, setRegionOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedRegions, setSelectedRegions] = useState<
    { value: string; label: string }[]
  >([]);

  const [regionError, setRegionError] = useState("");
  const [checked, setChecked] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("00:00");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  const currentHour = startTime.split(":")[0];
  const currentMinute = startTime.split(":")[1].split(" ")[0];
  const [createLoading, setCreateLoading] = useState(false);

  const [checkedStartDate, setCheckedStartDate] = useState(false);
  const [startDateMetadata, setStartDateMetadata] = useState<Date | null>(null);
  const [startTimeMetadata, setStartTimeMetadata] = useState<string>("00:00");

  const currentHourMetadata = startTimeMetadata.split(":")[0];
  const currentMinuteMetadata = startTimeMetadata.split(":")[1].split(" ")[0];

  const getProductRegions = async () => {
    setLoading(true);
    try {
      const response = await APIGet("/admin/regions", user?.token.toString());
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

  useEffect(() => {
    setStepNav([
      {
        label: "Gift Cards",
        url: "/admin/collections/gift-cards",
      },
      {
        label: "Update Gift Card",
      },
    ]);
  }, [setStepNav]);

  useEffect(() => {
    const param = GetLastStringFromUrl();
    console.log(param);
    if (param) {
      setGiftCardId(param);
    } else {
      console.error("No discount ID found in URL.");
      history.push("/admin/collections/gift-cards");
    }
  }, [history]);

  const isUserAuthorized = user?.roles === "admin" || user?.roles === "manager";

  if (!user || !canAccessAdmin || !isUserAuthorized) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  const fetchGiftCardData = async (id: string) => {
    setLoading(true);
    try {
      const response = await APIGet(
        `/admin/gift-cards/${id}`,
        user?.token.toString()
      );
      const giftCards = response.data.gift_card;
      setGiftCard(giftCards);
      if (giftCards.ends_at) {
        setStartDate(giftCards.ends_at);
        setStartTime(formatUTC(giftCards.ends_at));
        setChecked(true);
      }
      if(giftCards.metadata.start_at) {
        setStartDateMetadata(giftCards.metadata.start_at);
        setStartTimeMetadata(formatUTC(giftCards.metadata.start_at));
        setCheckedStartDate(true);
      }
      setAmount(giftCards.balance);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const formatUTC = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().substring(11, 16);
  };

  useEffect(() => {
    const initData = async () => {
      await getProductRegions();
      if (giftCardId) {
        await fetchGiftCardData(giftCardId);
      }
    };
    initData();
  }, [giftCardId]);

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

  const handleRegionChange = (
    selectedRegions: { value: string; label: string }[]
  ) => {
    setSelectedRegions(selectedRegions);
  };

  const handleTimeChange = (hour, minute) => {
    const newTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    setStartTime(newTime);
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

  const handleSaveAndClose = async (event) => {
    event.preventDefault();

    setCreateLoading(true);

    let expiryDateTimeUTC = null;
    let startDateTimeUTC: string | null = null;

    if (checked) {
      expiryDateTimeUTC = combineDateTime(startDate, startTime);
    }

    if(checkedStartDate) {
      startDateTimeUTC = combineDateTime(startDateMetadata, startTimeMetadata);
    }

    for (const region of selectedRegions) {
      const requestBody: GiftCardRequestBody = {
        region_id: region.value,
        ends_at: expiryDateTimeUTC,
        metadata: {
          start_at: checkedStartDate && startDateTimeUTC ? startDateTimeUTC : "",
        },
      };
      try {
        const response = await APIPut(
          `/cms/api/update/gift-card?giftCardId=${giftCardId}`,
          requestBody,
          user?.token.toString()
        );
        if (response) {
          fetchGiftCardData(giftCardId);
          toast.success("Gift Card Created for: " + region.label);
          setShowEditDetails(false);
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

  const handleSaveBalance = async (event) => {
    event.preventDefault();

    setCreateLoading(true);

    const numericAmount = parseInt(amount.replace(/\D/g, ""), 10);

    if (isNaN(numericAmount)) {
      setAmountError("The amount must be a valid number.");
      setCreateLoading(false);
      return;
    } else if (numericAmount > giftCard.value) {
      setAmountError(
        "The updated balance cannot exceed the original value of " +
          formatCurrency(giftCard.value)
      );
      setCreateLoading(false);
      return;
    } else {
      setAmountError("");
    }

    const requestBody = {
      balance: numericAmount,
    };

    try {
      const response = await APIPost(
        `/admin/gift-cards/${giftCardId}`,
        requestBody,
        user?.token.toString()
      );
      if (response) {
        fetchGiftCardData(giftCardId);
        toast.success("Updated balances successfully");
        setShowEditBalances(false);
      }
    } catch (error) {
      console.error("Error updating balances for gift card:", error);
    } finally {
      setCreateLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    if (regionOptions.length > 0 && giftCard) {
      const matchedRegion = regionOptions.find(
        (region) => region.value === giftCard.region_id
      );
      if (matchedRegion) {
        setSelectedRegions([matchedRegion]);
      }
    }
  }, [regionOptions, giftCard]);

  const handleAmountChange = (value) => {
    const numericValue = parseInt(value?.replace(/\D/g, ""), 10) || 0;
    if (numericValue > giftCard.value) {
      setAmountError(
        "The updated balance cannot exceed the original value of " +
          formatCurrency(giftCard.value)
      );
    } else {
      setAmountError("");
      setAmount(value);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleTimeMetadataChange = (hour, minute) => {
    const newTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    setStartTimeMetadata(newTime);
  };

  return (
    <>
      <CRUDContainer
        title="Update Gift Cards"
        toBack="/admin/collections/gift-cards"
      >
        {!giftCard ? (
          <>
            <SkeletonCardInfo />
            <SkeletonCardCondition />
          </>
        ) : (
          <div className="w-full mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">{giftCard?.code}</h1>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-transparent hover:bg-gray-100 px-3 py-1 rounded-full transition duration-200">
                  <span
                    className={`flex items-center justify-center w-3 h-3 ${giftCard?.is_disabled ? "bg-red-500" : "bg-green-500"} rounded-full`}
                  ></span>
                  <span
                    className={`text-sm font-semibold ${giftCard?.is_disabled ? "text-red-500" : "text-green-500"}`}
                  >
                    {giftCard?.is_disabled ? "Inactive" : "Active"}
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
                        onClick={() => setShowEditDetails(true)}
                      >
                        <FaRegEdit className="mr-2" />
                        Edit details
                      </Button>
                      <Button
                        className="flex items-center px-4 py-2 text-white-700 bg-gray-100 w-full hover:text-cyan-50"
                        onClick={() => setShowEditBalances(true)}
                      >
                        <FcCurrencyExchange className="mr-2" /> Update Balance
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="w-full mx-auto bg-white p-6 rounded-lg">
              <div className="grid grid-cols-5 gap-4 py-5">
                {giftCard?.value && (
                  <div className="col-span-1 border-r">
                    <p className="text-lg font-bold">Original amount</p>
                    <p className="text-base">
                      ₫{giftCard?.value?.toLocaleString()}
                    </p>
                  </div>
                )}
                {giftCard?.balance && (
                  <div className="col-span-1 border-r">
                    <p className="text-lg font-bold">Balance</p>
                    <p className="text-base">
                      ₫{giftCard?.balance?.toLocaleString()}
                    </p>
                  </div>
                )}
                {giftCard?.region?.name && (
                  <div className="col-span-1 border-r">
                    <p className="text-lg font-bold">Region</p>
                    <p className="text-base">{giftCard?.region?.name}</p>
                  </div>
                )}
                {giftCard?.ends_at && (
                  <div className="col-span-1 border-r">
                    <p className="text-lg font-bold">Expires on</p>
                    <p className="text-base">
                      {giftCard?.ends_at
                        ? new Date(giftCard.ends_at).toLocaleDateString(
                            "en-US",
                            {
                              timeZone: "UTC",
                            }
                          ) +
                          " " +
                          new Date(giftCard.ends_at).toLocaleTimeString(
                            "en-US",
                            {
                              timeZone: "UTC",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                )}
                {giftCard?.metadata.start_at && (
                  <div className="col-span-1 border-r">
                    <p className="text-lg font-bold">Created</p>
                    <p className="text-base">
                      {giftCard?.metadata.start_at
                        ? new Date(giftCard.metadata.start_at).toLocaleDateString(
                            "en-US",
                            { timeZone: "UTC" }
                          ) +
                          " " +
                          new Date(giftCard.metadata.start_at).toLocaleTimeString(
                            "en-US",
                            { timeZone: "UTC" }
                          )
                        : "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CRUDContainer>
      {showEditDetails && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-xl leading-6 font-medium text-gray-900 px-7 py-3 border-b">
                Edit Gift Card
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
                  <div className="items-center justify-end flex gap-6">
                    <Button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-4 rounded-l"
                      onClick={() => setShowEditDetails(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`${createLoading} ? "pointer-events-none select-none" : "bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-r cursor-pointer"`}
                      disabled={createLoading}
                      onClick={handleSaveAndClose}
                    >
                      {createLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="animate-spin mr-2" />
                          <p>Creating</p>
                        </div>
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditBalances && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-xl leading-6 font-medium text-gray-900 px-7 py-3 border-b">
                Update Balance
              </h3>
              <div className="mt-2 px-7 py-3">
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Amount
                    </label>
                    <CurrencyInput
                      id="amount"
                      name="amount"
                      placeholder="₫"
                      defaultValue={amount}
                      decimalsLimit={0}
                      groupSeparator="."
                      decimalSeparator=","
                      prefix="₫"
                      onValueChange={handleAmountChange}
                      className="shadow appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {amountError && (
                      <p className="text-red-500 text-xs italic">
                        {amountError}
                      </p>
                    )}
                  </div>
                  <div className="items-center justify-end flex gap-6">
                    <Button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-4 rounded-l"
                      onClick={() => setShowEditBalances(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`${createLoading} ? "pointer-events-none select-none" : "bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-r cursor-pointer"`}
                      disabled={createLoading}
                      onClick={handleSaveBalance}
                    >
                      {createLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="animate-spin mr-2" />
                          <p>Creating</p>
                        </div>
                      ) : (
                        "Save and close"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" />
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

export default UpdateGiftCards;
