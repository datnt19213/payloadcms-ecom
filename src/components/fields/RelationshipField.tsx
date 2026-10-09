import React, {FC, useEffect, useState} from "react";
import {useField} from "payload/components/forms";
// import {Props} from "payload/dist/admin/components/forms/field-types/Relationship/types";
import {Gutter} from "payload/components/elements";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {Label} from "../ui/label";

const sample = [
  {value: "red", label: "Red"},
  {value: "blue", label: "Blue"},
  {value: "green", label: "Green"},
];

interface PropsMulti {
  defaultValue?: any;
  options?: {
    value: string;
    label: string;
  }[];
  onChange?: (selectOptions: any[]) => void;
  size?: "fit" | "lg";
  className?: string;
  title?: string;
  titleClass?: string;
  placeholder?: string;
}
interface PropsSingle {
  defaultValue?: any;
  options?: {
    value: string;
    label: string;
  }[];
  onChange?: (selectOptions: any) => void;
  size?: "fit" | "lg";
  className?: string;
  title?: string;
  titleClass?: string;
  placeholder?: string;
}

const animatedComponents = makeAnimated();

export const RelationshipMultiField: FC<PropsMulti> = ({
  options = sample,
  defaultValue,
  onChange,
  size = "lg",
  className = "!px-5",
  title = "",
  titleClass = "",
  placeholder = "Select Options",
}) => {
  const [defaultVal, setDefaultVal] = useState<
    {value: string; label: string}[]
  >([]);

  const handleSelectChange = (selectedOptions: any[]) => {
    if (onChange) {
      onChange(selectedOptions);
    }
  };

  useEffect(() => {
    setDefaultVal(defaultValue);
  }, [defaultValue]);

  let isSize = size === "fit" ? "h-fit" : "min-h-16";

  return (
    <div
      className={`dark:text-white dark:bg-transparent ${className} mt-5 w-full`}
    >
      <Label className={`${titleClass}`}>{title}</Label>
      <Select
        className={`ring-1 ${isSize} ring-gray-300 hover:ring-gray-900 rounded-md bg-white min-w-[16rem] w-full border-none cursor-pointer shadow-none transition-all duration-200`}
        options={options}
        closeMenuOnSelect={false}
        value={defaultVal}
        components={animatedComponents}
        placeholder={`${placeholder}`}
        onChange={handleSelectChange}
        isMulti
      />
    </div>
  );
};

export const RelationshipSingleField: FC<PropsSingle> = ({
  defaultValue,
  options = sample,
  onChange,
  size = "lg",
  className = "!px-5",
  title = "",
  titleClass = "",
  placeholder = "Select Option",
}) => {
  const [defaultVal, setDefaultVal] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const handleSelectChange = (selectedOptions: any) => {
    if (onChange) {
      onChange(selectedOptions);
    }
  };

  useEffect(() => {
    setDefaultVal(defaultValue);
  }, [defaultValue]);

  let isSize = size === "fit" ? "h-fit" : "h-16";

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      borderColor: state.isFocused ? "transparent" : provided.borderColor,
      "&:hover": {
        borderColor: state.isFocused ? "transparent" : provided.borderColor,
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "inherit",
    }),
    input: (provided) => ({
      ...provided,
      color: "inherit",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "transparent"
        : provided.backgroundColor,
      color: state.isSelected ? "inherit" : provided.color,
      "&:hover": {
        backgroundColor: "#f0f0f0", // Customize hover color if needed
      },
    }),
  };

  return (
    <div
      className={`dark:text-white dark:bg-transparent ${className} mt-5 w-full`}
    >
      <Label className={`${titleClass}`}>{title}</Label>
      <Select
        styles={customStyles}
        className={`ring-1 ${isSize} ring-gray-300 rounded-md hover:ring-gray-900 bg-white w-full border-none cursor-pointer shadow-none transition-all duration-200`}
        options={options}
        closeMenuOnSelect={true}
        value={defaultVal}
        components={animatedComponents}
        placeholder={`${placeholder}`}
        onChange={handleSelectChange}
        isMulti={false}
      />
    </div>
  );
};
