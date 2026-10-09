import React, {useState} from "react";
import {useField} from "payload/components/forms";
import {Input} from "../ui/input";
import {generateHashCode} from "../../utils/util/generateHashCode";
import {cutString} from "../../utils/util/sliceStringCode";
import {Gutter} from "payload/components/elements";

interface Props {
  title: string;
  data: string;
  onChange: (val: string) => void;
  size?: "sm" | "base" | "lg" | "xl";
  id?: string;
}

export const PriceField: React.FC<{path: string}> = ({path}) => {
  const {value = "", setValue} = useField<string>({path});

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor="price-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value != "" ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Price
        </span>
        <input
          id="price-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};

export const OrderField: React.FC<{path: string}> = ({path}) => {
  const {value = "", setValue} = useField<string>({path});

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor="order-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value != "" ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Index
        </span>
        <input
          id="order-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
      <span className="mt-3 italic text-gray-500 text-xs px-5">
        (*): The position of a menu in a menu row
      </span>
    </Gutter>
  );
};
export const NumberField: React.FC<Props> = ({
  title,
  data,
  onChange,
  size,
  id = "",
}) => {
  const [value, setValue] = useState<string>(data);

  let isSize =
    size === "sm"
      ? "min-h-7"
      : size === "base"
      ? "min-h-8"
      : size === "lg"
      ? "min-h-9"
      : "min-h-10";
  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor={`${id}-${title}-field-order`}
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value != "" ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          {title}
        </span>
        <input
          id={`${id}-${title}-field-order`}
          className={`${isSize} w-full mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4`}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          type="number"
        />
      </label>
    </Gutter>
  );
};
