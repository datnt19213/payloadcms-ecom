import { useField } from "payload/components/forms";
import React, { FC, useEffect, useState } from "react";
import { Label } from "../ui/label";
import HeaderIco from "../../media/icons/header.svg";
import FooterIco from "../../media/icons/footer.svg";
import SidebarIco from "../../media/icons/sidebar.svg";
import MobileIco from "../../media/icons/mobile.svg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Enum, MenuType } from "../../common/data";
import { Gutter } from "payload/components/elements";
import {
  PanelBottom,
  PanelLeft,
  PanelLeftDashed,
  PanelTop,
  Plus,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { TextField, TextInactiveField } from "./TextField";
import {
  buildHierarchy,
  convertToSlug,
  GetLevel1Categories,
  GetLevel2Categories,
  GetLevel3Categories,
} from "../../utils";
import payload from "payload";
import {toast, ToastContainer} from "react-toastify";
import {ValueLabel} from "../../types";
import {NoDataAvailable} from "../empty";
import axios from "axios";
import {APIGet} from "../../api";
import {Redirect} from "react-router-dom";
import {useAuth} from "payload/components/utilities";

interface User {
  id: number;
  email: string;
  token: string;
}

export const MenuTypeField: FC<{path?: string}> = ({path}) => {
  const {value = "", setValue} = useField<string>({path});

  const [menuTypeList, setMenuTypeList] = useState<ValueLabel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const req = await axios.get("/api/menu-type");

      if (req.data.totalDocs > 0) {
        let arr = [] as ValueLabel[];
        req.data.docs.forEach((doc) => {
          arr.push({
            label: doc.name.toString(),
            value: doc.value.toString(),
          });
        });
        setMenuTypeList(arr);
      }
    };

    fetchData();
  }, []);

  const [data, setData] = useState("");
  const [valueData, setValueData] = useState("");

  const handleNameChange = (name: string) => {
    setData(name);
    // setValueData(convertToSlug(name).toLowerCase());
    // console.log(name + "====");
  };
  const handleValueDataChange = (value: string) => {
    setValueData(convertToSlug(value).toLowerCase());
    console.log(value + "====");
  };

  const handleSubmitData = async () => {
    return <Redirect to="/admin/collections/menu-type" />;
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5 flex flex-col gap-5">
      <ToastContainer />
      <Label className="dark:text-white dark:bg-transparent text-base">
        Menu Type
      </Label>
      <div className="flex items-center gap-5">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="dark:text-white dark:bg-transparent min-h-14 flex items-center text-base w-full border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200">
            <SelectValue
              className="dark:text-white dark:bg-transparent text-base"
              placeholder="Menu type"
            />
          </SelectTrigger>
          <SelectContent className="dark:text-white dark:bg-transparent min-h-14 flex items-center gap-5">
            {menuTypeList.map((menu, index) => (
              <SelectItem
                key={index}
                value={menu.value}
                className="dark:text-white dark:bg-transparent min-h-14 text-base"
              >
                {menu.label}
              </SelectItem>
            ))}
            {menuTypeList.length === 0 && <NoDataAvailable />}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          className="hover:bg-gray-100 dark:bg-gray-700 rounded-full p-1"
          onClick={() => handleSubmitData()}
        >
          <Plus />
        </Button>
        {/* <Drawer>
          <DrawerTrigger className="hover:bg-gray-100 dark:bg-gray-700 rounded-full p-1">
            <Plus />
          </DrawerTrigger>
          <DrawerContent className="bg-white dark:bg-gray-900">
            <DrawerHeader>
              <DrawerTitle>Create new menu type</DrawerTitle>
            </DrawerHeader>
            <TextField data="" onChange={handleNameChange} title="Name" />
            <TextInactiveField
              data={valueData}
              onChange={handleValueDataChange}
              title="Value"
            />
            <DrawerFooter>
              <Button type="button" onClick={() => handleSubmitData()}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer> */}
      </div>
    </Gutter>
  );
};

export const HierarchicalFieldOne: FC<{path?: string}> = ({path}) => {
  const {user} = useAuth<User>();
  const {value = "", setValue} = useField<string>({path});

  console.log("checkingg    ----  " + value);

  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const req = await APIGet("/admin/product-categories", user?.token);

      if (req.data.count > 0) {
        const hieMenu = buildHierarchy(req.data.product_categories);
        const lv1Menu = GetLevel1Categories(hieMenu);
        setMenuList(lv1Menu);
      }
    };

    fetchData();
  }, []);

  const handleValueChange = (id: string) => {
    setValue(id);
  };
  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5 flex flex-col gap-5">
      <Label className="dark:text-white dark:bg-transparent text-base">
        Menu item
      </Label>
      <div className="flex items-center gap-5">
        <Select
          value={value}
          onValueChange={handleValueChange}
          defaultValue={value}
        >
          <SelectTrigger
            value={value}
            defaultValue={value}
            className="dark:text-white dark:bg-transparent min-h-14 flex items-center text-base w-full border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200"
          >
            <SelectValue
              className="dark:text-white dark:bg-transparent text-base"
              placeholder="Menu type"
              defaultValue={value}
            />
          </SelectTrigger>
          <SelectContent
            className="dark:text-white dark:bg-transparent min-h-14 flex items-center gap-5"
            defaultValue={value}
          >
            {menuList.map((menu, index) => (
              <SelectItem
                key={index}
                value={menu.id}
                className="dark:text-white dark:bg-transparent min-h-14 text-base"
              >
                <span>{menu.name}</span>
              </SelectItem>
            ))}
            {menuList.length === 0 && <NoDataAvailable />}
          </SelectContent>
        </Select>
      </div>
    </Gutter>
  );
};
export const HierarchicalFieldTwo: FC<{path?: string}> = ({path}) => {
  const {user} = useAuth<User>();
  const {value = "", setValue} = useField<string>({path});

  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const req = await APIGet("/admin/product-categories", user?.token);

      if (req.data.count > 0) {
        const hieMenu = buildHierarchy(req.data.product_categories);
        const lv2Menu = GetLevel2Categories(hieMenu);
        setMenuList(lv2Menu);
      }
    };

    fetchData();
  }, []);

  const handleValueChange = (id: string) => {
    setValue(id);
  };
  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5 flex flex-col gap-5">
      <Label className="dark:text-white dark:bg-transparent text-base">
        Menu item
      </Label>
      <div className="flex items-center gap-5">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="dark:text-white dark:bg-transparent min-h-14 flex items-center text-base w-full border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200">
            <SelectValue
              className="dark:text-white dark:bg-transparent text-base"
              placeholder="Menu type"
            />
          </SelectTrigger>
          <SelectContent className="dark:text-white dark:bg-transparent min-h-14 flex items-center gap-5">
            {menuList.map((menu, index) => (
              <SelectItem
                key={index}
                value={menu.id}
                className="dark:text-white dark:bg-transparent min-h-14 text-base"
              >
                <span>{menu.name}</span>
              </SelectItem>
            ))}
            {menuList.length === 0 && <NoDataAvailable />}
          </SelectContent>
        </Select>
      </div>
    </Gutter>
  );
};
export const HierarchicalFieldThree: FC<{path?: string}> = ({path}) => {
  const {user} = useAuth<User>();
  const {value = "", setValue} = useField<string>({path});

  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const req = await APIGet("/admin/product-categories", user?.token);

      if (req.data.count > 0) {
        const hieMenu = buildHierarchy(req.data.product_categories);
        const lv3Menu = GetLevel3Categories(hieMenu);
        setMenuList(lv3Menu);
      }
    };

    fetchData();
  }, []);

  const handleValueChange = (id: string) => {
    setValue(id);
  };
  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5 flex flex-col gap-5">
      <Label className="dark:text-white dark:bg-transparent text-base">
        Menu item
      </Label>
      <div className="flex items-center gap-5">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="dark:text-white dark:bg-transparent min-h-14 flex items-center text-base w-full border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200">
            <SelectValue
              className="dark:text-white dark:bg-transparent text-base"
              placeholder="Menu type"
            />
          </SelectTrigger>
          <SelectContent className="dark:text-white dark:bg-transparent min-h-14 flex items-center gap-5">
            {menuList.map((menu, index) => (
              <SelectItem
                key={index}
                value={menu.id}
                className="dark:text-white dark:bg-transparent min-h-14 text-base"
              >
                <span>{menu.name}</span>
              </SelectItem>
            ))}
            {menuList.length === 0 && <NoDataAvailable />}
          </SelectContent>
        </Select>
      </div>
    </Gutter>
  );
};
export const HierarchicalNameFieldOne: FC<{path?: string}> = ({path}) => {
  const {user} = useAuth<User>();
  const {value = "", setValue} = useField<string>({path});

  console.log("checkingg    ----  " + value);

  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const req = await APIGet("/admin/product-categories", user?.token);

      if (req.data.count > 0) {
        const hieMenu = buildHierarchy(req.data.product_categories);
        const lv1Menu = GetLevel1Categories(hieMenu);
        setMenuList(lv1Menu);
      }
    };

    fetchData();
  }, []);

  const handleValueChange = (name: string) => {
    setValue(name);
  };
  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5 flex flex-col gap-5">
      <Label className="dark:text-white dark:bg-transparent text-base">
        Title
      </Label>
      <div className="flex items-center gap-5">
        <Select
          value={value}
          onValueChange={handleValueChange}
          defaultValue={value}
        >
          <SelectTrigger
            value={value}
            defaultValue={value}
            className="dark:text-white dark:bg-transparent min-h-14 flex items-center text-base w-full border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200"
          >
            <SelectValue
              className="dark:text-white dark:bg-transparent text-base"
              placeholder="Menu type"
              defaultValue={value}
            />
          </SelectTrigger>
          <SelectContent
            className="dark:text-white dark:bg-transparent min-h-14 flex items-center gap-5"
            defaultValue={value}
          >
            {menuList.map((menu, index) => (
              <SelectItem
                key={index}
                value={menu.name}
                className="dark:text-white dark:bg-transparent min-h-14 text-base"
              >
                <span>{menu.name}</span>
              </SelectItem>
            ))}
            {menuList.length === 0 && <NoDataAvailable />}
          </SelectContent>
        </Select>
      </div>
    </Gutter>
  );
};
export const HierarchicalNameFieldTwo: FC<{path?: string}> = ({path}) => {
  const {user} = useAuth<User>();
  const {value = "", setValue} = useField<string>({path});

  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const req = await APIGet("/admin/product-categories", user?.token);

      if (req.data.count > 0) {
        const hieMenu = buildHierarchy(req.data.product_categories);
        const lv2Menu = GetLevel2Categories(hieMenu);
        setMenuList(lv2Menu);
      }
    };

    fetchData();
  }, []);

  const handleValueChange = (name: string) => {
    setValue(name);
  };
  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5 flex flex-col gap-5">
      <Label className="dark:text-white dark:bg-transparent text-base">
        Title
      </Label>
      <div className="flex items-center gap-5">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="dark:text-white dark:bg-transparent min-h-14 flex items-center text-base w-full border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200">
            <SelectValue
              className="dark:text-white dark:bg-transparent text-base"
              placeholder="Menu type"
            />
          </SelectTrigger>
          <SelectContent className="dark:text-white dark:bg-transparent min-h-14 flex items-center gap-5">
            {menuList.map((menu, index) => (
              <SelectItem
                key={index}
                value={menu.name}
                className="dark:text-white dark:bg-transparent min-h-14 text-base"
              >
                <span>{menu.name}</span>
              </SelectItem>
            ))}
            {menuList.length === 0 && <NoDataAvailable />}
          </SelectContent>
        </Select>
      </div>
    </Gutter>
  );
};
export const HierarchicalNameFieldThree: FC<{path?: string}> = ({path}) => {
  const {user} = useAuth<User>();
  const {value = "", setValue} = useField<string>({path});

  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const req = await APIGet("/admin/product-categories", user?.token);

      if (req.data.count > 0) {
        const hieMenu = buildHierarchy(req.data.product_categories);
        const lv3Menu = GetLevel3Categories(hieMenu);
        setMenuList(lv3Menu);
      }
    };

    fetchData();
  }, []);

  const handleValueChange = (name: string) => {
    setValue(name);
  };
  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5 flex flex-col gap-5">
      <Label className="dark:text-white dark:bg-transparent text-base">
        Title
      </Label>
      <div className="flex items-center gap-5">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="dark:text-white dark:bg-transparent min-h-14 flex items-center text-base w-full border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200">
            <SelectValue
              className="dark:text-white dark:bg-transparent text-base"
              placeholder="Menu type"
            />
          </SelectTrigger>
          <SelectContent className="dark:text-white dark:bg-transparent min-h-14 flex items-center gap-5">
            {menuList.map((menu, index) => (
              <SelectItem
                key={index}
                value={menu.name}
                className="dark:text-white dark:bg-transparent min-h-14 text-base"
              >
                <span>{menu.name}</span>
              </SelectItem>
            ))}
            {menuList.length === 0 && <NoDataAvailable />}
          </SelectContent>
        </Select>
      </div>
    </Gutter>
  );
};

export const PaymentMethodField: FC<{path?: string}> = ({path}) => {
  const {value = "", setValue} = useField<string>({path});

  const [paymentList, setPaymentList] = useState<ValueLabel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const req = await axios.get(
          `https://payment-router-gateway.ng2fqynrn8.workers.dev/api/list-method?code=`
        );

        if (req.data.data.length > 0) {
          let arr = [] as ValueLabel[];
          req.data.data.forEach((doc) => {
            arr.push({
              label: doc.label.toString(),
              value: doc.id.toString(),
            });
          });
          setPaymentList(arr);
          console.log("Danh sách payment", paymentList);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [data, setData] = useState("");
  const [valueData, setValueData] = useState("");

  const handleNameChange = (name: string) => {
    setData(name);
    // setValueData(convertToSlug(name).toLowerCase());
    // console.log(name + "====");
  };
  const handleValueDataChange = (value: string) => {
    setValueData(convertToSlug(value).toLowerCase());
    console.log(value + "====");
  };

  const handleSubmitData = async () => {
    try {
      const response = await axios.post(
        "https://payload-cms-sy02.onrender.com/api/channels",
        {
          name: "Chanel Test 2",
          description: "đây là channel test",
          return_url: "http: //127.0.0.1:3000/api/channels",
          cancel_url: "http: //127.0.0.1:3000/api/channels",
          webhook: "http: //127.0.0.1:3000/api/channels",
          provider: value,
        }
      );

      if (response.data.status === 200) {
        toast.success("Menu type created successfully");
      } else {
        toast.error("Menu type created failed");
      }
    } catch (error) {
      console.error(error);
    }

    window.location.href = "/admin/collections/menu-type";
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <Gutter className="dark:text-white dark:bg-transparent !px-0 mt-5 flex flex-col gap-5">
      <ToastContainer />
      <Label className="dark:text-white dark:bg-transparent text-base">
        Payment method
      </Label>
      <div className="flex items-center gap-5">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="dark:text-white dark:bg-transparent min-h-14 flex items-center text-base w-full border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200">
            <SelectValue
              className="dark:text-white dark:bg-transparent text-base"
              placeholder="Payment method"
            />
          </SelectTrigger>
          <SelectContent className="dark:text-white dark:bg-transparent min-h-14 flex items-center gap-5">
            {paymentList?.map((pay, index) => (
              <SelectItem
                key={index}
                value={pay?.value}
                className="dark:text-white dark:bg-transparent min-h-14 text-base"
              >
                {pay?.label}
              </SelectItem>
            ))}
            {paymentList.length === 0 && <NoDataAvailable />}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          className="hover:bg-gray-100 dark:bg-gray-700 rounded-full p-1"
          onClick={() => handleSubmitData()}
        >
          <Plus />
        </Button>
        {/* <Drawer>
          <DrawerTrigger className="hover:bg-gray-100 dark:bg-gray-700 rounded-full p-1">
            <Plus />
          </DrawerTrigger>
          <DrawerContent className="bg-white dark:bg-gray-900">
            <DrawerHeader>
              <DrawerTitle>Create new menu type</DrawerTitle>
            </DrawerHeader>
            <TextField data="" onChange={handleNameChange} title="Name" />
            <TextInactiveField
              data={valueData}
              onChange={handleValueDataChange}
              title="Value"
            />
            <DrawerFooter>
              <Button type="button" onClick={() => handleSubmitData()}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer> */}
      </div>
    </Gutter>
  );
};
