import React from "react";
import LogoIcon from "../../media/images/logo_icon.svg";

const Icon = () => {
  return (
    <div className="dark:text-white dark:bg-transparent px-0 flex p-2 w-full justify-start items-center gap-8">
      <a
        href="/admin"
        className="dark:text-white dark:bg-transparent h-12 aspect-square overflow-hidden flex justify-center items-center"
      >
        <img
          src={LogoIcon}
          alt="logo_full"
          className="dark:text-white dark:bg-transparent h-full"
        />
      </a>
    </div>
  );
};

export default Icon;
