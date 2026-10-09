import React, {FC, useEffect, useState} from "react";
import {TextField} from "../fields";
import {Button} from "../ui/button";
import {ChevronDown, Trash} from "lucide-react";

interface Props {
  onChangeUrlName?: (value?: any) => void;
  onChangeUrl?: (value?: any) => void;
  onRemove?: (value?: any) => void;
  urlName?: string;
  url?: string;
  title?: string;
  uid?: string;
}

export const FormExternalLinks: FC<Props> = ({
  onChangeUrlName,
  onChangeUrl,
  onRemove,
  title = "Untitled",
  urlName = "",
  url = "",
  uid = "",
}) => {
  const [isUrlName, setUrlName] = useState("");
  const [isUrl, setUrl] = useState("");

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (onChangeUrlName) {
      onChangeUrlName(isUrlName);
    }
  }, [isUrlName]);
  useEffect(() => {
    if (onChangeUrl) {
      onChangeUrl(isUrl);
    }
  }, [isUrl]);

  const GetUrlName = (val: string) => {
    setUrlName(val);
  };
  const GetUrl = (val: string) => {
    setUrl(val);
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
            title="URL Name"
            data={urlName != "" ? urlName : isUrlName}
            onChange={GetUrlName}
          />
          <TextField
            title="URL"
            data={url != "" ? url : isUrl}
            onChange={GetUrl}
          />
        </div>
      )}
    </div>
  );
};
