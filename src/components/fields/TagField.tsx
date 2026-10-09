import React, {FC, useCallback, useEffect, useState} from "react";
import {TextField} from "./TextField";
import {Plus, X} from "lucide-react";
import {Button} from "../ui/button";
import {
  CreateLocalStorage,
  GetLocalStorage,
  RemoveOneLocalStorage,
} from "../../utils";
import {APIGet} from "../../api";
import {useAuth} from "payload/components/utilities";
import {Loading} from "../loading";

interface Props {
  title: string;
  defaultData?: string[];
  onChange?: (val: any) => void;
  className?: string;
  itemClassName?: string;
  disabled?: boolean;
  size?: "sm" | "base" | "lg" | "xl";
}

interface User {
  id: number;
  email: string;
  token: string;
}

interface ProductTag {
  id: string;
  created_at: string;
  updated_at: string;
  value: string;
}

export const TagField: FC<Props> = ({
  title,
  className,
  defaultData = [],
  disabled = false,
  onChange,
  size = "xl",
  itemClassName,
}) => {
  const {user} = useAuth<User>();
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [baseList, setBaseList] = useState<ProductTag[]>([]);
  const [list, setList] = useState<ProductTag[]>([]);

  const TagValue = (val?: string) => {
    if (val !== value) {
      setValue(val || "");
    }
  };

  const SaveToLocal = (tags: string[]) => {
    CreateLocalStorage("tgs-ls", JSON.stringify(tags));
  };

  useEffect(() => {
    if (defaultData.length > 0) {
      setOutput(defaultData);
    }
    const local = GetLocalStorage("tgs-ls");
    if (local) {
      setOutput(JSON.parse(local));
    }
  }, [defaultData]);

  // #region fetch to get all tags from db
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await APIGet("/admin/product-tags", user.token);
        if (response.success) {
          setBaseList(response.data.product_tags);
          setList(response.data.product_tags);
        }
      } catch (error) {
        throw new Error(error);
      }
    };

    fetchData();
  }, [user.token]);

  useEffect(() => {
    if (onChange) {
      onChange(output);
    }
  }, [output, onChange]);
  // #endregion

  // #region check exist on list & local
  // const CheckExist = () => {
  //   if (defaultData.length > 0) {
  //     setOutput(defaultData);
  //   }
  //   const local = GetLocalStorage("tgs-ls");
  //   if (local) {
  //     setOutput(JSON.parse(local));
  //   }
  // };

  const CheckExist = () => {
    if (defaultData.length > 0) {
      setOutput(defaultData);
    }
    const local = GetLocalStorage("tgs-ls");
    if (local) {
      setOutput(JSON.parse(local));
    }
  };

  const CheckExistOnOutput = (val: string) => {
    return !output.includes(val);
  };
  // #endregion

  // const TagAdd = (val?: string) => {
  //   if (val && val !== "") {
  //     if (CheckExistOnOutput(val)) {
  //       setOutput((prev) => {
  //         const newOutput = [...prev, val];
  //         SaveToLocal(newOutput);
  //         return newOutput;
  //       });
  //     }
  //     setValue("");
  //     setShow(false);
  //   }
  // };

  const TagAdd = useCallback(
    (val?: string) => {
      if (val && val !== "" && CheckExistOnOutput(val)) {
        setOutput((prev) => {
          const newOutput = [...prev, val];
          SaveToLocal(newOutput);
          return newOutput;
        });
        setShow(false);
      }
    },
    [CheckExistOnOutput, SaveToLocal]
  );

  // const TagRemove = (val?: string) => {
  //   if (val && val !== "") {
  //     setOutput((prev) => {
  //       const newOutput = prev.filter((tag) => tag !== val);
  //       SaveToLocal(newOutput);
  //       return newOutput;
  //     });
  //   }
  // };

  const TagRemove = useCallback(
    (val?: string) => {
      if (val && val !== "") {
        setOutput((prev) => {
          const newOutput = prev.filter((tag) => tag !== val);
          SaveToLocal(newOutput);
          return newOutput;
        });
      }
    },
    [SaveToLocal]
  );

  // #region Searching filtering
  const FilterProductTagsByKeySearch = (
    data: ProductTag[],
    keySearch: string
  ): ProductTag[] => {
    const regexPattern =
      keySearch
        .split("")
        .map((char) => `.*${char}`)
        .join("") + ".*";
    const regex = new RegExp(regexPattern, "i");

    return data.filter((tag) => regex.test(tag.value));
  };

  useEffect(() => {
    if (value != "" && value.length > 0) {
      setList(FilterProductTagsByKeySearch(baseList, value));
      setShow(true);
    } else {
      setList(baseList);
    }
  }, [value]);

  // #endregion

  // #region Clear all tags
  const CheckTagOnLocal = (val: string): boolean => {
    const local = JSON.parse(GetLocalStorage("tgs-ls"));

    if (local) {
      const isSame = local.some((item) => item == val);
      return isSame;
    }
  };

  const ClearAll = () => {
    RemoveOneLocalStorage("tgs-ls");
    setOutput([]);
  };
  // #endregion

  return (
    <div className={`flex flex-col gap-5 w-full ${className}`}>
      <div className="flex items-center gap-5 relative w-full">
        <TextField
          title={title}
          className={`w-full`}
          disabled={disabled}
          onChange={TagValue}
          onEnterPress={() => TagAdd(value)}
          // onBlur={() => setShow(false)}
          onFocus={() => setShow(false)}
          size={size}
        />
        <div
          className={`${
            show ? "flex visible" : "hidden invisible"
          } flex-col absolute top-full mt-3 z-20 bg-white shadow-md rounded-md w-full`}
        >
          <div className={`p-3 flex flex-col gap-3 relative`}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => TagAdd(value)}
              className="flex gap-3 w-full mt-5 bg-gray-50"
            >
              <Plus size={10} />
              <span>Add Tag</span>
            </Button>
            <div className="flex flex-wrap justify-start items-start gap-1.5 relative">
              {list.length > 0 ? (
                list.map((tag, i) => (
                  <div key={i}>
                    {!CheckTagOnLocal(tag.value) && (
                      <div
                        key={i}
                        onClick={() => TagAdd(tag.value)}
                        className={`${itemClassName} px-3 flex gap-2 cursor-pointer items-center py-1 rounded-md bg-gray-50 text-gray-900`}
                      >
                        <span>{tag.value}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <Loading />
              )}
            </div>
            <X
              size={16}
              className="text-red-600 top-1.5 right-1.5 absolute cursor-pointer"
              onClick={() => setShow(false)}
            />
          </div>
        </div>
      </div>
      {output.length > 0 && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => ClearAll()}
          className="flex gap-3 w-full mt-3 bg-red-50"
        >
          <span className="text-red-500 font-semibold">Clear</span>
        </Button>
      )}
      <div className="flex items-center justify-start flex-wrap w-full gap-3">
        {output.length > 0 &&
          output.map((tag, index) => (
            <div
              key={index}
              className={`${itemClassName} px-3 gap-2 flex items-center py-1 rounded-md bg-gray-100 text-gray-900`}
            >
              <span>{tag}</span>
              <X
                size={12}
                onClick={() => TagRemove(tag)}
                className="hover:text-orange-600 cursor-pointer"
              />
            </div>
          ))}
      </div>
    </div>
  );
};
