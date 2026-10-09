import React, { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop }) => {
  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const accept: Accept = {
    "image/*": [],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 p-10 mx-5 my-5 rounded-md text-center cursor-pointer ${
        isDragActive ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Drop the files here ...</p>
      ) : (
        <p className="text-gray-500">
          Drag 'n' drop some files here, or click to select files
        </p>
      )}
    </div>
  );
};

export default Dropzone;
