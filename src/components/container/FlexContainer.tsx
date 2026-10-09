import React, {FC, forwardRef, HTMLAttributes, ReactNode} from "react";
import {cn} from "../../lib/utils";

interface FlexContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  yPos?: "top" | "center" | "bottom";
  xPos?: "left" | "center" | "right";
  auto?: boolean;
}

export const FlexColContainer = forwardRef<HTMLDivElement, FlexContainerProps>(
  ({children, className, auto = false, xPos, yPos, ...props}, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={`${auto ? "" : "w-full"} flex flex-col ${
          xPos === "left"
            ? "items-start"
            : xPos === "center"
            ? "items-center"
            : "items-end"
        } ${
          yPos === "top"
            ? "justify-start"
            : yPos === "center"
            ? "justify-center"
            : "justify-end"
        } ${className}`}
      >
        {children}
      </div>
    );
  }
);
export const FlexRowContainer = forwardRef<HTMLDivElement, FlexContainerProps>(
  ({children, className, auto = false, xPos, yPos, ...props}, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={`${auto ? "" : "w-full"} flex flex-row ${
          xPos === "left"
            ? "justify-start"
            : xPos === "center"
            ? "justify-center"
            : "justify-end"
        } ${
          yPos === "top"
            ? "items-start"
            : yPos === "center"
            ? "items-center"
            : "items-end"
        } ${className}`}
      >
        {children}
      </div>
    );
  }
);
