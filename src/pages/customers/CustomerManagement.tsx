import {Gutter} from "payload/components/elements";
import React, {useEffect, useState} from "react";
import {
  HeadingPage,
  ItemLinkList,
  StatusSpan,
  UnderlineSpan,
} from "../../components/elements";
import {Button} from "../../components/ui/button";
import {Notification} from "../../components/particals";
import {Checkbox} from "@radix-ui/react-checkbox";
import {EllipsisVertical} from "lucide-react";
import {useAuth} from "payload/components/utilities";
import {toast, ToastContainer} from "react-toastify";
import {APIGet, APIDelete} from "../../api";
import {NoDataAvailableTable} from "../../components/empty/Empty";
import {Modal} from "../../components/modal";
import {SkeletonTable} from "../../components/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {Obj} from "../../types";
import {
  capitalizeFirstLetter,
  formatDate2,
  FormattedCurrencyWithDot,
  GetStatusColor,
} from "../../utils";
import {LinkBtn} from "../../components/buttons";
import {Common, ROUTES} from "../../common/data";
import {TagField} from "../../components/fields";
import {ManagementContainer} from "../../components/container";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  email: string;
  token: string;
}

const CustomerManagement = () => {
  const {user} = useAuth<User>();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [deletedAll, setDeleteAll] = useState<boolean>(false);

  const [orderItems, setOrderItems] = useState([]);

  const [isModalList, setIsModalList] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const ShowAllOrderItems = (orders: any) => {
    setOrderItems(orders);
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

  // #region Get all customers
  useEffect(() => {
    const getCustomer = async () => {
      setSkeleton(true);
      try {
        const response = await APIGet(
          "/admin/customers?expand=orders",
          user?.token
        );
        if (response.success) {
          setData(response.data.customers);
          console.log(data.toString());
          setSkeleton(false);
        }
      } catch (error) {
        console.error("Failed to fetch customers", error);
        setSkeleton(false);
      }
    };
    getCustomer();
  }, []);
  // #endregion

  // #region Select all rows
  useEffect(() => {
    const selectAllRows = () => {
      if (deletedAll && data.length > 0) {
        let arr = [];
        data.forEach((customer) => arr.push(customer?.id));
        setSelected(arr);
      } else {
        setSelected([]);
      }
    };

    selectAllRows();
  }, [deletedAll]);
  // #endregion

  // #region Delete Function
  const deleteSelectedCustomers = async (val) => {
    if (val.key === "NoExecute") {
      setIsModal(val.open);
      return;
    }
    if (val.key === "Execute") {
      setIsLoad(true);
      try {
        if (deletedAll) {
          const deleteRequests = data.map((customer) =>
            APIDelete("/admin/customers", customer?.id, user.token)
          );
          await Promise.all(deleteRequests);
          toast.success("All customers deleted successfully.");
          setIsModal(val);
        } else {
          const deleteRequests = selected.map((id) =>
            APIDelete("/admin/customers", id, user.token)
          );
          await Promise.all(deleteRequests);
          toast.success("Selected customers deleted successfully.");
          setIsModal(val.open);
        }

        const updateDatas = data.filter((data) => !selected.includes(data.id));
        setData(updateDatas);
        setIsLoad(false);
        setIsModal(false);
        setSelected([]);
        setDeleteAll(false);
      } catch (error) {
        console.error("Failed to delete selected customers", error);
        toast.error("Failed to delete selected customers.");
      }
    } else {
      throw new Error("Key modal transering is not accepted.");
    }
  };
  // #endregion

  return (
    <ManagementContainer
      title="Customer Management"
      maxWidth={true}
      besideElement={
        <div className="flex flex-col sm:flex-row justify-start items-start sm:justify-between sm:items-center">
          <div className="w-fit flex items-center gap-3">
            <Button variant="secondary" size="sm">
              Export
            </Button>
            <Button variant="secondary" size="sm">
              Import
            </Button>
            <LinkBtn
              variant="default"
              size="sm"
              className="py-2 text-sm"
              link={ROUTES.CUSTOMER_CREATE}
            >
              Add Customer
            </LinkBtn>
          </div>
        </div>
      }
    >
      <div className="w-full">
        <Gutter className="dark:text-white dark:bg-transparent flex flex-col gap-12 py-12">
          {/* Modal popup */}
          <Modal
            title="Are you sure to delete?"
            button2="Cancel"
            button="Delete"
            open={isModal}
            handle={deleteSelectedCustomers}
            isLoad={isLoad}
          />

          <Modal
            title="Customer Orders"
            button2="Cancel"
            open={isModalList}
            handle={handleActionModal}
            size="xl"
            scrollable={true}
          >
            <div className="flex flex-col w-full relative justify-start">
              <Table className="min-w-fit">
                <TableHeader>
                  <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                    <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-6 font-semibold text-base text-center">
                      <span>Create At</span>
                    </TableHead>
                    <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-6 font-semibold text-base text-center">
                      <span>Status</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems?.length > 0 ? (
                    orderItems?.map((orderItem, i) => (
                      <TableRow
                        key={i}
                        className="grid grid-cols-12 min-h-12 hover:bg-gray-50 transition-all"
                      >
                        <TableCell className="dark:text-white dark:bg-transparent col-span-6 font-medium flex justify-center items-start text-base px-5">
                          <ItemLinkList
                            key={orderItem.id}
                            link={`/admin/orders/detail/${orderItem.id}`}
                          >
                            {orderItem?.created_at &&
                              formatDate2(orderItem?.created_at)}
                          </ItemLinkList>
                        </TableCell>

                        <TableCell className="dark:text-white dark:bg-transparent col-span-6 font-medium flex justify-center items-start text-base px-5">
                          {orderItem?.status && (
                            <StatusSpan
                              size="sm"
                              color={
                                orderItem?.status &&
                                GetStatusColor(orderItem?.status)
                              }
                            >
                              {capitalizeFirstLetter(orderItem?.status)}
                            </StatusSpan>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <NoDataAvailableTable />
                  )}
                </TableBody>
              </Table>
            </div>
          </Modal>

          {/* Customer Page */}
          <div className="dark:text-white dark:bg-transparent w-full flex justify-end">
            <div className="dark:text-white dark:bg-transparent flex justify-end items-center gap-5">
              {(selected.length > 0 || deletedAll) && (
                <Button
                  variant="default"
                  className="dark:text-white dark:bg-transparent text-nowrap bg-red-600 animate-fade"
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

              <span className="dark:text-white dark:bg-transparent text-nowrap text-sm font-semibold tracking-tight">
                {selected.length}&nbsp;rows selected
              </span>
            </div>
          </div>
          <div className="dark:text-white dark:bg-transparent w-full overflow-x-scroll p-8 scrollbar-thin bg-transparent">
            <div className="dark:text-white dark:bg-transparent mx-auto w-full rounded-lg shadow-lg flex justify-center max-w-[2156px] animate-slowfade min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                    <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center pr-4">
                      <Checkbox
                        id="delete-all-cb"
                        checked={deletedAll}
                        onCheckedChange={(e) =>
                          setDeleteAll((prevDeletedAll) => !prevDeletedAll)
                        }
                      />
                    </TableHead>
                    <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                      <span>Name</span>
                    </TableHead>
                    <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                      <span>Dates added</span>
                    </TableHead>
                    <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                      <span>Email</span>
                    </TableHead>
                    <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                      <span>Order</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data && data.length > 0 ? (
                    <>
                      {skeleton ? (
                        <SkeletonTable />
                      ) : (
                        data.map((customer, index) => (
                          <TableRow
                            key={`o-${index}`}
                            className={`grid grid-cols-12 min-h-12 cursor-default`}
                          >
                            <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-start text-base">
                              <Checkbox
                                checked={selected.includes(
                                  customer?.id.toString()
                                )}
                                onCheckedChange={() =>
                                  SetSelectedFnc(customer?.id.toString())
                                }
                              />
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium flex justify-center items-start text-base px-5">
                              <LinkBtn
                                variant="none"
                                size="none"
                                link={`/admin/customers/detail/${customer.id}`}
                              >
                                <UnderlineSpan>
                                  {customer?.first_name}&nbsp;
                                  {customer?.last_name}
                                </UnderlineSpan>
                              </LinkBtn>
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium flex justify-center items-start text-base px-5">
                              <span className="dark:text-white dark:bg-transparent truncate">
                                {customer?.created_at &&
                                  formatDate2(customer?.created_at)}
                              </span>
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex justify-center items-start font-medium text-base px-5">
                              <span className="dark:text-white dark:bg-transparent truncate">
                                {customer?.email}
                              </span>
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-start font-medium text-base px-5">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  ShowAllOrderItems(customer?.orders);
                                }}
                                className="dark:text-white dark:bg-transparent w-fit flex gap-2 px-2 py-1 bg-slate-100 
                              rounded-md justify-center items-center cursor-pointer"
                              >
                                <span className="dark:text-white dark:bg-transparent text-orange-600 font-semibold">
                                  {customer?.orders?.length > 0
                                    ? customer?.orders?.length
                                    : 0}
                                </span>
                                <span>orders</span>
                                <EllipsisVertical size={12} />
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
      </div>
    </ManagementContainer>
  );
};

export default CustomerManagement;
