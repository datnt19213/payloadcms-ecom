import React, {FC, HTMLAttributes, ReactNode} from "react";
import {cn} from "../../lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const GridCol1: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-cols-1", className)}>
      {children}
    </div>
  );
};
export const GridCol2: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-2", className)}
    >
      {children}
    </div>
  );
};
export const GridCol3: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-3", className)}
    >
      {children}
    </div>
  );
};
export const GridCol4: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-4", className)}
    >
      {children}
    </div>
  );
};
export const GridCol5: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-5", className)}
    >
      {children}
    </div>
  );
};
export const GridCol6: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-6", className)}
    >
      {children}
    </div>
  );
};
export const GridCol7: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-7", className)}
    >
      {children}
    </div>
  );
};
export const GridCol8: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-8", className)}
    >
      {children}
    </div>
  );
};
export const GridCol9: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-9", className)}
    >
      {children}
    </div>
  );
};
export const GridCol10: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-10", className)}
    >
      {children}
    </div>
  );
};
export const GridCol11: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-11", className)}
    >
      {children}
    </div>
  );
};
export const GridCol12: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 lg:grid-cols-12", className)}
    >
      {children}
    </div>
  );
};
export const GridColAutoCol: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid auto-rows-auto", className)}>
      {children}
    </div>
  );
};
export const GridColAutoRow: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-flow-col auto-cols-auto", className)}
    >
      {children}
    </div>
  );
};
export const GridCol1o3: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-1/3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
};
export const GridCol1o2: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-1/2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 ",
        className
      )}
    >
      {children}
    </div>
  );
};
export const GridCol2o3: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-2/3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
};
export const GridColMulti: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-full grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
};

// rows

export const GridRow1: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-1", className)}>
      {children}
    </div>
  );
};
export const GridRow2: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-2", className)}>
      {children}
    </div>
  );
};
export const GridRow3: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-3", className)}>
      {children}
    </div>
  );
};
export const GridRow4: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-4", className)}>
      {children}
    </div>
  );
};
export const GridRow5: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-5", className)}>
      {children}
    </div>
  );
};
export const GridRow6: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-6", className)}>
      {children}
    </div>
  );
};
export const GridRow7: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-7", className)}>
      {children}
    </div>
  );
};
export const GridRow8: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-8", className)}>
      {children}
    </div>
  );
};
export const GridRow9: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-9", className)}>
      {children}
    </div>
  );
};
export const GridRow10: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-10", className)}>
      {children}
    </div>
  );
};
export const GridRow11: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-11", className)}>
      {children}
    </div>
  );
};
export const GridRow12: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid grid-rows-12", className)}>
      {children}
    </div>
  );
};
export const GridRowAutoRow: FC<Props> = ({children, className, ...props}) => {
  return (
    <div {...props} className={cn("grid auto-cols-auto", className)}>
      {children}
    </div>
  );
};
export const GridRowAutoCol: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn("grid grid-flow-row auto-rows-auto", className)}
    >
      {children}
    </div>
  );
};
export const GridRow1o3: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-1/3 grid grid-rows-1 gap-5 sm:grid-rows-2 lg:grid-rows-3 xl:grid-rows-5 2xl:grid-rows-6",
        className
      )}
    >
      {children}
    </div>
  );
};
export const GridRow1o2: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-1/2 grid grid-rows-1 gap-5 sm:grid-rows-2 lg:grid-rows-3 xl:grid-rows-5 2xl:grid-rows-6 ",
        className
      )}
    >
      {children}
    </div>
  );
};
export const GridRow2o3: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-2/3 grid grid-rows-1 gap-5 sm:grid-rows-2 lg:grid-rows-3 xl:grid-rows-5 2xl:grid-rows-6",
        className
      )}
    >
      {children}
    </div>
  );
};
export const GridRowMulti: FC<Props> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-full grid grid-rows-1 gap-5 sm:grid-rows-2 lg:grid-rows-3 xl:grid-rows-5 2xl:grid-rows-6",
        className
      )}
    >
      {children}
    </div>
  );
};
