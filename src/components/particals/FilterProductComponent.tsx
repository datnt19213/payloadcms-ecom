"use client";

import React, {FC, useEffect, useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";

import {cn} from "../../lib/utils";
import {Button} from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {
  Common,
  FilterList,
  FilterProductList,
  OrderStatusList,
  PaymentStatusList,
  ProductStatusList,
} from "../../common/data";
import {Checkbox} from "../ui/checkbox";
import {IOutputData, User, ValueLabel} from "../../types";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {
  ClearCurrencyDotFormat,
  FormattedCurrencyWithDot,
  ToValueLabel,
} from "../../utils";
import {DateToISODate} from "../../utils/util/dateUtils";
import {RelationshipMultiField} from "../fields";
import {IOutputProductData} from "../../types/Filter";
import {useAuth} from "payload/components/utilities";
import {APIGet} from "../../api";

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

export const FilterProductComp: FC<Props> = ({
  showFilter = false,
  outputFnc,
}) => {
  const {user} = useAuth<User>();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [status, setStatus] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sales_channel, setSales_channel] = useState<string[]>([]);

  // data list render
  const [categoriesData, setCategoriesData] = useState<ValueLabel[]>([]);
  const [tagsData, setTagsData] = useState<ValueLabel[]>([]);
  const [sales_channelData, setSales_channelData] = useState<ValueLabel[]>([]);

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

  // #region render data to selection
  useEffect(() => {
    const fetchData = async () => {
      await APIGet("/admin/product-categories?limit=99999", user?.token).then(
        (res) => {
          if (res.success) {
            setCategoriesData(
              ToValueLabel(res?.data?.product_categories, "name", "id")
            );
          }
        }
      );
      await APIGet("/admin/sales-channels?limit=99999", user?.token).then(
        (res) => {
          if (res.success) {
            setSales_channelData(
              ToValueLabel(res?.data?.sales_channels, "name", "id")
            );
          }
        }
      );
      await APIGet("/admin/product-tags?limit=99999", user?.token).then(
        (res) => {
          if (res.success) {
            setTagsData(ToValueLabel(res?.data?.product_tags, "value", "id"));
          }
        }
      );
      await APIGet("/admin/product-categories?limit=99999", user?.token).then(
        (res) => {
          if (res.success) {
            setCategoriesData(
              ToValueLabel(res?.data?.product_categories, "name", "id")
            );
          }
        }
      );
    };

    fetchData();
  }, []);

  // #endregion

  // #region handle status order filter value
  const handleSelectStatusFilter = (val: any[]) => {
    setStatus(val);
  };

  // #endregion

  // #region handle sale channel order filter value

  const handleSelectSaleChannelFilter = (val: any[]) => {
    setSales_channel(val);
  };
  // #endregion

  // #region handle tag fiilter value
  const handleSelectTagFilter = (val: any[]) => {
    setTags(val);
  };
  // #endregion

  // #region handle category filter value

  const handleSelectCategoryFilter = (val: any[]) => {
    setCategories(val);
  };

  // #endregion

  // #region Check onchange data filter of return

  // #endregion

  const handleFilterClear = () => {
    setStatus([]);
    setCategories([]);
    setTags([]);
    setSales_channel([]);
  };

  const handleFilterApply = () => {
    let outputData: IOutputProductData = {
      status: status,
      categories: categories,
      tags: tags,
      sales_channel: sales_channel,
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
                      {FilterProductList.map((filter) => (
                        <CommandItem
                          className="cursor-pointer"
                          key={filter.value}
                          value={filter.value}
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
                              filterSelected.includes(filter.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {filter.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex w-full col-span-1 lg:col-span-2 flex-wrap gap-3">
            {filterSelected.includes(Common.fpt_categories) && (
              <div className="flex gap-5 flex-wrap">
                <RelationshipMultiField
                  defaultValue={categories}
                  className="w-32 !mt-0"
                  size="fit"
                  title="Categories"
                  options={categoriesData}
                  onChange={handleSelectCategoryFilter}
                />
              </div>
            )}
            {/* {filterSelected.includes(Common.fpt_price) && (
              <div className="flex gap-5 flex-wrap">
                <RelationshipMultiField
                defaultValue={clear}
                  className="w-32 !mt-0"
                  size="fit"
                  title="Price"
                  onChange={handleSelectCategoryFilter}
                />
              </div>
            )} */}
            {filterSelected.includes(Common.fpt_sales_channel) && (
              <div className="flex gap-5 flex-wrap">
                <RelationshipMultiField
                  defaultValue={sales_channel}
                  className="w-32 !mt-0"
                  size="fit"
                  title="Sale Channel"
                  options={sales_channelData}
                  onChange={handleSelectSaleChannelFilter}
                />
              </div>
            )}
            {filterSelected.includes(Common.fpt_status) && (
              <div className="flex gap-5 flex-wrap">
                <RelationshipMultiField
                  defaultValue={status}
                  className="w-32 !mt-0"
                  size="fit"
                  title="Status"
                  options={ProductStatusList}
                  onChange={handleSelectStatusFilter}
                />
              </div>
            )}
            {filterSelected.includes(Common.fpt_tags) && (
              <div className="flex gap-5 flex-wrap">
                <RelationshipMultiField
                  defaultValue={tags}
                  className="w-32 !mt-0"
                  size="fit"
                  title="Tags"
                  options={tagsData}
                  onChange={handleSelectTagFilter}
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-[1.0156rem] flex justify-end flex-wrap gap-5">
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
  );
};
