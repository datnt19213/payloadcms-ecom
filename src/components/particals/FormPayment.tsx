import React, {FC, useEffect, useState} from "react";
import {TextField} from "../fields";
import {Button} from "../ui/button";
import {ChevronDown, Trash} from "lucide-react";

interface Props {
  onChangeName?: (value?: any) => void;
  onChangeUrl?: (value?: any) => void;
  onChangeScrKey?: (value?: any) => void;
  onRemove?: (value?: any) => void;
  name?: string;
  url?: string;
  title?: string;
  scrKey?: string;
  uid?: string;
}

export const FormPayment: FC<Props> = ({
  onChangeName,
  onChangeUrl,
  onRemove,
  onChangeScrKey,
  title = "Untitled",
  name = "",
  url = "",
  scrKey = "",
  uid = "",
}) => {
  const [isName, setName] = useState("");
  const [isUrl, setUrl] = useState("");
  const [isScrKey, setScrKey] = useState("");

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (onChangeName) {
      onChangeName(isName);
    }
  }, [isName]);
  useEffect(() => {
    if (onChangeUrl) {
      onChangeUrl(isUrl);
    }
  }, [isUrl]);
  useEffect(() => {
    if (onChangeScrKey) {
      onChangeScrKey(isScrKey);
    }
  }, [isScrKey]);

  const GetName = (val: string) => {
    setName(val);
  };
  const GetUrl = (val: string) => {
    setUrl(val);
  };
  const GetScrKey = (val: string) => {
    setScrKey(val);
  };

  return (
    <div
      className={`overflow-hidden border border-gray-100 transform duration-200 transition-all h-fit rounded-lg`}
    >
      <div
        className={`flex justify-between items-center h-16 p-3 bg-gray-100 ${
          show ? "rounded-t-lg" : "rounded-lg"
        } transition-all duration-200 `}
      >
        <span className="text-lg font-bold">{title}</span>
        <div className="flex items-center w-fit">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove && onRemove(uid)}
          >
            <Trash strokeWidth={1.5} size={16} className="text-red-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShow((prev) => !prev)}
          >
            <ChevronDown
              strokeWidth={1.5}
              className={`${
                show ? "rotate-0" : "rotate-180"
              } duration-200 transform`}
            />
          </Button>
        </div>
      </div>
      {show && (
        <div className="flex flex-col px-3 pb-5 rounded-b-lg">
          <TextField
            title="Payment provider"
            data={name != "" ? name : isName}
            onChange={GetName}
          />
          <TextField
            title="API key"
            data={url != "" ? url : isUrl}
            onChange={GetUrl}
          />
          <TextField
            title="Secret key"
            data={scrKey != "" ? scrKey : isScrKey}
            onChange={GetScrKey}
          />
        </div>
      )}
    </div>
  );
};
