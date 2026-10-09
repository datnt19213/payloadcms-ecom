import React from "react";
import LogoFull from "../../media/images/logo_full.svg";

const Logo = () => {
  return (
    <div className="dark:text-white dark:bg-transparent min-h-12 aspect-[9:16]">
      <img
        src={LogoFull}
        alt="logo_full"
        className="dark:text-white dark:bg-transparent h-full w-auto"
      />
    </div>
  );
};

export default Logo;
