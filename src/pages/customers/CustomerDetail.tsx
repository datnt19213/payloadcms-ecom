import React, {useEffect, useState} from "react";
import {useConfig} from "payload/components/utilities";
import {AdminViewComponent} from "payload/config";
import {Redirect} from "react-router-dom";
import {
  GridCol12,
  GridCol2,
  GridColAutoCol,
  GridColAutoRow,
} from "../../components/container";
import {Gutter} from "payload/components/elements";
import {Notification} from "../../components/particals";
import {Button} from "../../components/ui/button";
import {Clipboard, Ellipsis, EllipsisVertical, Pencil} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  formatDate2,
  FormattedCurrencyWithDot,
  GetLastStringFromUrl,
  GetStatusColor,
} from "../../utils";
import {NoDataAvailableTable} from "../../components/empty/Empty";
import {SkeletonTable} from "../../components/skeleton";
import {LinkBtn} from "../../components/buttons";
import {APIGet, APIPost} from "../../api";
import {
  CopyClipboard,
  HeadingPage,
  StatusSpan,
} from "../../components/elements";
import {Common} from "../../common/data";
import {capitalizeAllLetter} from "../../utils/util/capitalizeString";
import Default from "payload/dist/admin/components/templates/Default";
import {toast, ToastContainer} from "react-toastify";
import {Modal} from "../../components/modal";
import {Obj} from "../../types";
import {TextField, TextInactiveField} from "../../components/fields";
import "react-toastify/dist/ReactToastify.css";

const StickyBox = React.lazy(() => import("react-sticky-box"));

const CustomerDetail: AdminViewComponent = ({canAccessAdmin, user}) => {
  // #region Authorize Permissions

  const {
    routes: {admin: adminRoute},
  } = useConfig();

  const isUserAuthorized = user?.roles === "admin" || user?.roles === "editor";

  if (!user || !canAccessAdmin || !isUserAuthorized) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  // #endregion

  const [param, setParam] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [customeremail, setCustomerEmail] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [data, setData] = useState([]);
  const [skeleton, setSkeleton] = useState(true);

  const [isModal, setIsModal] = useState(false);
  const [load, setLoad] = useState(false);

  // #region Get param value from url
  useEffect(() => {
    const getParam = () => {
      const data = GetLastStringFromUrl();
      if (data) setParam(data);
    };

    getParam();
  }, []);

  // #endregion

  const fetchData = async () => {
    try {
      setSkeleton(true);
      if (param) {
        const orders = await APIGet(
          `/admin/orders?customer_id=${param}&fields=total,status`,
          user?.token.toString()
        );

        if (orders.success) {
          setData(orders.data.orders);
          setCustomerId(orders.data.orders[0]?.customer?.id);
          setCustomerEmail(orders.data.orders[0]?.customer?.email);
          setFirstName(orders.data.orders[0]?.customer?.first_name);
          setLastName(orders.data.orders[0]?.customer?.last_name);
          setPhone(orders.data.orders[0]?.customer?.phone);
          setSkeleton(false);
        }
      }
    } catch (error) {
      setSkeleton(false);
      throw new Error(error);
    }
    setSkeleton(false);
  };

  useEffect(() => {
    fetchData();
  }, [param]);

  // #region Onchange field modal popup

  const FirstNameOnChange = (val: any) => {
    setFirstName(val);
  };
  const LastNameOnChange = (val: any) => {
    setLastName(val);
  };
  const PhoneOnChange = (val: any) => {
    setPhone(val);
  };

  // #endregion

  // #region Update customer information
  const handleEditInformation = async (val: Obj) => {
    if (val.key == "NoExecute") {
      setIsModal(val.open);
      return true;
    }
    if (val.key === "Execute") {
      try {
        setLoad(true);
        let dataForm = {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        };
        if (customerId) {
          await APIPost(
            `/admin/customers/${customerId}`,
            dataForm,
            user?.token.toString()
          ).then((response) => {
            if (response.success) {
              toast.success("Customer information updated successfully");
              fetchData();
            } else {
              toast.error("Customer information updated failed");
            }
            setLoad(false);
            setIsModal(false);
          });
          return true;
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    return false;
  };
  // #endregion

  return (
    <Default>
      <Notification />
      <Gutter className="py-12">
        <Modal
          title="Edit Information"
          handle={handleEditInformation}
          open={isModal}
          button="Submit"
          button2="Cancel"
          isLoad={load}
          size="lg"
        >
          <div className="w-full flex flex-col gap-7 px-3">
            <GridCol2 className="gap-7 w-full">
              <div className="col-span-1">
                <TextField
                  title="First Name"
                  className="col-span-1"
                  onChange={FirstNameOnChange}
                  data={firstName}
                />
              </div>
              <div className="col-span-1">
                <TextField
                  title="Last Name"
                  className="col-span-1"
                  onChange={LastNameOnChange}
                  data={lastName}
                />
              </div>
            </GridCol2>
            <GridCol2 className="gap-7 w-full">
              <div className="col-span-1">
                <TextInactiveField
                  title="Email"
                  className="col-span-1"
                  data={customeremail}
                />
              </div>
              <div className="col-span-1">
                <TextField
                  title="Phone"
                  className="col-span-1"
                  onChange={PhoneOnChange}
                  data={phone}
                />
              </div>
            </GridCol2>
          </div>
        </Modal>
        <HeadingPage className="text-xl">
          Orders&nbsp;{data?.length > 0 && data.length}
        </HeadingPage>
        <GridCol12 className="gap-7">
          <div className="col-span-12 xl:col-span-9 flex flex-col gap-5">
            <div className="dark:text-white dark:bg-transparent w-full overflow-x-scroll p-8 scrollbar-thin bg-transparent">
              <div className="dark:text-white dark:bg-transparent mx-auto w-full rounded-lg shadow-lg flex justify-center max-w-[2156px] animate-slowfade min-w-[900px]">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:text-white dark:bg-transparent grid grid-cols-12 min-h-8">
                      <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-2 font-semibold text-base text-center">
                        <span>Images</span>
                      </TableHead>
                      <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                        <span>Date</span>
                      </TableHead>
                      <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                        <span>Status</span>
                      </TableHead>
                      <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                        <span>Total</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data && data.length > 0 ? (
                      <>
                        {skeleton ? (
                          <SkeletonTable />
                        ) : (
                          data.map((order, index) => (
                            <LinkBtn
                              key={`o-${index}`}
                              variant="none"
                              size="none"
                              className="cursor-pointer"
                              link={`/admin/orders/detail/${order?.id}`}
                            >
                              <TableRow
                                className={`grid grid-cols-12 min-h-12 cursor-pointer`}
                              >
                                <TableCell className="dark:text-white dark:bg-transparent col-span-2 font-medium flex justify-center items-start text-base px-5">
                                  {order?.items && order?.items?.length > 0 && (
                                    <img
                                      src={order?.items[0]?.thumbnail}
                                      alt="image-cus-detail"
                                      className="dark:text-white dark:bg-transparent h-12 w-auto "
                                    />
                                  )}
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 font-medium flex justify-center items-start text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate">
                                    {order?.created_at &&
                                      formatDate2(order?.created_at)}
                                  </span>
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-4 flex justify-center items-start font-medium text-base px-5">
                                  <StatusSpan
                                    size="sm"
                                    color={
                                      order?.status &&
                                      GetStatusColor(order?.status)
                                    }
                                  >
                                    {order?.status && order?.status}
                                  </StatusSpan>
                                </TableCell>
                                <TableCell className="dark:text-white dark:bg-transparent col-span-2 flex justify-center items-start font-medium text-base px-5">
                                  <span className="dark:text-white dark:bg-transparent truncate">
                                    {order?.total &&
                                      FormattedCurrencyWithDot(order?.total)}
                                    &nbsp;
                                    {order?.payments &&
                                      order?.payments?.length > 0 &&
                                      capitalizeAllLetter(
                                        order?.payments[0].currency_code
                                      )}
                                  </span>
                                </TableCell>
                              </TableRow>
                            </LinkBtn>
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
          <div className="col-span-12 xl:col-span-3 flex flex-col justify-start items-start gap-7 pt-[1.625rem]">
            <StickyBox className="flex flex-col justify-start items-start w-full p-7 shadow-md h-fit rounded-md">
              <div className="flex justify-between items-center gap-2 w-full">
                <span className="text-lg font-semibold text-gray-900 tracking-tight">
                  Customer
                </span>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsModal(true)}
                  >
                    <Pencil
                      size={14}
                      strokeWidth={1.3}
                      className="text-gray-900"
                      xlinkTitle="Edit Customer Information"
                    />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="text-gray-900 w-full">
                  {data && data.length > 0 && data[0]?.customer?.first_name}
                  &nbsp;
                  {data && data.length > 0 && data[0]?.customer?.last_name}
                </span>
                <div className="flex items-center justify-between w-full gap-2">
                  <span className="text-blue-600 hover:underline">
                    {data && data.length > 0 && data[0]?.customer?.email}
                  </span>
                  <CopyClipboard
                    copyData={
                      data && data.length > 0 && data[0]?.customer?.email
                    }
                  />
                </div>
                <span className="text-gray-900">
                  {data && data.length > 0 && data[0]?.customer?.phone}
                </span>
              </div>
            </StickyBox>
          </div>
        </GridCol12>
        <ToastContainer position="top-right" />
      </Gutter>
    </Default>
  );
};

export default CustomerDetail;
