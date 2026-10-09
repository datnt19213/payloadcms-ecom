import {CustomSaveButtonProps} from "payload/types";
import React from "react";
import {Button} from "../ui/button";

const SaveButton: CustomSaveButtonProps = ({DefaultButton, label, save}) => {
  return <DefaultButton save={save} label="Save" />;
};

export default SaveButton;
