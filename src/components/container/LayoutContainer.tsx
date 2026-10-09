import {Gutter} from "payload/components/elements";
import React, {FC, ReactNode} from "react";
import {Notification} from "../particals";
import Default from "payload/dist/admin/components/templates/Default";
import {HeadingPage} from "../elements";
import {LinkBtn} from "../buttons";
import {ChevronLeft} from "lucide-react";

interface Props {
  children?: ReactNode;
  className?: string;
  maxWidth?: boolean;
  title?: string;
  toBack?: string;
  isBell?: boolean;
  besideElement?: ReactNode;
}
export const ManagementContainer: FC<Props> = ({
  children,
  className,
  maxWidth = false,
  title = "Untitled",
  toBack = "/admin",
  isBell = true,
  besideElement = <></>,
}) => {
  return (
    <>
      {isBell && <Notification />}
      <Gutter
        className={`${className} ${
          maxWidth ? "max-w-[134.75rem] mx-auto" : "w-full"
        } dark:text-white dark:bg-transparent flex flex-col gap-12 py-12`}
      >
        <div className="flex justify-between items-center">
          <HeadingPage>{title}</HeadingPage>
          {besideElement}
        </div>

        {children}
      </Gutter>
    </>
  );
};
export const CRUDContainer: FC<Props> = ({
  children,
  className,
  maxWidth = false,
  title = "Untitled",
  toBack = "/admin",
  isBell = true,
  besideElement = <></>,
}) => {
  return (
    <>
      <Default>
        {isBell && <Notification />}
        <Gutter
          className={`${className} ${
            maxWidth ? "max-w-[134.75rem] mx-auto" : "w-full"
          } dark:text-white dark:bg-transparent flex flex-col gap-12 py-12`}
        >
          <HeadingPage className="flex items-center gap-5">
            <LinkBtn
              link={toBack}
              variant="ghost"
              size="icon"
              className="flex justify-center items-center"
            >
              <ChevronLeft />
            </LinkBtn>
            {title}
          </HeadingPage>
          {children}
        </Gutter>
      </Default>
    </>
  );
};
