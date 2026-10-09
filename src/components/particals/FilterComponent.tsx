"use client";

import React, {FC, useEffect, useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";

import {cn} from "../../lib/utils";
import {Button} from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Common,
  FilterList,
  OrderStatusList,
  PaymentStatusList,
} from "../../common/data";
import {Checkbox} from "../ui/checkbox";
import {IOutputData} from "../../types";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {ClearCurrencyDotFormat, FormattedCurrencyWithDot} from "../../utils";
import {DateToISODate} from "../../utils/util/dateUtils";

/**
 * Filters panel
 *
 * @param showFilter - Show/Hide the filter panel
 *
 */

interface Props {
  showFilter?: boolean;
  outputFnc?: (output?: any) => void;
}

interface ErrorAmount {
  from: boolean;
  to: boolean;
}
interface ErrorDate {
  from: boolean;
  to: boolean;
}

export const FilterComp: FC<Props> = ({showFilter = false, outputFnc}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [cbStatus, setCbStatus] = useState<string[]>([]);
  const [cbPaymentStatus, setCbPaymentStatus] = useState<string[]>([]);

  const [amountError, setAmountError] = useState<ErrorAmount>({
    from: false,
    to: false,
  });
  const [amountFromString, setAmountFromString] = useState("");
  const [amountToString, setAmountToString] = useState("");
  const [amountFrom, setAmountFrom] = useState(0);
  const [amountTo, setAmountTo] = useState(0);

  const [dateError, setDateError] = useState({
    from: false,
    to: false,
  });

  const [dateFromString, setDateFromString] = useState("");
  const [dateToString, setDateToString] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

    const [filterSelected, setFilterSelected] = useState<string[]>([]);

    const handleFilterSelected = (value: string) => {
      setFilterSelected((prevSelected) => {
        const isSelected = prevSelected.includes(value);
        if (isSelected) {
          return prevSelected.filter((item) => item !== value);
        } else {
          return [...prevSelected, value];
        }
      });
    };

    // #region handle status order filter value
    const handleStatusCheckChange = (id: string) => {
      setCbStatus((prevSelected) => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter((selectedId) => selectedId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    };
    const handlePaymentStatusCheckChange = (id: string) => {
      setCbPaymentStatus((prevSelected) => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter((selectedId) => selectedId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    };
    // #endregion

    // #region handle amount fiilter value
    const handleFromAmountChange = (val: any) => {
      if (/[a-zA-Z]/.test(val)) {
        return;
      }
      let amount = ClearCurrencyDotFormat(val);

      if (amount >= 0 && amount <= 999999999) {
        setAmountFromString(FormattedCurrencyWithDot(amount));
      }
    };
    const handleToAmountChange = (val: any) => {
      if (/[a-zA-Z]/.test(val)) {
        return;
      }
      let amount = ClearCurrencyDotFormat(val);
      if (amount >= 0 && amount <= 999999999) {
        setAmountToString(
          FormattedCurrencyWithDot(ClearCurrencyDotFormat(val))
        );
      }
    };
    // #endregion

    // #region handle date filter value

    const handleFromDateChange = (val: any) => {
      setDateFrom(val);
    };
    const handleToDateChange = (val: any) => {
      setDateTo(val);
    };

    // #endregion

    // #region Check onchange data filter of amount & date
    useEffect(() => {
      // filter with date
      if (dateFrom || dateTo) {
        if (dateFrom <= dateTo || dateFrom || dateTo) {
          setDateError({from: false, to: false});
          setDateFromString(DateToISODate(dateFrom));
          setDateToString(DateToISODate(dateTo));
        } else {
          setDateError({from: true, to: true});
        }
      } else {
        setDateFromString(undefined);
        setDateToString(undefined);
      }

      // filter amount price
      if (amountFromString != "" && amountToString != "") {
        let amount1 = ClearCurrencyDotFormat(amountFromString);
        let amount2 = ClearCurrencyDotFormat(amountToString);

        if (amount1 <= amount2) {
          setAmountFrom(amount1);
          setAmountTo(amount2);
          setAmountError({from: false, to: false});
        } else {
          setAmountError({from: true, to: true});
        }
      } else {
        setAmountFrom(0);
        setAmountTo(0);
      }
    }, [dateFrom, dateTo, amountFromString, amountToString]);
    // #endregion
    const handleFilterClear = () => {
      setAmountFrom(0);
      setAmountTo(0);
      setCbPaymentStatus([]);
      setCbStatus([]);
      setAmountFromString("");
      setAmountToString("");
      setDateFrom("");
      setDateTo("");
      setDateError({from: false, to: false});
      setAmountError({from: false, to: false});
    };
    const handleFilterApply = () => {
      let outputData: IOutputData = {
        orderStatus: cbStatus,
        paymentStatus: cbPaymentStatus,
        amounts: {
          from: amountFrom,
          to: amountTo,
        },
        dates: {
          from: dateFromString,
          to: dateToString,
        },
      };
      console.log(JSON.stringify(outputData));
      outputFnc(outputData);
    };

    return (
      <div
        className={`${
          showFilter ? "flex" : "hidden"
        } w-full h-fit flex-col gap-5 px-8`}
      >
        <div className="w-full rounded-md flex flex-col mt-5 bg-gray-50 ">
          <div className="flex flex-col lg:flex-row min-h-32 h-fit w-full gap-12 p-5">
            <div className="col-span-1 w-fit relative">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[18.75rem] h-12 justify-between outline-none border-none ring-1 ring-gray-300 hover:bg-gray-100 transition-all duration-200"
                  >
                    {value
                      ? `${filterSelected.length} selected`
                      : "Select filter..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[18.75rem] p-0">
                  <Command>
                    <CommandInput placeholder="Find filter..." />
                    <CommandList>
                      <CommandEmpty>No filter found.</CommandEmpty>
                      <CommandGroup>
                        {FilterList.map((framework) => (
                          <CommandItem
                            className="cursor-pointer"
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                              handleFilterSelected(currentValue);
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                filterSelected.includes(framework.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {framework.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col flex-wrap w-full col-span-1 lg:col-span-2 gap-5">
              {filterSelected.includes(Common.ft_order_status) && (
                <div className="flex gap-5 flex-col">
                  <Label className="text-base">Status Order</Label>
                  <div className="flex gap-5 flex-wrap">
                    {OrderStatusList.map((status, index) => (
                      <div key={index} className="w-fit flex gap-3">
                        <Checkbox
                          id={`cb-order-status${index}`}
                          key={index}
                          value={status.value}
                          checked={cbStatus.includes(status.value.toString())}
                          onCheckedChange={() =>
                            handleStatusCheckChange(status.value)
                          }
                        />
                        <Label
                          htmlFor={`cb-order-status${index}`}
                          className="text-base text-nowrap"
                        >
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {filterSelected.includes(Common.ft_amount) && (
                <div className="flex flex-col gap-3">
                  <Label className="text-base">Amount</Label>

                  <div className=" gap-5 flex">
                    <div className="flex flex-col lg:flex-row gap-3 col-span-1 flex-wrap">
                      <Label className="text-base text-nowrap">
                        From price
                      </Label>
                      <Input
                        className={`${
                          amountError.from ? "ring-red-600" : "ring-gray-300"
                        } h-12 focus:outline-none focus-within:outline-none focus:ring-0 focus-within:ring-0 border-none ring-1 focus:ring-gray-900 transition-all duration-200 w-[18.75rem]`}
                        type="text"
                        value={amountFromString}
                        placeholder="From price"
                        onChange={(e) => handleFromAmountChange(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-3 col-span-1">
                      <Label className="text-base text-nowrap">To price</Label>
                      <Input
                        className={`${
                          amountError.to ? "ring-red-600" : "ring-gray-300"
                        } h-12 focus:outline-none focus-within:outline-none focus:ring-0 focus-within:ring-0 border-none ring-1 focus:ring-gray-900 transition-all duration-200 w-[18.75rem]`}
                        type="text"
                        value={amountToString}
                        placeholder="To price"
                        onChange={(e) => handleToAmountChange(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {filterSelected.includes(Common.ft_date_range) && (
                <div className="flex flex-col gap-3">
                  <Label className="text-base">Date</Label>

                  <div className="gap-5 flex flex-wrap">
                    <div className="flex flex-col lg:flex-row gap-3 col-span-1">
                      <Label className="text-base text-nowrap">From</Label>
                      <Input
                        className={`${
                          dateError.from ? "ring-red-600" : "ring-gray-300"
                        } h-12 focus:outline-none focus-within:outline-none focus:ring-0 focus-within:ring-0 border-none ring-1 focus:ring-gray-900 transition-all duration-200 w-[18.75rem]`}
                        type="date"
                        value={dateFrom}
                        onChange={(e) => handleFromDateChange(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-3 col-span-1">
                      <Label className="text-base text-nowrap">To</Label>
                      <Input
                        className={`${
                          dateError.to ? "ring-red-600" : "ring-gray-300"
                        } h-12 focus:outline-none focus-within:outline-none focus:ring-0 focus-within:ring-0 border-none ring-1 focus:ring-gray-900 transition-all duration-200 w-[18.75rem]`}
                        type="date"
                        value={dateTo}
                        onChange={(e) => handleToDateChange(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {filterSelected.includes(Common.ft_payment_status) && (
                <div className="flex flex-col gap-5">
                  <Label className="text-base">Status Payment</Label>
                  <div className="flex flex-wrap gap-5">
                    {PaymentStatusList.map((status, index) => (
                      <div className="w-fit flex gap-3">
                        <Checkbox
                          id={`cb-payment-status${index}`}
                          key={index}
                          value={status.value}
                          checked={cbPaymentStatus.includes(
                            status.value.toString()
                          )}
                          onCheckedChange={() =>
                            handlePaymentStatusCheckChange(status.value)
                          }
                        />
                        <Label
                          htmlFor={`cb-payment-status${index}`}
                          className="text-base text-nowrap"
                        >
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-[1.0156rem] flex justify-between flex-wrap gap-5">
            <div className="flex flex-col justify-end">
              <div className="flex flex-col items-center gap-1.5">
                {(amountError.from || amountError.to) && (
                  <span className=" text-red-600">
                    "From Price" must be number & less than "To Price"
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center gap-1.5">
                {(dateError.from || dateError.to) && (
                  <span className=" text-red-600">
                    "Date From" must be less than the "Date To"
                  </span>
                )}
              </div>
            </div>
            <div className="gap-5 flex items-center justify-end">
              <Button
                className="self-end text-red-600"
                type="button"
                variant="outline"
                onClick={() => handleFilterClear()}
              >
                Clear Filter
              </Button>
              <Button
                className="self-end"
                type="button"
                onClick={() => handleFilterApply()}
              >
                Filter Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
};
