import React, {ChangeEvent, FC, ReactNode, useEffect, useState} from "react";
import {TextField, UploadField} from "../fields";
import {Button} from "../ui/button";
import {ChevronDown, Trash} from "lucide-react";
import {RenameFile} from "../../utils";
import {GridCol2} from "../container";
import {Input} from "../ui/input";

interface Props {
  onChangeLogo?: (data: {value?: File; index: any}) => void;
  onChangeName?: (data: {value?: any; index: any}) => void;
  onChangeSubName?: (data: {value?: any; index: any}) => void;
  onChangeColor?: (data: {value?: any; index: any}) => void;
  onChangeUrl?: (data: {value?: any; index: any}) => void;
  onImageId?: (data: {value?: any; index: any}) => void;
  logo?: string;
  name?: string;
  subName?: string;
  color?: string;
  url?: string;
  title?: string;
  uid?: string;
  index?: number;
  removeButtonElement?: ReactNode;
}

/**
 *
 * @param onChangeLogo - Funtion onchange event logo field interaction
 * @param onChangeName - Funtion onchange event name field interaction
 * @param onChangeSubName - Funtion onchange event sub title field interaction
 * @param onChangeUrl - Funtion onchange event url field interaction
 * @param onRemove - Funtion remove event an item interaction
 * @param onIndex - Refurn current index of the item interaction
 * @param logo - data to logo field
 * @param name - data to name field
 * @param subName - data to sub title field
 * @param color - data to text color field
 * @param url - data to url field
 * @param title - title of an item
 * @param uid - id of an item
 * @param index - index of an item
 *
 */

export const FormSlider: FC<Props> = ({
  onChangeLogo,
  onChangeName,
  onChangeSubName,
  onChangeColor,
  onChangeUrl,
  onImageId,
  title = "Untitled",
  logo = "",
  name = "",
  subName = "",
  color = "#000000",
  url = "",
  uid = "",
  index = 0,
  removeButtonElement,
}) => {
  const [label, setLabel] = useState("");

  const [isName, setName] = useState("");
  const [isSubName, setSubName] = useState("");
  const [isColor, setColor] = useState("");
  const [isUrl, setUrl] = useState("");
  const [isLogoUrl, setLogoUrl] = useState("");
  const [isLogo, setLogo] = useState<File>(null);
  const [imgId, setImgId] = useState(null);

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
    if (subName != isSubName && subName != "") {
      setSubName(name);
    }
  }, [subName]);
  useEffect(() => {
    if (color != isColor && color != "") {
      setColor(color);
    }
  }, [color]);
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
    if (onChangeSubName && isSubName != subName) {
      onChangeSubName({value: isSubName, index: index} as any);
    }
  }, [isSubName, onChangeSubName]);
  useEffect(() => {
    if (onChangeColor && isColor != color) {
      onChangeColor({value: isColor, index: index} as any);
    }
  }, [isColor, onChangeColor]);
  useEffect(() => {
    if (onChangeUrl && isUrl != url) {
      onChangeUrl({value: isUrl, index: index} as any);
    }
  }, [isUrl, onChangeUrl]);
  useEffect(() => {
    if (onImageId && imgId) {
      onImageId({value: imgId, index: index} as any);
    }
  }, [imgId, onImageId]);

  const GetName = (val: string) => {
    setName(val);
    setLabel(val);
  };
  const GetSubName = (val: string) => {
    setSubName(val);
  };
  const GetColor = (val: any) => {
    setColor(val.target.value);
  };
  const GetUrl = (val: string) => {
    setUrl(val);
  };

  const GetFile = (value: File) => {
    setLogo(value);
  };
  const GetImgId = (value: any) => {
    setImgId(value);
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
        <UploadField
          title={"Image"}
          onChange={GetFile}
          logo={isLogoUrl}
          onImageId={GetImgId}
        />
        <TextField
          title="Title"
          data={isName}
          onChange={GetName}
          id={`${index}-slider-name`}
        />
        <TextField
          title="Sub Title"
          data={isSubName}
          onChange={GetSubName}
          id={`${index}-slider-subtitle`}
        />
        <GridCol2 className="h-16 border border-gray-300 rounded-lg mt-5 px-3">
          <div className="flex justify-start items-center gap-5 col-span-1">
            <Input
              id={`${index}-slider-color`}
              type="color"
              title="Text Color"
              className="focus:ring-0 focus:outline-none w-20 h-14 !p-0 border-none"
              value={isColor || "#000000"}
              onInput={GetColor}
            />
            <div className="h-full flex flex-col justify-between">
              <span className="text-gray-900 mt-2">Text Color</span>
              <span className="text-gray-500">{isColor}</span>
            </div>
          </div>
        </GridCol2>
        <TextField
          title="Url"
          data={isUrl}
          onChange={GetUrl}
          id={`${index}-slider-url`}
        />
      </div>
    </div>
  );
};
