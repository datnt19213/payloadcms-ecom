import React, {FC, ReactNode} from "react";
import {TableCell, TableRow} from "../ui/table";
import {SpaceIcon} from "lucide-react";

export const NoDataAvailable = () => {
  return (
    <div className="dark:text-white dark:bg-transparent w-full gap-2 text-center font-medium text-base flex flex-col justify-center items-center min-h-10">
      <SpaceIcon strokeWidth={1.5} />
      <span className="dark:text-white dark:bg-transparent ">
        No data available
      </span>
    </div>
  );
};
export const NoDataAvailableTable = () => {
  return (
    <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-1 md:text-lg px-2 font-medium text-gray-300 min-h-10">
      <TableCell className="dark:text-white dark:bg-transparent col-span-1 gap-2 flex flex-col justify-center items-center font-medium text-center text-base">
        <SpaceIcon strokeWidth={1.5} />
        <span>No data available</span>
      </TableCell>
    </TableRow>
  );
};

interface EmptyElement {
  childrenBefore?: ReactNode;
  childrenAfter?: ReactNode;
  textClassName?: string;
  containerClassName?: string;
  isIcon?: boolean;
  iconElement?: ReactNode;
  text?: string;
}

export const EmptyElement: FC<EmptyElement> = ({
  childrenAfter,
  childrenBefore,
  textClassName,
  containerClassName = "flex flex-col justify-center items-center",
  iconElement = <SpaceIcon strokeWidth={1.5} />,
  isIcon = true,
  text = "No data available",
}) => {
  return (
    <div
      className={`dark:text-white dark:bg-transparent gap-2 text-center font-medium text-base w-full min-h-10 ${containerClassName}`}
    >
      {childrenBefore}
      {isIcon && iconElement}
      <span className={`dark:text-white dark:bg-transparent ${textClassName}`}>
        {text}
      </span>
      {childrenAfter}
    </div>
  );
};
