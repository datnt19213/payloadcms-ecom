import React, {FC, useEffect, useState} from "react";

// import ReactImagePickerEditor, {
//   ImagePickerConf,
// } from "react-image-picker-editor";
import{
  ImagePickerConf,
} from "react-image-picker-editor";

import "react-image-picker-editor/dist/index.css";
import {SkeletonComp} from "../skeleton";

interface Props {
  src?: string;
  onChange?: (val: any | any[]) => void;
}

const config: ImagePickerConf = {
  aspectRatio: 1,
  height: "100%",
  width: "100%",
  hideDownloadBtn: true,
  borderRadius: "0.5rem",
  objectFit: "contain",
  language: "en",
};

const ImageEditor: FC<Props> = ({src = "", onChange}) => {
  const [ReactImagePickerEditor, setReactImagePickerEditor] = useState(null);

  useEffect(() => {
    import("react-image-picker-editor").then((module) => {
      setReactImagePickerEditor(() => module.default);
    });
  }, []);

  const [result, setResult] = useState("");

  useEffect(() => {
    if (onChange) {
      onChange(result);
    }
  }, [result]);

  return (
    <div className="w-screen h-screen fixed z-[700]">
      {/* <div className="bg-black bg-opacity-30 w-screen h-screen z-[701]" />
      <div className="w-[50vw] min-w-[44rem] max-w-[1000px] p-10">
        {ReactImagePickerEditor ? (
          <ReactImagePickerEditor
            config={config}
            imageSrcProp={src}
            imageChanged={(newDataUri: any) => {
              setResult(newDataUri);
            }}
          />
        ) : (
          <SkeletonComp />
        )}
      </div> */}
    </div>
  );
};

export default ImageEditor;
