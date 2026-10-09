import React, {ChangeEvent, HTMLAttributes, useEffect, useState} from "react";
import {useField, useForm, useFormFields} from "payload/components/forms";
import {Input} from "../ui/input";
import {generateHashCode} from "../../utils/util/generateHashCode";
import {cutString} from "../../utils/util/sliceStringCode";
import {Gutter} from "payload/components/elements";
import {cn} from "../../lib/utils";
import {CircleCheckBig, Clipboard} from "lucide-react";
import {Button} from "../ui/button";
import {convertToSlug} from "../../utils";

interface Props {
  title: string;
  data?: string;
  onChange?: (val: string) => void;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "base" | "lg" | "xl";
  onEnterPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  id?: string;
  type?:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
}

export const TextField: React.FC<Props> = ({
  title = "",
  data = "",
  onChange,
  className,
  disabled,
  size = "xl",
  onEnterPress,
  type = "text",
  id = "",
  onBlur,
  onFocus,
}) => {
  const [value, setValue] = useState<string>(data || "");

  useEffect(() => {
    if (data !== value && data != "") {
      setValue(data || "");
    }
  }, [data]);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  const getValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  let isSize =
    size === "sm"
      ? "min-h-7"
      : size === "base"
      ? "min-h-8"
      : size === "lg"
      ? "min-h-9"
      : "min-h-10";
  return (
    <Gutter
      className={`dark:text-white dark:bg-transparent !px-0 ${className}`}
    >
      <label
        htmlFor={`${id}-${title}-field`}
        className={cn(
          "mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white",
          className
        )}
      >
        <span
          className={`${
            (value && value.length > 0) || (data && data.length > 0)
              ? "-translate-y-full text-sm"
              : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          {title}
        </span>
        <input
          disabled={disabled}
          id={`${id}-${title}-field`}
          className={`${isSize} w-full mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4`}
          onChange={getValue}
          onFocus={() => onFocus && onFocus()}
          onBlur={() => onBlur && onBlur()}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnterPress) {
              onEnterPress();
            }
          }}
          value={value}
          type={type}
        />
      </label>
    </Gutter>
  );
};
export const TextInactiveField: React.FC<Props> = ({
  title,
  data = "",
  onChange,
  className,
  disabled,
  size = "xl",
  id = "",
}) => {
  const [value, setValue] = useState<string>(data);

  const [copy, setCopy] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value]);

  function copyClipboard() {
    if (!copy) {
      navigator.clipboard.writeText(data).then(() => {
        setCopy(true);
        setTimeout(() => {
          setCopy(false);
        }, 2156);
      });
    }
  }

  let isSize =
    size === "sm"
      ? "min-h-7"
      : size === "base"
      ? "min-h-8"
      : size === "lg"
      ? "min-h-9"
      : "min-h-10";

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full relative">
      <label
        htmlFor={`${id}-${title}-field-inactive`}
        className={cn(
          "mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white",
          className
        )}
      >
        <Button
          size="icon"
          variant="ghost"
          className="dark:text-white dark:bg-transparent h-9 w-9 absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => copyClipboard()}
        >
          {!copy && (
            <Clipboard
              className="dark:text-white dark:bg-transparent animate-slowfadenozoom"
              size={16}
            />
          )}
          {copy && (
            <CircleCheckBig
              className="dark:text-white dark:bg-transparent animate-slowfadenozoom text-green-600"
              size={16}
            />
          )}
        </Button>
        <span
          className={`${
            (value && value.length > 0) || data.length > 0
              ? "-translate-y-full text-sm"
              : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          {title}
        </span>
        <input
          disabled={disabled}
          id={`${id}-${title}-field-inactive`}
          className={`${isSize} w-full disabled:bg-white mt-5 focus-within:outline-none pointer-events-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-12`}
          onChange={(e) => setValue(e.target.value)}
          value={data ? data : value}
        />
      </label>
    </Gutter>
  );
};
export const NameField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="name-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Name
        </span>
        <input
          id="name-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const NameSetForField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });
  const { setValue: setValueFieldValue } = useField<string>({ path: "value" });

  useEffect(() => {
    setValueFieldValue(convertToSlug(value).toLowerCase());
  }, [value, setValueFieldValue]);

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="name-set-for-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Name
        </span>
        <input
          id="name-set-for-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const TitleSetForField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });
  const { setValue: setValueFieldValue } = useField<string>({ path: "slug" });

  useEffect(() => {
    setValueFieldValue(convertToSlug(value).toLowerCase());
  }, [value, setValueFieldValue]);

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="name-set-for-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Title
        </span>
        <input
          id="name-set-for-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const ValueField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="value-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Value
        </span>
        <input
          id="value-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const ValueDisableField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="value-disable-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Value
        </span>
        <input
          id="value-disable-field"
          disabled
          className="dark:text-white dark:bg-transparent pointer-events-none min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const SlugDisableField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="value-disable-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Slug
        </span>
        <input
          id="value-disable-field"
          disabled
          className="dark:text-white dark:bg-transparent pointer-events-none min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};

export const SlugField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="slug-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Slug
        </span>
        <input
          id="slug-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};

export const CaptionField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="caption-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Caption
        </span>
        <input
          id="caption-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const AltTextField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="alttext-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Alt Text
        </span>
        <input
          id="alttext-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const TitleField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="title-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-[98%] text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Title
        </span>
        <input
          id="title-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const LinkTextField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="link-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Link Text
        </span>
        <input
          id="link-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const URLField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="url-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          URL
        </span>
        <input
          id="url-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const TagNameField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="tagname-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Tag Name
        </span>
        <input
          id="tagname-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const SiteNameField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="sitename-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Site Name
        </span>
        <input
          id="sitename-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const PrimaryColorField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="primarycolor-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Primary Color
        </span>
        <input
          id="primarycolor-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const SecondaryColorField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="secondarycolor-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Secondary Color
        </span>
        <input
          id="secondarycolor-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const PaymentProviderField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="paymentprovider-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Payment Provider
        </span>
        <input
          id="paymentprovider-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const APIKeyField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="apikey-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Api Key
        </span>
        <input
          id="apikey-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const SecretKeyField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="secretkey-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Secret Key
        </span>
        <input
          id="secretkey-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const ShippingSettingField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="shippingsetting-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Shipping Settings
        </span>
        <input
          id="shippingsetting-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const ServiceSettingField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="servicesetting-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Service Settings
        </span>
        <input
          id="servicesetting-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const KafkaBrokerField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="kafkabroker-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Kafka Broker
        </span>
        <input
          id="kafkabroker-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const TopicField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="topic-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Topic
        </span>
        <input
          id="topic-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const GroupIDField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="groupid-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Group ID
        </span>
        <input
          id="groupid-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const URLNameField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="urlname-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          URL Name
        </span>
        <input
          id="urlname-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
export const VersionField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 w-full">
      <label
        htmlFor="version-field"
        className="dark:text-white dark:bg-transparent mt-5 flex flex-col justify-center items-start relative group ring-1 overflow-hidden ring-gray-300 focus-within:ring-gray-900 focus-within:ring-2 transition-all pl-4 w-full rounded-md bg-white"
      >
        <span
          className={`${
            value && value.length > 0 ? "-translate-y-full text-sm" : ""
          } pointer-events-none select-none absolute left-4 transition-all transform group-focus-within:-translate-y-full group-focus-within:text-sm group-focus-within:text-opacity-70`}
        >
          Version
        </span>
        <input
          id="version-field"
          className="dark:text-white dark:bg-transparent min-h-10 w-full disabled:bg-white mt-5 focus-within:outline-none text-base focus:outline-none group-focus:outline-none group-focus-within:outline-none pr-4"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </label>
    </Gutter>
  );
};
