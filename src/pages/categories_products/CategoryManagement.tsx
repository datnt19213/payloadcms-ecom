import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {Gutter} from "payload/components/elements";
import Default from "payload/dist/admin/components/templates/Default";
import type {AdminViewComponent} from "payload/config";

import {useStepNav} from "payload/dist/admin/components/elements/StepNav";
import {useAuth, useConfig} from "payload/components/utilities";
import {getParams} from "../../utils";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {Button} from "../../components/ui/button";
import {Modal} from "../../components/modal";
import {toast, ToastContainer} from "react-toastify";
import {APIDelete} from "../../api";
import {Checkbox} from "../../components/ui/checkbox";
import {SkeletonTable} from "../../components/skeleton";
import {NoDataAvailableTable} from "../../components/empty/Empty";
import {ItemLinkList} from "../../components/elements";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  email: string;
  token: string;
}

const CategoryManagement = () => {
  const {user} = useAuth<User>();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [deletedAll, setDeleteAll] = useState<boolean>(false);

  const [isModal, setIsModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const navigateUpdate = (id) => {
    const url = `/admin/categories/edit/${id}`;
    console.log("Navigating to URL:", url);
    window.location.href = url;
  };

  const navigateCreate = () => {
    window.location.href = "/admin/categories/create";
  };
  const SetSelectedFnc = (id: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // #region Delete Function
  const deleteSelectedProducts = async (val) => {
    if (val.key === "NoExecute") {
      setIsModal(val.open);
      return;
    }
    if (val.key === "Execute") {
      setIsLoad(false);
      try {
        if (deletedAll) {
          const deleteRequests = data.map((product) =>
            APIDelete("/admin/categories", product?.id, user.token)
          );
          await Promise.all(deleteRequests);
          toast.success("All products deleted successfully.");
          setIsModal(val);
        } else {
          const deleteRequests = selected.map((id) =>
            APIDelete("/admin/categories", id, user.token)
          );
          await Promise.all(deleteRequests);
          toast.success("Selected products deleted successfully.");
          setIsModal(val.open);
        }

        const updateDatas = data.filter((data) => !selected.includes(data.id));
        setData(updateDatas);
        setIsLoad(true);
        setIsModal(false);
        setSelected([]);
        setDeleteAll(false);
      } catch (error) {
        console.error("Failed to delete selected products", error);
        toast.error("Failed to delete selected products.");
      }
    } else {
      throw new Error("Key modal transering is not accepted.");
    }
  };
  // #endregion

  return (
    <>
      <Gutter className="dark:text-white dark:bg-transparent flex flex-col gap-12 py-24">
        <Modal
          title="Are you sure to delete?"
          button2="Cancel"
          button="Delete"
          open={isModal}
          handle={deleteSelectedProducts}
          isLoad={isLoad}
        />
        <span className="dark:text-white dark:bg-transparent text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Categories Management
        </span>
        <div className="dark:text-white dark:bg-transparent w-full flex justify-between">
          <div className="dark:text-white dark:bg-transparent flex justify-start items-center gap-5">
            <Button variant="default" onClick={() => navigateCreate()}>
              New Category
            </Button>
          </div>
          <div className="dark:text-white dark:bg-transparent flex justify-end items-center gap-5">
            {(selected.length > 0 || deletedAll) && (
              <Button
                variant="default"
                className="dark:text-white dark:bg-transparent bg-red-600 animate-fade"
                onClick={() => setIsModal(true)}
              >
                Delete all selected
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setSelected([]), setDeleteAll(false);
              }}
            >
              Unselect all
            </Button>

            <div className="dark:text-white dark:bg-transparent flex items-center space-x-2">
              <Checkbox
                id="delete-all-cb"
                checked={deletedAll}
                onCheckedChange={(e) =>
                  setDeleteAll((prevDeletedAll) => !prevDeletedAll)
                }
              />
              <label
                htmlFor="delete-all-cb"
                className="dark:text-white dark:bg-transparent text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none cursor-pointer"
              >
                Select All
              </label>
            </div>

            <span className="dark:text-white dark:bg-transparent text-sm font-semibold tracking-tight">
              {selected.length}&nbsp;rows selected
            </span>
          </div>
        </div>
        <div className="dark:text-white dark:bg-transparent w-full overflow-x-scroll p-8 scrollbar-thin bg-transparent">
          <div className="dark:text-white dark:bg-transparent mx-auto w-full rounded-lg shadow-lg flex justify-center max-w-[2156px] animate-slowfade min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                  <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                    <span>Name</span>
                  </TableHead>
                  <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                    <span>Slug</span>
                  </TableHead>
                  <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-6 font-semibold text-base text-center">
                    <span>Categories</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length > 0 ? (
                  <>
                    {skeleton ? (
                      <SkeletonTable />
                    ) : (
                      data.map((category, index) => (
                        <TableRow
                          key={`p-${index}`}
                          className={`grid grid-cols-12 min-h-12 cursor-default ${
                            selected.includes(category?.id.toString())
                              ? "bg-red-50 hover:bg-red-50"
                              : "bg-white hover:bg-gray-50"
                          } `}
                          onClick={() =>
                            SetSelectedFnc(category?.id.toString())
                          }
                        >
                          <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium flex justify-start items-center text-base px-5">
                            <span
                              className="dark:text-white dark:bg-transparent truncate cursor-pointer relative before:absolute hover:before:w-full before:w-0 before:content[''] before:bg-gray-900 before:h-0.5 before:bottom-0 before:left-0 before:transition-all before:duration-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateUpdate(category?.id);
                              }}
                            >
                              {category?.name}
                            </span>
                          </TableCell>
                          <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium flex justify-start items-center text-base px-5">
                            <span className="dark:text-white dark:bg-transparent truncate">
                              {category?.slug}
                            </span>
                          </TableCell>
                          <TableCell className="dark:text-white dark:bg-transparent col-span-6 flex justify-start items-center font-medium text-base px-5">
                            <div className="dark:text-white dark:bg-transparent w-full flex flex-wrap justify-start items-start">
                              {category?.categories.map((category) => (
                                <ItemLinkList
                                  key={category.id}
                                  link={`/categories/edit?id=${category.id}`}
                                  className="dark:text-white dark:bg-transparent px-1.5 rounded-md bg-slate-100 hover:underline text-gray-900 truncate"
                                >
                                  {category ? category.name : "-"}
                                </ItemLinkList>
                              ))}
                            </div>
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
      </Gutter>
      <ToastContainer position="top-right" />
    </>
  );
};

export default CategoryManagement;
