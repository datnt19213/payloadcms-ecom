import React, {FC, ReactNode} from "react";
import {TableCell, TableRow} from "../ui/table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {GridCol2} from "../container";

interface SkeletonDynamics {
  className?: string;
  itemClassName?: string;
  rowClassName?: string;
  children?: ReactNode;
  layout:
    | "row"
    | "column"
    | "post"
    | "table-post"
    | "table-row"
    | "table-column";
  count?: number;
  columnCount?: number;
  headerClassName?: string;
  bodyClassName?: string;
  postTopCount?: number;
  postBottomCount?: number;
  gridForm?: number[];
  circle?: boolean;
  mode?: "normal" | "table";
}

export const SkeletonComp = () => {
  return (
    <Skeleton
      count={3}
      className="dark:text-white dark:bg-transparent w-full h-full"
      baseColor="#cdcdcd"
    />
  );
};
export const SkeletonTable = () => {
  return (
    <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-1 md:text-lg px-2 font-medium text-gray-300 min-h-10 p-5">
      <TableCell className="dark:text-white dark:bg-transparent col-span-1">
        <Skeleton
          count={3}
          className="dark:text-white dark:bg-transparent w-full"
          baseColor="#cdcdcd"
        />
      </TableCell>
    </TableRow>
  );
};

export const SkeletonDynamics: FC<SkeletonDynamics> = ({
  children,
  className = "w-full",
  columnCount = 1,
  gridForm,
  count = 1,
  itemClassName = "w-full",
  layout = "row",
  bodyClassName = "w-full",
  headerClassName = "w-full",
  postBottomCount = 1,
  postTopCount = 1,
  rowClassName = "",
  circle = false,
  mode = "normal",
}) => {
  let colCount =
    columnCount === 1
      ? "grid-cols-1"
      : columnCount === 2
        ? "grid-cols-2"
        : columnCount === 3
          ? "grid-cols-3"
          : columnCount === 4
            ? "grid-cols-4"
            : columnCount === 5
              ? "grid-cols-5"
              : columnCount === 6
                ? "grid-cols-6"
                : columnCount === 7
                  ? "grid-cols-7"
                  : columnCount === 8
                    ? "grid-cols-8"
                    : columnCount === 9
                      ? "grid-cols-9"
                      : columnCount === 10
                        ? "grid-cols-10"
                        : columnCount === 11
                          ? "grid-cols-11"
                          : columnCount === 12
                            ? "grid-cols-12"
                            : "grid-cols-1";

  const colForm = (number: number) => {
    return gridForm && gridForm.length > 0 && gridForm[number] == 1
      ? "col-span-1"
      : gridForm && gridForm.length > 0 && gridForm[number] == 2
        ? "col-span-2"
        : gridForm && gridForm.length > 0 && gridForm[number] == 3
          ? "col-span-3"
          : gridForm && gridForm.length > 0 && gridForm[number] == 4
            ? "col-span-4"
            : gridForm && gridForm.length > 0 && gridForm[number] == 5
              ? "col-span-5"
              : gridForm && gridForm.length > 0 && gridForm[number] == 6
                ? "col-span-6"
                : gridForm && gridForm.length > 0 && gridForm[number] == 7
                  ? "col-span-7"
                  : gridForm && gridForm.length > 0 && gridForm[number] == 8
                    ? "col-span-8"
                    : gridForm && gridForm.length > 0 && gridForm[number] == 9
                      ? "col-span-9"
                      : gridForm &&
                          gridForm.length > 0 &&
                          gridForm[number] == 10
                        ? "col-span-10"
                        : gridForm &&
                            gridForm.length > 0 &&
                            gridForm[number] == 11
                          ? "col-span-11"
                          : gridForm &&
                              gridForm.length > 0 &&
                              gridForm[number] == 12
                            ? "col-span-12"
                            : "";
  };
  return (
    <>
      {layout === "post" && (
        <div className={` flex flex-col gap-2 ${className}`}>
          {children}
          {[...Array(postTopCount)].map((_, index) => (
            <Skeleton
              containerClassName="w-full"
              circle={circle}
              key={index}
              className={`h-[7.75rem] min-w-9 ${headerClassName}`}
            />
          ))}
          {[...Array(postBottomCount)].map((_, index) => (
            <Skeleton
              containerClassName="w-full"
              circle={circle}
              key={index}
              className={`h-[2.875rem] min-w-9 ${bodyClassName}`}
            />
          ))}
        </div>
      )}

      {layout === "row" && (
        <div className={`flex gap-2 ${className}`}>
          {children}
          {[...Array(count)].map((_, i) => (
            <Skeleton
              containerClassName="w-full"
              circle={circle}
              key={i}
              className={`h-[2.875rem] min-w-9 ${itemClassName}`}
            />
          ))}
        </div>
      )}

      {layout === "column" && (
        <div className={`flex gap-2 h-full ${className}`}>
          {children}
          {[...Array(count)].map((_, i) => (
            <Skeleton
              containerClassName="w-full"
              circle={circle}
              key={i}
              className={`w-[2.875rem] h-full ${itemClassName}`}
            />
          ))}
        </div>
      )}

      {layout === "table-row" && (
        <div className={`skeleton-cs-view grid gap-2 ${colCount} ${className}`}>
          {children}
          {[...Array(columnCount)].map((_, i) => (
            <div
              key={i}
              className={`flex flex-col gap-2 ${colForm(i)} ${rowClassName}`}
            >
              {[...Array(count)].map((_, index) => (
                <Skeleton
                  containerClassName="w-full"
                  circle={circle}
                  key={index}
                  className={`h-[2.875rem] min-w-9 ${itemClassName}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      {layout === "table-column" && (
        <div className={` grid gap-2 ${colCount} ${className}`}>
          {children}
          {[...Array(columnCount)].map((_, i) => (
            <div
              key={i}
              className={`flex flex-col gap-2 col-span-1 ${rowClassName}`}
            >
              {[...Array(count)].map((_, index) => (
                <Skeleton
                  containerClassName="w-full"
                  circle={circle}
                  key={index}
                  className={`w-[2.875rem] h-full ${itemClassName}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {layout === "table-post" && (
        <div className={` grid gap-2 ${colCount} ${className}`}>
          {children}
          {[...Array(columnCount)].map((_, i) => (
            <div className={`flex flex-col gap-2 col-span-1 ${rowClassName}`}>
              {[...Array(postTopCount)].map((_, index) => (
                <Skeleton
                  containerClassName="w-full"
                  circle={circle}
                  key={index}
                  className={`h-[7.75rem] min-w-9 ${headerClassName}`}
                />
              ))}
              {[...Array(postBottomCount)].map((_, index) => (
                <Skeleton
                  containerClassName="w-full"
                  circle={circle}
                  key={index}
                  className={`h-[2.875rem] min-w-9 ${bodyClassName}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
