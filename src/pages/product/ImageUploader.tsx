import React from "react";

const ImageUploader = ({ index, image, onImageChange }) => {
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target.result && typeof event.target.result === 'string') {
          onImageChange(index, event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-between space-x-4 mb-4 ">
      <img
        alt="product-logo"
        width="64px"
        height="64px"
        src={image || "https://placehold.co/64x64"}
        className="rounded-full cursor-pointer"
        onClick={() =>
          document.getElementById(`file-input-${index}`).click()
        }
      />
      <input
        type="file"
        id={`file-input-${index}`}
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUploader;
