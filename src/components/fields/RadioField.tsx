import {Gutter} from "payload/components/elements";
import React, {FC, ReactNode, useEffect, useState} from "react";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {Label} from "../ui/label";

interface Props {
  className?: string;
  itemClass?: string;
  title?: string;
  options: Options[];
  onChange?: (value: string) => void;
  defaultValue?: string; // Add defaultValue prop
}

interface Options {
  label: string;
  value: string;
}

const sample = [
  {
    label: "Apple",
    value: "apple",
  },
  {
    label: "Orange",
    value: "orange",
  },
  {
    label: "Kiwi",
    value: "kiwi",
  },
];

export const RadioLabelField: FC<Props> = ({
  title,
  className,
  options = sample,
  onChange,
  defaultValue = "",
  itemClass,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5">
      <Label className="dark:text-white dark:bg-transparent text-base mb-5">
        {title}
      </Label>
      <RadioGroup value={selectedValue} onValueChange={handleChange}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 ${className} ring-1 ring-gray-300 rounded-lg`}
          >
            <Label
              htmlFor={`r${index}d${option.value}`}
              className="cursor-pointer flex gap-5"
            >
              <RadioGroupItem
                value={option.value}
                id={`r${index}d${option.value}`}
                className={`${itemClass}`}
              />
              <div className="flex justify-start items-start">
                <span>{option.label}</span>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </Gutter>
  );
};

export const RadioField: FC<Props> = ({
  title,
  className,
  options = sample,
  onChange,
  defaultValue = "",
  itemClass,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5">
      <Label className="dark:text-white dark:bg-transparent text-base mb-5">
        {title}
      </Label>
      <RadioGroup value={selectedValue} onValueChange={handleChange}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 ${className}`}
          >
            <RadioGroupItem
              value={option.value}
              id={`r${index}`}
              className={`${itemClass}`}
            />
            <Label htmlFor={`r${index}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </Gutter>
  );
};
