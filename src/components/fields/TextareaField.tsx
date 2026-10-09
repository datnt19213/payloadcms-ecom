import React, { useState } from "react";
import {useField} from "payload/components/forms";
import {Gutter} from "payload/components/elements";

interface Props {
  title?: string;
  data?: string;
  onChange?: (val: string) => void;
  id?: string;
}

export const DescriptionField: React.FC<{path: string}> = ({path}) => {
  const {value = "", setValue} = useField<string>({path});

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor="product-description"
        className={` mt-5 flex flex-col items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white`}
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none mt-5 select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Description
        </span>
        <textarea
          id="product-description"
          className="dark:text-white dark:bg-transparent min-h-10 w-full mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const DescriptionField2: React.FC<Props> = ({
  title,
  data,
  onChange,
  id = "",
}) => {
  const [value, setValue] = useState<string>(data);

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor={`${id}-${title}-description-field`}
        className={` mt-5 flex flex-col items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white`}
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none mt-5 select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          {title}
        </span>
        <textarea
          id={`${id}-${title}-description-field`}
          className="dark:text-white dark:bg-transparent min-h-10 w-full mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => onChange && onChange(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
