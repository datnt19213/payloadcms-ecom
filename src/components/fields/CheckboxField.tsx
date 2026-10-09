import React, {useEffect, useState} from "react";
import {useField} from "payload/components/forms";
import {Input} from "../ui/input";
import {generateHashCode} from "../../utils/util/generateHashCode";
import {cutString} from "../../utils/util/sliceStringCode";
import {Gutter} from "payload/components/elements";
interface Props {
  title: string;
  data: string;
  className?: string;
  onChange: (value: string, checked: boolean) => void;
  checked: boolean;
  size?: "sm" | "base" | "lg" | "xl";
  id?: string;
}
export const InStockField: React.FC<{path: string}> = ({path}) => {
  const {value, setValue} = useField<string>({path});

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor="instock"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-row justify-start gap-5 items-center bg-white w-fit cursor-pointer"
      >
        <input
          id="instock"
          type="checkbox"
          className="dark:text-white dark:bg-transparent min-h-10 h-7 w-7 checked:accent-gray-900 cursor-pointer"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <span className="dark:text-white dark:bg-transparent transition-all text-base">
          In Stock
        </span>
      </label>
    </Gutter>
  );
};
export const IsActiveField: React.FC<{path: string}> = ({path}) => {
  const {value, setValue} = useField<string>({path});

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor="isactive"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-row justify-start gap-5 items-center bg-white w-fit cursor-pointer"
      >
        <input
          id="isactive"
          type="checkbox"
          className="dark:text-white dark:bg-transparent min-h-10 h-7 w-7 checked:accent-gray-900 cursor-pointer"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <span className="dark:text-white dark:bg-transparent transition-all text-base">
          Is Active
        </span>
      </label>
    </Gutter>
  );
};

export const CheckboxField: React.FC<Props> = ({
  title,
  data = "",
  className,
  onChange,
  checked,
  size = "base",
  id = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(data, e.target.checked);
  };

  let isSize =
    size === "sm"
      ? "h-2 w-2"
      : size === "base"
      ? "h-3 w-3"
      : size === "lg"
      ? "h-5 w-5"
      : "h-7 w-7";

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor={`${id}-${title}-field-checkbox-data`}
        className="dark:text-white dark:bg-transparent flex flex-row justify-start gap-5 items-center bg-white w-fit cursor-pointer"
      >
        <input
          id={`${id}-${title}-field-checkbox-data`}
          type="checkbox"
          className={`${isSize} ${className} checked:accent-gray-900 cursor-pointer`}
          onChange={handleChange}
          checked={checked}
        />
        <span className="dark:text-white dark:bg-transparent transition-all text-base">
          {title}
        </span>
      </label>
    </Gutter>
  );
};
