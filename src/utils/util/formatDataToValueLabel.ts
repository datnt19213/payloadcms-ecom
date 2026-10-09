import React from "react";
import {ValueLabel} from "../../types";

export const ToValueLabel = (
  data: any[],
  nameField: string,
  idField: string
): ValueLabel[] => {
  return data.map((item) => ({
    label: item[nameField],
    value: item[idField],
  }));
};
