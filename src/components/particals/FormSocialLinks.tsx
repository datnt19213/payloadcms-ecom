import React, {FC, ReactNode, useEffect, useState} from "react";
import {TextField, UploadField} from "../fields";
import {Button} from "../ui/button";
import {ChevronDown, Trash} from "lucide-react";
import {RenameFile} from "../../utils";

interface Props {
  onChangeLogo?: (data: {value?: File; index: any}) => void;
  onChangeName?: (data: {value?: any; index: any}) => void;
  onChangeUrl?: (data: {value?: any; index: any}) => void;
  removeButtonElement?: ReactNode;
  logo?: string;
  name?: string;
  url?: string;
  title?: string;
  uid?: string;
  index?: number;
}

/**
 *
 * @param onChangeLogo - Funtion onchange event logo field interaction
 * @param onChangeName - Funtion onchange event name field interaction
 * @param onChangeUrl - Funtion onchange event url field interaction
 * @param onRemove - Funtion remove event an item interaction
 * @param onIndex - Refurn current index of the item interaction
 * @param logo - data to logo field
 * @param name - data to name field
 * @param url - data to url field
 * @param title - title of an item
 * @param uid - id of an item
 * @param index - index of an item
 *
 */

export const FormSocialLinks: FC<Props> = ({
  onChangeLogo,
  onChangeName,
  onChangeUrl,
  removeButtonElement,
  title = "Untitled",
  logo = "",
  name = "",
  url = "",
  uid = "",
  index = 0,
}) => {
  const [label, setLabel] = useState("");

  const [isName, setName] = useState("");
  const [isUrl, setUrl] = useState("");
  const [isLogoUrl, setLogoUrl] = useState("");
  const [isLogo, setLogo] = useState<File>(null);

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (title != label && title != "") {
      setLabel(title);
    }
  }, [title]);
  useEffect(() => {
    if (name != isName && name != "") {
      setName(name);
    }
  }, [name]);
  useEffect(() => {
    if (url != isUrl && url != "") {
      setUrl(url);
    }
  }, [url]);
  useEffect(() => {
    setLogoUrl(logo);
  }, [logo]);

  useEffect(() => {
    if (onChangeLogo && isLogo) {
      onChangeLogo({value: isLogo, index: index} as any);
    }
  }, [isLogo, onChangeLogo]);
  useEffect(() => {
    if (onChangeName && isName != name) {
      onChangeName({value: isName, index: index} as any);
    }
  }, [isName, onChangeName]);
  useEffect(() => {
    if (onChangeUrl && isUrl != url) {
      onChangeUrl({value: isUrl, index: index} as any);
    }
  }, [isUrl, onChangeUrl]);

  const GetName = (val: string) => {
    setName(val);
    setLabel(val);
  };
  const GetUrl = (val: string) => {
    setUrl(val);
  };

  const GetFile = (value: File) => {
    setLogo(value);
  };

  return (
    <div
      className={`overflow-hidden border border-gray-100 transform duration-200 transition-all ${
        show ? "h-fit" : "h-16"
      } rounded-lg transform duration-500`}
    >
      <div
        className={`flex justify-between items-center p-3 bg-gray-100 ${
          show ? "rounded-t-lg" : "rounded-lg"
        } transition-all duration-200`}
      >
        <span className="text-lg font-bold">{label}</span>
        <div className="flex items-center w-fit">
          {removeButtonElement}
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

      <div className="flex flex-col px-3 py-5 rounded-b-lg">
        <UploadField title={"Logo"} onChange={GetFile} logo={isLogoUrl} />
        <TextField
          title="Name"
          data={isName}
          onChange={GetName}
          id={`${index}-social-link-name`}
        />
        <TextField
          title="URL"
          data={isUrl}
          onChange={GetUrl}
          id={`${index}-social-link-url`}
        />
      </div>
    </div>
  );
};
