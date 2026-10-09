import React from "react";

export const TotalPageOfPaginations = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};
