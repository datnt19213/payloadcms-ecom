import React, {FC, HTMLAttributes, ReactNode} from "react";
import {Link as RouterLink} from "react-router-dom";

const Variants = {
  default:
    "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
  destructive:
    "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
  outline:
    "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
  ghost:
    "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
  link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
  none: "",
};

const Sizes = {
  default: "h-10 py-2 px-4",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-4",
  icon: "h-10 w-10",
  none: "h-fit w-fit rounded-md",
};

interface Props extends HTMLAttributes<HTMLAnchorElement> {
  link: string;
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "none";
  size?: "default" | "sm" | "lg" | "icon" | "none";
}

const LinkBtn: FC<Props> = ({
  link = "/admin",
  children,
  className = "",
  variant = "default",
  size = "default",
}) => {
  let isVariant =
    variant === "default"
      ? Variants.default
      : variant === "outline"
      ? Variants.outline
      : variant === "secondary"
      ? Variants.secondary
      : variant === "destructive"
      ? Variants.destructive
      : variant === "ghost"
      ? Variants.ghost
      : variant === "link"
      ? Variants.link
      : Variants.none;
  let isSize =
    size === "default"
      ? Sizes.default
      : size === "sm"
      ? Sizes.sm
      : size === "icon"
      ? Sizes.icon
      : size === "lg"
      ? Sizes.lg
      : Sizes.none;
  return (
    <RouterLink
      to={link}
      className={`truncate inline-flex items-center whitespace-nowrap rounded-md font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 ${className} ${isVariant} ${isSize}`}
    >
      {children}
    </RouterLink>
  );
};
const Link: FC<Props> = ({link = "/admin", children, className = ""}) => {
  return (
    <RouterLink to={link} className={`${className}`}>
      {children}
    </RouterLink>
  );
};

export {LinkBtn, Link};
