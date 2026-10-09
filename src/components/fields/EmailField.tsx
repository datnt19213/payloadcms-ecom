import {Gutter} from "payload/components/elements";
import {useField} from "payload/components/forms";
import React, {useState} from "react";

interface Props {
  title: string;
  data: string;
  onChange: (val: string) => void;
  size?: "sm" | "base" | "lg" | "xl";
  id?: string;
}

export const EmailField: React.FC<{path: string}> = ({path}) => {
  const {value = "", setValue} = useField<string>({path});

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0">
      <label
        htmlFor="email-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Email
        </span>
        <input
          id="email-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          type="email"
        />
      </label>
    </Gutter>
  );
};
export const EmailField2: React.FC<Props> = ({
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
        htmlFor={`${id}-${title}-field-email`}
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          {title}
        </span>
        <input
          id={`${id}-${title}-field-email`}
          className={`${isSize} w-full mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4`}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          type="email"
        />
      </label>
    </Gutter>
  );
};
