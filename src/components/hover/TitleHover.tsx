import React, {FC, HTMLAttributes, ReactNode} from "react";
import {cn} from "../../lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  title: string;
  children?: ReactNode;
};

export const TitleHover: FC<Props> = ({
  className,
  title = "Title",
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "w-fit h-fit rounded-md absolute top-full bg-white hidden animate-slowfade left-0 group-hover:flex flex-col justify-start items-start gap-1 ring-1 ring-gray-300 shadow-md p-3 z-50",
        className
      )}
    >
      <span className="dark:text-white dark:bg-transparent font-semibold text-base">
        {title}
      </span>
      <div className="dark:text-white dark:bg-transparent text-sm flex flex-col justify-start items-start bg-gray-50">
        {children}
      </div>
    </div>
  );
};
