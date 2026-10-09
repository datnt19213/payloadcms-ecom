import {Enum} from "../../common/data";

/**
 *Copy and re-new the name of the file
 *
 * @param file - The file object data
 * @param oldFileName - The old file name of the file object
 * @param newFileName - The new file name of the file object
 *
 * @returns - Return new file with the new name
 *
 */

export const RenameFile = (
  file: File,
  oldFileName: string,
  newFileName: string
): File => {
  const newName = GenerateCustomFileName(oldFileName, newFileName);
  return new File([file], newName, {type: file.type});
};

const GenerateCustomFileName = (
  originalName: string,
  newName: string
): string => {
  const timestamp = Date.now();
  
  const extension = originalName?.includes(".")
    ? originalName.split(".").pop()
    : "";
  console.log(
    originalName + "    --------   ",
    newName + " -------- " + extension
  );

  return `${
    Enum.secretRandomKey.toString() + newName
  }-${timestamp}${extension ? `.${extension}` : ""}`;
};

