import {Gutter} from "payload/components/elements";
import {useAuth} from "payload/components/utilities";
import Default from "payload/dist/admin/components/templates/Default";
import React, {useEffect, useState} from "react";
import {HeadingPage} from "../../components/elements";
import {Download, EllipsisVertical, Lock, Search} from "lucide-react";
import {Button} from "../../components/ui/button";
import {ManagementContainer} from "../../components/container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {toast} from "react-toastify";
import {APIGet, APIDelete} from "../../api";
import {LinkBtn} from "../../components/buttons";
import {NoDataAvailableTable} from "../../components/empty/Empty";
import {SkeletonTable} from "../../components/skeleton";
import {formatDate2, FormattedCurrencyWithDot} from "../../utils";
import {Modal} from "../../components/modal";
import {Obj} from "../../types";
import axios from "axios";

interface User {
  id: number;
  email: string;
  token: string;
}
export const MenusManagement = () => {
  const {user} = useAuth<User>();

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [deletedAll, setDeleteAll] = useState<boolean>(false);

  const [productItems, setMenuItems] = useState([]);

  const [isModalList, setIsModalList] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const ShowAllMenuItems = (products: any) => {
    setMenuItems(products);
    setIsModalList(true);
  };

  const handleActionModal = (val: Obj) => {
    if (val.key === "NoExecute") {
      setIsModalList(val.open);
      return true;
    }
  };

  // #region Single selected
  const SetSelectedFnc = (id: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };
  // #endregion
  // #region Get all menus
  useEffect(() => {
    const getMenu = async () => {
      setSkeleton(true);
      try {
        const response = await axios.get("/api/menus");
        if (response.data.totalDocs > 0) {
          setData(response.data.docs);
          setSkeleton(false);
        }
      } catch (error) {
        console.error("Failed to fetch menus", error);
        setSkeleton(false);
      }
    };
    getMenu();
  }, []);
  // #endregion

  // #region Select all rows
  // useEffect(() => {
  //   const selectAllRows = () => {
  //     if (deletedAll && data.length > 0) {
  //       let arr = [];
  //       data.forEach((menu) => arr.push(menu?.id));
  //       setSelected(arr);
  //     } else {
  //       setSelected([]);
  //     }
  //   };

  //   selectAllRows();
  // }, [deletedAll]);
  // #endregion

  // #region Delete Function
  // const deleteSelectedMenus = async (val) => {
  //   if (val.key === "NoExecute") {
  //     setIsModal(val.open);
  //     return;
  //   }
  //   if (val.key === "Execute") {
  //     setIsLoad(true);
  //     try {
  //       if (deletedAll) {
  //         const deleteRequests = data.map((product) =>
  //           APIDelete("/admin/menus", product?.id, user.token)
  //         );
  //         await Promise.all(deleteRequests);
  //         toast.success("All menus deleted successfully.");
  //         setIsModal(val);
  //       } else {
  //         const deleteRequests = selected.map((id) =>
  //           APIDelete("/admin/menus", id, user.token)
  //         );
  //         await Promise.all(deleteRequests);
  //         toast.success("Selected menus deleted successfully.");
  //         setIsModal(val.open);
  //       }

  //       const updateDatas = data.filter((data) => !selected.includes(data.id));
  //       setData(updateDatas);
  //       setIsLoad(false);
  //       setIsModal(false);
  //       setSelected([]);
  //       setDeleteAll(false);
  //     } catch (error) {
  //       console.error("Failed to delete selected menus", error);
  //       toast.error("Failed to delete selected menus.");
  //     }
  //   } else {
  //     throw new Error("Key modal transering is not accepted.");
  //   }
  // };
  // #endregion
  return (
    <ManagementContainer title="Navigation" maxWidth={true}>
      {/* <Modal
        title="Are you sure to delete?"
        button2="Cancel"
        button="Delete"
        open={isModal}
        handle={deleteSelectedMenus}
        isLoad={isLoad}
      /> */}
      <div className="flex flex-col gap-7">
        <div className="shadow-md ring-1 ring-gray-100 rounded-md overflow-hidden">
          <div className="bg-yellow-500 flex gap-2 p-5">
            <Lock size={16} strokeWidth={1.7} />
            <span className="font-semibold tracking-tight">
              Your online store is password protected
            </span>
          </div>
          <div className="flex flex-col gap-3 p-5">
            <span>
              Only visitors with your password can access your store. To let
              anyone browse and shop, remove the password.
            </span>
            <Button variant="outline" className="rounded-md w-fit text-base">
              Remove password
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-7">
          <div className="flex flex-col gap-3 w-full lg:w-1/3">
            <span className="font-semibold text-xl">Menus</span>
            <span className="text-wrap">
              Menus, or link lists, help your customers navigate around your
              online store.
            </span>
            <span className="flex flex-wrap text-wrap">
              You can also&nbsp;
              <span className="text-blue-500 underline">
                create nested menus
              </span>
              &nbsp;to display drop-down menus, and group products or pages
              together.
            </span>
          </div>
          <div className="w-full lg:w-2/3">
            <div className="flex justify-between">
              <span className="font-semibold text-xl">Menus</span>
              <LinkBtn
                link="/admin/collections/menus/create"
                className="text-blue-500"
              >
                Add menu
              </LinkBtn>
            </div>
            <div className="dark:text-white dark:bg-transparent w-full overflow-x-scroll p-8 scrollbar-thin bg-transparent">
              <div className="dark:text-white dark:bg-transparent mx-auto w-full rounded-lg shadow-lg flex justify-center max-w-[2156px] animate-slowfade min-w-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-2 min-h-8">
                      <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center">
                        <span>Title</span>
                      </TableHead>
                      <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center">
                        <span>Menu items</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data && data.length > 0 ? (
                      <>
                        {skeleton ? (
                          <SkeletonTable />
                        ) : (
                          data.map((menu, index) => (
                            <TableRow
                              key={`o-${index}`}
                              className={`grid grid-cols-2 min-h-12 cursor-default ${
                                selected.includes(menu?.id.toString())
                                  ? "bg-red-50 hover:bg-red-50"
                                  : "bg-white hover:bg-gray-50"
                              } `}
                              // onClick={() =>
                              //   SetSelectedFnc(menu?.id.toString())
                              // }
                            >
                              <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium flex justify-center items-start text-base px-5">
                                <LinkBtn
                                  variant="link"
                                  size="none"
                                  className="text-blue-500"
                                  link={`/admin/collections/menus/${menu?.id}`}
                                >
                                  {menu?.title}
                                </LinkBtn>
                              </TableCell>
                              <TableCell
                                className="dark:text-white dark:bg-transparent col-span-1 font-medium flex justify-center items-start text-base px-5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="dark:text-white dark:bg-transparent truncate"
                                >
                                  {menu?.items && menu?.items.length}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </>
                    ) : skeleton ? (
                      <SkeletonTable />
                    ) : (
                      <NoDataAvailableTable />
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-7">
          <div className="flex flex-col gap-3 w-full lg:w-1/3">
            <span className="font-semibold text-xl">
              Collection and search filters
            </span>
            <span className="text-wrap">
              Allow your customers to filter collections and search results by
              product availability, price, color, and more.
            </span>
          </div>
          <div className="w-full lg:w-2/3 flex flex-col gap-3 p-5">
            <span className="font-semibold text-xl">Filters</span>
            <span className="text-wrap">
              Filter settings are now available in the Shopify Search &
              Discovery app. Make changes to these settings in the app.
            </span>
            <div className="flex gap-5 border border-gray-300 rounded-lg p-4 bg-slate-50">
              <div className="bg-gradient-to-r from-[#4AE2FF] to-[#886BFD] w-[2.3125rem] h-[2.3125rem] flex justify-center items-center rounded-xl aspect-square">
                <Search strokeWidth={3} size={20} className="text-white" />
              </div>
              <div className="flex items-center w-full">
                <div className="flex flex-col gap-1.5 w-full">
                  <span>Shopify Search & Discovery</span>
                  <span>4.6⭐ Free</span>
                  <span>
                    Customize search, filtering, and product recommendations
                  </span>
                </div>
                <Button variant="outline" size="icon">
                  <Download strokeWidth={1.7} size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ManagementContainer>
  );
};
