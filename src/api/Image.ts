import axios from "axios";
import {RenameFile} from "../utils";
import {toast} from "react-toastify";

export const FormImages = async (logo, oldName: string, newName: string) => {
  let arr = null;
  try {
    const formData = new FormData();
    formData.append("file", RenameFile(logo, oldName, newName));
    await axios
      .post("/api/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data) {
          arr = response.data.doc;
        }
      });
    return arr;
  } catch (error) {
    toast.error("Image created failed");
    throw new Error(error);
  }
};
