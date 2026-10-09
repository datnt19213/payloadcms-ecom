import React, {FC, HTMLAttributes, ReactNode, useState} from "react";
import {cn} from "../../lib/utils";
import {CircleCheckBig, Clipboard, Dot, Plus} from "lucide-react";
import {Link, LinkBtn} from "../buttons";
import {Button} from "../ui/button";

interface LinkListProps extends HTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
  className?: string;
  link?: string;
}
interface SpanProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  dotSize?: "sm" | "md" | "lg";
  shiny?: boolean;
}

interface HeadingProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  className?: string;
}
interface UnderlineProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}
interface DashProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
  dashed?: boolean;
}

export const ItemLinkList: FC<LinkListProps> = ({
  children,
  className,
  link,
  ...props
}) => {
  return (
    <Link
      link={link}
      {...props}
      className={cn(
        "px-1.5 rounded-md bg-slate-100 hover:underline text-gray-900 truncate m-1",
        className
      )}
    >
      {children}
    </Link>
  );
};

export const HeadingPage: FC<HeadingProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span
      {...props}
      className={cn(
        "text-xl md:text-3xl font-bold text-gray-900 tracking-tight",
        className
      )}
    >
      {children}
    </span>
  );
};
export const UnderlineSpan: FC<UnderlineProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span
      {...props}
      className={cn(
        "dark:text-white dark:bg-transparent truncate cursor-pointer relative before:absolute hover:before:w-full before:w-0 before:content[''] before:bg-gray-900 before:h-0.5 before:bottom-0 before:left-0 before:transition-all before:duration-500",
        className
      )}
    >
      {children}
    </span>
  );
};
export const StatusSpan: FC<SpanProps> = ({
  children,
  className,
  size = "md",
  dotSize = "sm",
  color = "bg-SLightGray",
  shiny = false,
  ...props
}) => {
  let s = "text-sm md:text-base font-semibold rounded-md px-1.5 py-0.5";
  let m = "text-base md:text-lg font-semibold rounded-md px-3 py-1";
  let l = "text-lg md:text-xl font-semibold rounded-md px-5 py-2";

  let ds = "h-1.5 w-1.5";
  let dm = "h-2.5 w-2.5";
  let dl = "h-4 w-4";

  let isSize = size === "sm" ? s : size === "md" ? m : l;
  let isDotSize = dotSize === "sm" ? ds : size === "md" ? dm : dl;

  let isShiny =
    shiny &&
    `bg-transparent bg-gradient-to-br from-transparent ${color == "bg-SGreen" ? "to-SGreen" : color == "bg-SRed" ? "to-SRed" : color == "bg-SYellow" ? "to-SYellow" : color == "bg-SGray" ? "to-SGray" : color == "bg-SBlue" ? "to-SBlue" : color == "bg-SLightGreen" ? "to-SLightGreen" : color == "bg-SDarkRed" ? "to-SDarkRed" : "to-SLightGray"}`;

  return (
    <span
      {...props}
      className={cn(
        `tracking-tight ${isSize} ${color} bg-opacity-40 flex items-center gap-1.5`,
        className
      )}
    >
      <div className={`${isDotSize} rounded-full ${shiny ? isShiny : color}`} />
      <>{children}</>
    </span>
  );
};

interface ClipboardProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  copyData: string;
}

export const CopyClipboard: FC<ClipboardProps> = ({
  children,
  className,
  copyData,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const clipboard = () => {
    if (copyData) {
      window.navigator.clipboard.writeText(copyData);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1560);
    }
  };
  return (
    <Button {...props} variant="ghost" size="icon" onClick={() => clipboard()}>
      {copied ? (
        <CircleCheckBig
          size={12}
          strokeWidth={1.3}
          className="animate-slowfade text-green-600"
        />
      ) : (
        <Clipboard size={12} strokeWidth={1.3} className="animate-slowfade" />
      )}
      {children}
    </Button>
  );
};

export const AddNewDashedLineButton: FC<DashProps> = ({
  children,
  className = "w-full",
  variant = "default",
  size = "sm",
  dashed = true,
  ...props
}) => {
  let isVariant =
    variant === "default"
      ? "border-2 border-gray-200 bg-transparent hover:bg-gray-50"
      : variant === "ghost"
        ? "bg-transparent hover:bg-gray-100"
        : variant === "outline"
          ? "ring-1 ring-gray-300 hover:ring-gray-900 hover:bg-gray-50"
          : "bg-gray-200";

  let isSize =
    size === "sm" ? "h-12 p-2" : size === "md" ? "h-20 p-5" : "h-32 p-9";
  return (
    <button
      {...props}
      className={`${className} ${isVariant} ${isSize} ${
        dashed && "border-dashed"
      } rounded-lg transition-all duration-200 cursor-pointer`}
    >
      {children}
    </button>
  );
};
