import React, {useEffect, useState} from "react";
import {Gutter} from "payload/components/elements";
import {Common, MenuLink} from "../../common/data";
import {Button} from "../ui/button";
import Logo from "../../media/images/logo_full.svg";
import {LinkBtn, LogoutButton} from "../buttons";
import {FlexColContainer, GridColAutoRow, GridRow10} from "../container";
import {SidebarItems} from "../../types";
import {ChevronDown} from "lucide-react";
import {useAuth} from "payload/components/utilities";
import {Icon} from "@iconify-icon/react";
import {
  CreateLocalStorage,
  GetLastStringFromUrl,
  GetLocalStorage,
} from "../../utils";

const StickyBox = React.lazy(() => import("react-sticky-box"));

interface User {
  id: number;
  email: string;
  token: string;
  roles: string;
}

const Sidebar = () => {
  const {user} = useAuth<User>();

  const [parent, setParent] = useState<string[]>([]);
  const [child, setChild] = useState<string>("");

  let param = GetLastStringFromUrl();

  const SetParentShowHide = (prt: string) => {
    setParent((prevParent) => {
      const exists = prevParent.includes(prt);

      const newParent = exists
        ? prevParent.filter((item) => item !== prt)
        : [...prevParent, prt];

      CreateLocalStorage("pm_slt", JSON.stringify(newParent));
      return newParent;
    });
  };

  const FindToCheckExist = (str: string): boolean => {
    return parent.some((item) => item === str);
  };

  // const SidebarRouting = (link: string, select: string) => {
  //   setChild(select);
  //   CreateLocalStorage("cm_slt", JSON.stringify(select));
  // };

  useEffect(() => {
    setChild(param);
    CreateLocalStorage("cm_slt", JSON.stringify(param));
  }, [param]);

  useEffect(() => {
    const menuParent = GetLocalStorage("pm_slt");
    if (menuParent) {
      setParent(JSON.parse(menuParent));
    }

    const menuChild = GetLocalStorage("cm_slt");
    if (menuChild) {
      setChild(JSON.parse(menuChild));
    }
  }, []);

  return (
    <>
      <Gutter className="dark:text-white dark:bg-transparent !px-5 !py-16 h-full box-border flex items-start border-r border-gray-300">
        <StickyBox
          className="dark:text-white dark:bg-transparent w-full h-full max-h-[calc(100vh-8rem)]"
          offsetTop={20}
          offsetBottom={20}
        >
          <div className="dark:text-white dark:bg-transparent h-full box-border gap-4 flex flex-col ">
            <div className="dark:text-white dark:bg-transparent flex flex-col h-[calc(100%-3rem)] pb-5 box-border">
              <a
                href="/"
                className="dark:text-white dark:bg-transparent max-h-[8rem] cursor-pointer aspect-video py-5 flex justify-center items-center overflow-hidden"
              >
                <img
                  src={Logo}
                  alt="Logo"
                  className="dark:text-white dark:bg-transparent h-full w-auto"
                />
              </a>
              <div className="dark:text-white dark:bg-transparent h-[calc(100%-5rem)] px-3 flex flex-col justify-start overflow-y-scroll scrollbar-none">
                <div className="dark:text-white dark:bg-transparent flex flex-col h-fit gap-1">
                  {MenuLink.map((item: SidebarItems, index) => {
                    return item.child.length > 0 ? (
                      <div className="w-full" key={index}>
                        {item.roles.some((role) => role == user.roles) &&
                          item.disable === false && (
                            <Button
                              key={`b${index}`}
                              variant="ghost"
                              size="lg"
                              className="dark:text-white dark:bg-transparent w-full flex items-center justify-between px-4 gap-3 text-base"
                              onClick={() => SetParentShowHide(item.value)}
                            >
                              <div className="flex items-center justify-start gap-3">
                                <Icon icon={`${item.icon && item.icon}`} />
                                <span>{item.label}</span>
                              </div>
                              <ChevronDown strokeWidth={1.7} size={16} />
                            </Button>
                          )}
                        {item.roles.some((role) => role == user.roles) &&
                          item.disable === false && (
                            <FlexColContainer
                              key={`fc${index}`}
                              className={`${
                                FindToCheckExist(item.value) ? "h-fit" : "h-0"
                              } overflow-hidden transition-all duration-200 gap-1 ml-3 border-l pl-1 border-gray-200`}
                            >
                              {item.child.map((childItem, jdex) => (
                                <>
                                  {childItem.roles.find(
                                    (role) => role == user.roles
                                  ) &&
                                    childItem.disable === false && (
                                      <LinkBtn
                                        link={childItem.link}
                                        key={jdex}
                                        variant="ghost"
                                        size="lg"
                                        className={`${
                                          child === childItem.value
                                            ? "bg-gray-200"
                                            : "bg-white"
                                        } ${
                                          childItem.disable && "hidden"
                                        } w-full flex items-center justify-start gap-3 px-4 text-base`}
                                      >
                                        <span>{childItem.label}</span>
                                      </LinkBtn>
                                    )}
                                </>
                              ))}
                            </FlexColContainer>
                          )}
                      </div>
                    ) : (
                      item.roles.some((role) => role == user.roles) &&
                        item.disable === false && (
                          <LinkBtn
                            link={item.link}
                            key={index}
                            variant="ghost"
                            size="lg"
                            className={`${
                              child === item.value ? "bg-gray-200" : "bg-white"
                            } ${
                              item.disable && "hidden"
                            } w-full flex items-center justify-start text-base gap-3`}
                          >
                            <Icon icon={`${item.icon && item.icon}`} />
                            <span>{item.label}</span>
                          </LinkBtn>
                        )
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="dark:text-white dark:bg-transparent max-h-[3rem] h-[3rem] flex justify-center items-center shadow-top">
              <LogoutButton />
            </div>
          </div>
        </StickyBox>
      </Gutter>
    </>
  );
};

export default Sidebar;
