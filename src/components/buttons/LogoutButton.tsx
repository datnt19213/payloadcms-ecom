import React, {FC, HTMLAttributes, ReactNode} from "react";
import {Button} from "../ui/button";
import {LogOut} from "lucide-react";
import {cn} from "../../lib/utils";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
}

const LogoutButton: FC<Props> = ({className, children, ...props}) => {
  const logoutHandler = () => {
    window.location.href = "/admin/logout";
  };
  return (
    <Button
      type="button"
      {...props}
      onClick={() => logoutHandler()}
      className={cn(
        "bg-red-700 w-full mt-auto flex items-center transition-all gap-3 justify-center hover:bg-red-700 hover:opacity-70",
        className
      )}
    >
      <LogOut
        size={16}
        className="dark:text-white dark:bg-transparent transform rotate-180"
      />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
