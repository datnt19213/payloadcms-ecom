import React, {FC, ReactNode} from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "..//ui/sheet";
import {Button} from "../ui/button";
import {X} from "lucide-react";

interface DrawerSheet {
  children?: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  besideElement?: ReactNode;
  buttonOpenElement?: ReactNode;
  buttonSaveElement?: ReactNode;
  buttonCloseElement?: ReactNode;
  isCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  containerClassName?: string;
}

export const DrawerSheet: FC<DrawerSheet> = ({
  buttonOpenElement,
  buttonSaveElement,
  besideElement,
  children,
  className,
  description = "",
  size = "md",
  title = "",
  buttonCloseElement,
  isCloseButton = false,
  containerClassName,
}) => {
  let isSize =
    size === "sm"
      ? "22.5rem"
      : size === "md"
        ? "48rem"
        : size === "lg"
          ? "64rem"
          : size === "xl"
            ? "90%"
            : "22.5rem";
  return (
    <Sheet>
      <SheetTrigger asChild>{buttonOpenElement}</SheetTrigger>
      <SheetContent
        style={{width: "100%", maxWidth: isSize, minWidth: "25rem"}}
        className={`${containerClassName}`}
      >
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            {besideElement}
          </div>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className={`${className}`}>{children}</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="button"
              size="icon"
              className="border-none bg-white ring-0 hover:bg-gray-50 absolute top-1.5 right-1.5 z-[55]"
            >
              <X strokeWidth={1.3} size={20} className="text-gray-900" />
            </Button>
          </SheetClose>
          {buttonSaveElement}
          {isCloseButton && (
            <SheetClose asChild>{buttonCloseElement}</SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
