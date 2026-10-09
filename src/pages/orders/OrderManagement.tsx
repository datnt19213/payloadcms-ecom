import React, {useEffect, useState} from "react";
import {Gutter} from "payload/components/elements";
// import {productApi} from "../../api";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {Enum} from "../../common/data";
import {Button} from "../../components/ui/button";
import {SkeletonDynamics, SkeletonTable} from "../../components/skeleton";
import {Checkbox} from "../../components/ui/checkbox";
import {useAuth} from "payload/components/utilities";
import {NoDataAvailableTable} from "../../components/empty/Empty";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Modal} from "../../components/modal";
import {APIDelete, APIGet} from "../../api";
import {ItemLinkList} from "../../components/elements";
import {HeadingPage, UnderlineSpan} from "../../components/elements/Elements";
import {
  FilterComp,
  Notification,
  Paginations,
} from "../../components/particals";
import {
  capitalizeFirstLetter,
  DateISOToYYYYMMDD,
  formatDate2,
  FormattedCurrencyWithDot,
} from "../../utils";
import {EllipsisVertical, Eye, Filter} from "lucide-react";
import {GridCol12, ManagementContainer} from "../../components/container";
import {IOutputData, Obj} from "../../types";
import {LinkBtn} from "../../components/buttons";
import {RelationshipSingleField} from "../../components/fields";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  email: string;
  token: string;
}

const OrderManagement = () => {
  const {user} = useAuth<User>();
  const [data, setData] = useState([]);
  const [dataAfterFilter, setDataAfterFilter] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [deletedAll, setDeleteAll] = useState<boolean>(false);

  const [productItems, setProductItems] = useState([]);

  const [isModalList, setIsModalList] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const ShowAllProductItems = (products: any) => {
    setProductItems(products);
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

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  // #region Get all orders
  const getProduct = async () => {
    setSkeleton(true);
    try {
      const response = await APIGet(
        `/admin/orders?limit=10&offset=${(currentPage - 1) * 10}`,
        user?.token
      );
      setTotalPage(Math.ceil(response.data.count / 10));
      setData(response.data.orders);
      setDataAfterFilter(response.data.orders);
      setSkeleton(false);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setSkeleton(false);
    }
  };
  useEffect(() => {
    getProduct();
  }, [currentPage]);
  // #endregion

  // #region Select all rows
  useEffect(() => {
    const selectAllRows = () => {
      if (deletedAll && data.length > 0) {
        let arr = [];
        data.forEach((order) => arr.push(order?.id));
        setSelected(arr);
      } else {
        setSelected([]);
      }
    };

    selectAllRows();
  }, [deletedAll]);
  // #endregion

  // #region Delete Function
  const deleteSelectedOrders = async (val) => {
    if (val.key === "NoExecute") {
      setIsModal(val.open);
      return;
    }
    if (val.key === "Execute") {
      setIsLoad(true);
      try {
        if (deletedAll) {
          const deleteRequests = data.map((product) =>
            APIDelete("/admin/orders?expand=payments", product?.id, user.token)
          );
          await Promise.all(deleteRequests);
          toast.success("All orders deleted successfully.");
          setIsModal(val);
        } else {
          const deleteRequests = selected.map((id) =>
            APIDelete("/admin/orders", id, user.token)
          );
          await Promise.all(deleteRequests);
          toast.success("Selected orders deleted successfully.");
          setIsModal(val.open);
        }

        const updateDatas = data.filter((data) => !selected.includes(data.id));
        setData(updateDatas);
        setIsLoad(false);
        setIsModal(false);
        setSelected([]);
        setDeleteAll(false);
      } catch (error) {
        console.error("Failed to delete selected orders", error);
        toast.error("Failed to delete selected orders.");
      }
    } else {
      throw new Error("Key modal transering is not accepted.");
    }
  };

  // #endregion

  // #region Handle output filter data
  const GetOutputFilter = (output?: IOutputData) => {
    let arr = [...data];

    if (output.amounts.from > 0) {
      arr = arr.filter(
        (order) => output.amounts.from <= order?.payments[0].amount
      );
    }
    if (output.amounts.to > 0) {
      arr = arr.filter(
        (order) => output.amounts.to >= order?.payments[0].amount
      );
    }

    if (output.orderStatus.length > 0) {
      arr = arr.filter((order) => output.orderStatus.includes(order?.status));
    }
    if (output.paymentStatus.length > 0) {
      arr = arr.filter((order) =>
        output.paymentStatus.includes(order?.payment_status)
      );
    }
    if (output.dates.from) {
      const dateFrom = new Date(output.dates.from).getTime();
      arr = arr.filter(
        (order) => new Date(order.created_at).getTime() >= dateFrom
      );
    }

    if (output.dates.to) {
      const dateTo = new Date(output.dates.to).getTime();
      arr = arr.filter(
        (order) => new Date(order.created_at).getTime() <= dateTo
      );
    }

    if (
      output.amounts.from == 0 &&
      output.amounts.to == 0 &&
      output.orderStatus.length == 0 &&
      output.paymentStatus.length == 0 &&
      !output.dates.from &&
      !output.dates.to
    ) {
      setDataAfterFilter(data);
    } else {
      setDataAfterFilter(arr);
    }
  };
  // #endregion

  return (
    <ManagementContainer title="Orders Management" maxWidth={true}>
      {/* Modal popup */}
      <Modal
        title="Are you sure to delete?"
        button2="Cancel"
        button="Delete"
        open={isModal}
        handle={deleteSelectedOrders}
        isLoad={isLoad}
      />
      <Modal
        title="All Products"
        button2="Cancel"
        open={isModalList}
        handle={handleActionModal}
        size="xl"
      >
        <div className="flex flex-col w-full min-h-96 overflow-x-scroll py-8">
          <Table className="min-w-fit">
            <TableHeader>
              <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                  <span>Name</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Image</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Quantity</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Price</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Category</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productItems?.length > 0 &&
                productItems?.map((productItem, i) => (
                  <TableRow
                    key={i}
                    className="grid grid-cols-12 min-h-12 hover:bg-gray-50 transition-all"
                  >
                    <TableCell className="dark:text-white dark:bg-transparent col-span-4 font-medium flex justify-start items-start text-base px-5">
                      <ItemLinkList
                        key={productItem.id}
                        link={`/admin/products/edit/${productItem.id}`}
                      >
                        {productItem.title}
                      </ItemLinkList>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium overflow-x-hidden flex justify-center items-start text-base px-5">
                      <div className="h-12 flex justify-center col-span-2 items-start">
                        <img
                          src={`${productItem.thumbnail}`}
                          alt={productItem.title}
                          className="h-12 w-auto"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium overflow-x-hidden flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {productItem.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium overflow-x-hidden flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-2 truncate px-3 py-1.5">
                        {productItem.unit_price &&
                          FormattedCurrencyWithDot(productItem.unit_price)}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium overflow-x-hidden flex justify-center items-start text-base px-5">
                      <span className="text-start col-span-3 truncate px-3 py-1.5">
                        {productItem.variant.title}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Modal>

      {/* Order Page */}
      <div className="w-full">
        <div className="dark:text-white dark:bg-transparent w-full px-8 flex justify-between">
          <div className="dark:text-white dark:bg-transparent flex justify-end items-center gap-5">
            {/* <LinkBtn link="/admin/orders/create" variant="default">
              New Order
            </LinkBtn> */}
          </div>
          <div className="dark:text-white dark:bg-transparent flex justify-end items-center gap-5">
            {(selected.length > 0 || deletedAll) && (
              <Button
                variant="default"
                className="dark:text-white dark:bg-transparent bg-red-600 animate-fade text-base"
                onClick={() => setIsModal(true)}
              >
                Delete all selected
              </Button>
            )}
            <Button
              variant="ghost"
              className="text-base"
              onClick={() => {
                setSelected([]), setDeleteAll(false);
              }}
            >
              Unselect all
            </Button>

            <span className="dark:text-white dark:bg-transparent font-semibold tracking-tight text-base">
              <span className="text-orange-500">{selected.length}</span>
              &nbsp;rows selected
            </span>
            <Button
              variant="ghost"
              className="ml-7 justify-between flex items-center text-base gap-3"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <Filter strokeWidth={1.5} size={20} />
            </Button>
          </div>
        </div>
        <FilterComp showFilter={showFilter} outputFnc={GetOutputFilter} />
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
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Customer</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center">
                  <span>Status</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Payment Method</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Products</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Created At</span>
                </TableHead>
                <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                  <span>Total</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataAfterFilter && dataAfterFilter.length > 0 ? (
                <>
                  {skeleton ? (
                    <SkeletonDynamics
                      layout="table-row"
                      columnCount={1}
                      count={5}
                      itemClassName="!h-4 w-full rounded-full"
                      rowClassName="p-3 w-full flex justify-center items-center"
                    />
                  ) : (
                    dataAfterFilter.map((order, index) => (
                      <TableRow
                        key={`o-${index}`}
                        className={`grid grid-cols-12 min-h-12 cursor-default`}
                      >
                        <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base pr-4">
                          <Checkbox
                            checked={selected.includes(order?.id.toString())}
                            onCheckedChange={() =>
                              SetSelectedFnc(order?.id.toString())
                            }
                          />
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium overflow-x-hidden flex justify-start items-center text-base px-5">
                          <LinkBtn
                            variant="none"
                            size="none"
                            link={`/admin/orders/detail/${order?.id}`}
                          >
                            <UnderlineSpan>
                              {order?.customer.email
                                ? order?.customer.email
                                : "Unknown email"}
                            </UnderlineSpan>
                          </LinkBtn>
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base px-5">
                          <span
                            className={`dark:text-white dark:bg-transparent truncate px-2 rounded-full overflow-x-hidden  ${
                              order?.status == "completed"
                                ? "bg-green-200 text-green-700"
                                : order?.status == "pending"
                                  ? "bg-yellow-200 text-yellow-700"
                                  : "bg-red-200 text-red-700"
                            }`}
                          >
                            {order?.status}
                          </span>
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex overflow-x-hidden justify-center items-center font-medium text-base px-5">
                          <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                            {order?.payments[0]?.metadata?.payment_service_name
                              ? capitalizeFirstLetter(
                                  order?.payments[0]?.metadata
                                    ?.payment_service_name
                                )
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex overflow-x-hidden justify-center items-center font-medium text-base px-5">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              ShowAllProductItems(order.items);
                            }}
                            className="dark:text-white dark:bg-transparent w-fit flex gap-2 px-2 py-1 bg-slate-100 
                              rounded-md justify-center items-center cursor-pointer"
                          >
                            <span className="dark:text-white dark:bg-transparent text-orange-600 font-semibold">
                              {order?.items.length}
                            </span>
                            <span>Products</span>
                            <EllipsisVertical size={12} />
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 overflow-x-hidden flex justify-center items-center font-medium text-base px-5">
                          <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                            {order?.created_at
                              ? formatDate2(order?.created_at)
                              : "-/-/-"}
                          </span>
                        </TableCell>
                        <TableCell className="dark:text-white dark:bg-transparent col-span-2 overflow-x-hidden flex justify-center items-center font-medium text-base px-5">
                          <span className="dark:text-white dark:bg-transparent truncate overflow-x-hidden ">
                            {order?.payments[0].amount
                              ? FormattedCurrencyWithDot(
                                  order?.payments[0].amount
                                )
                              : "-/-/-"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              ) : skeleton ? (
                <SkeletonDynamics
                  layout="table-row"
                  columnCount={1}
                  count={5}
                  itemClassName="!h-4 w-full rounded-full"
                  rowClassName="p-3 w-full flex justify-center items-center"
                />
              ) : (
                <NoDataAvailableTable />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Paginations
        totalPages={totalPage}
        currentPage={currentPage}
        onPageChange={handlePagination}
      />
      <ToastContainer position="top-right" />
    </ManagementContainer>
  );
};

export default OrderManagement;
