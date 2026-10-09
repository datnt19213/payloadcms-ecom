import React, {useEffect, useState} from "react";
import {
  HeadingPage,
  StatusSpan,
  UnderlineSpan,
} from "../../components/elements/Elements";
import {
  Notification,
  OrderActivity,
  OrderCustomerDetail,
} from "../../components/particals";
import {Gutter} from "payload/components/elements";
import {
  CRUDContainer,
  FlexColContainer,
  FlexRowContainer,
  GridCol12,
} from "../../components/container";
import {AdminViewComponent} from "payload/config";
import {useConfig} from "payload/components/utilities";
import {Redirect} from "react-router-dom";
import {APIGet} from "../../api";
import {toast, ToastContainer} from "react-toastify";
import Default from "payload/dist/admin/components/templates/Default";
import {Modal} from "../../components/modal";
import {Obj} from "../../types";
import {RelationshipSingleField} from "../../components/fields";
import {Common, OrderStatus} from "../../common/data";
import {
  capitalizeFirstLetter,
  formatDate2,
  FormattedCurrencyWithDot,
  GetLastStringFromUrl,
  GetStatusColor,
  truncateText,
} from "../../utils";
import {Button} from "../../components/ui/button";
import {ChevronDown, ChevronLeft, ChevronUp, Pencil} from "lucide-react";
import {APIGetOrderNoAuth, APIPost, APIPostNoData} from "../../api/Core";
import {LinkBtn} from "../../components/buttons";

const OrderDetail: AdminViewComponent = ({canAccessAdmin, user}) => {
  // #region Authorize Permissions
  const {
    routes: {admin: adminRoute},
  } = useConfig();

  const isUserAuthorized = user?.roles === "admin" || user?.roles === "editor";

  if (!user || !canAccessAdmin || !isUserAuthorized) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  // #endregion

  const param = GetLastStringFromUrl();

  const [order, setOrder] = useState(null);
  const [orderCustomerDetail, setOrderCustomerDetail] = useState(null);

  const [orderStatus, setOrderStatus] = useState("");

  const [isModal, setIsModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [isExtend, setIsExtend] = useState(false);

  // #region Get param value to fetch detail order data
  const fetchData = async () => {
    if (param) {
      try {
        await APIGet(`/admin/orders/${param}`, user.token.toString()).then(
          async (response) => {
            if (response.success) {
              setOrder(response.data.order);
              await APIGetOrderNoAuth(
                response.data.order.shipping_methods[0].data.id
              ).then((res) => {
                if (res.success) {
                  setOrderCustomerDetail(res.data.data[0]);
                }
              });
            }
          }
        );
      } catch (error) {
        throw new Error(error);
      }
    } else {
      window.location.href = "/admin/collections/orders";
    }
  };
  useEffect(() => {
    fetchData();
  }, [param]);

  // #endregion

  const SetOrderStatus = (val) => {
    setOrderStatus(val.value.toString());
  };

  // #region Update order status
  const updateOrderStatus = async (value?: Obj): Promise<boolean> => {
    if (value.key == "NoExecute") {
      setIsModal(value.open);
      return true;
    }

    if (value.key == "Execute") {
      setIsLoad(true);
      try {
        await APIPostNoData(
          `/admin/orders/${param}/${orderStatus}?expand=payments`,
          user?.token.toString()
        ).then((response) => {
          if (response.success) {
            toast.success("Order status updated successfully");
            fetchData();
          } else {
            toast.error("Order status updated failed");
          }
        });
        setIsLoad(false);
        setIsModal(false);
        return true;
      } catch (error) {
        console.error("Failed to updated order", error);
        toast.error("Failed to updated order.");
      }
    } else {
      throw new Error("Key modal transering is not accepted.");
    }
    return false;
  };

  // #endregion
  return (
    <CRUDContainer title="Orders Management" toBack="/admin/collections/orders">
      <Modal
        title="Update Order"
        button2="Cancel"
        button="Confirm"
        open={isModal}
        size="lg"
        handle={updateOrderStatus}
        isLoad={isLoad}
      >
        <div className="flex flex-col justify-start w-full">
          <Gutter className="!px-5 mt-3 flex gap-3 items-center justify-start">
            <span>Current Status:&nbsp;</span>
            <StatusSpan
              color={order && order?.status && GetStatusColor(order?.status)}
              className="rounded-full"
              size="sm"
            >
              {order && capitalizeFirstLetter(order?.status)}
            </StatusSpan>
          </Gutter>
          <RelationshipSingleField
            size="fit"
            options={OrderStatus}
            onChange={SetOrderStatus}
          />
        </div>
      </Modal>

      <GridCol12 className="w-full mx-auto gap-12">
        <div className="col-span-12 xl:col-span-9 gap-12 rounded-lg w-full flex flex-col justify-start">
          <div className="w-full shadow-md flex flex-col justify-start p-7 gap-7 rounded-lg ring-1 ring-gray-100">
            <div className="w-full h-fit flex flex-col justify-start border-b pb-3 border-gray-300">
              <div className="w-full flex justify-between">
                <div className="w-fit flex-nowrap items-center">
                  <span className="font-semibold text-lg">
                    Order ID&nbsp;&nbsp;&nbsp;
                  </span>
                  <span className="font-semibold text-lg">
                    #{order && order?.id}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusSpan
                    className="rounded-full"
                    size="sm"
                    color={
                      order && order?.status && GetStatusColor(order?.status)
                    }
                  >
                    {order && capitalizeFirstLetter(order?.status)}
                  </StatusSpan>
                  {order && order?.status != Common.cancel && (
                    <Button
                      className="rounded-full p-1.5"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        order &&
                        order?.status != Common.cancel &&
                        setIsModal(true)
                      }
                    >
                      <Pencil strokeWidth={1.5} size={12} />
                    </Button>
                  )}
                </div>
              </div>
              <span>{order ? formatDate2(order?.created_at) : "-"}</span>
            </div>
            {/* product */}
            <div className="pt-7">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Products</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full relative p-2 h-10 w-10 aspect-square ${
                    isExtend ? "rotate-180" : ""
                  } transform transition-all duration-1000`}
                  onClick={() => setIsExtend(!isExtend)}
                >
                  <ChevronUp
                    size={12}
                    className={`${
                      isExtend ? "-translate-y-1/2" : "translate-y-1"
                    } transition-all duration-700 ease-in-out transform absolute`}
                  />
                  <ChevronDown
                    size={12}
                    className={`${
                      isExtend ? "translate-y-1/2" : "-translate-y-1"
                    } transition-all duration-700 ease-in-out transform absolute`}
                  />
                </Button>
              </div>
              <div
                className={`overflow-x-scroll overflow-y-hidden py-5 scrollbar-thin ${
                  isExtend ? "h-max" : "h-32"
                } transition-all transform duration-200`}
              >
                <div className="h-fit">
                  {order &&
                    order?.items &&
                    order?.items.length > 0 &&
                    order?.items.map((item, index) => (
                      <div
                        key={index}
                        className="w-full grid grid-cols-12 gap-5 h-20"
                      >
                        <div className="w-auto flex justify-center items-center col-span-1 h-20">
                          <img
                            src={item?.thumbnail}
                            alt={item?.title}
                            className="object-cover h-20"
                          />
                        </div>
                        <div className="w-full h-full col-span-9 flex flex-col items-start justify-start">
                          <LinkBtn
                            link={`/admin/products/detail?id=${item?.id}`}
                            variant="none"
                            size="none"
                          >
                            <UnderlineSpan className="font-semibold text-base text-wrap tracking-tight">
                              {item?.title && truncateText(item?.title)}
                            </UnderlineSpan>
                          </LinkBtn>
                          <span className="text-sm tracking-tight text-wrap">
                            Quantity:&nbsp;
                            {item?.quantity && item?.quantity}
                          </span>
                        </div>
                        <div className="w-full col-span-2 flex flex-col items-center justify-start">
                          <span className="font-bold text-base tracking-tight">
                            {item?.total &&
                              FormattedCurrencyWithDot(item?.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {order && FormattedCurrencyWithDot(order?.subtotal)}&nbsp;
                  {order > order?.currency_code.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="font-semibold">
                  {order && FormattedCurrencyWithDot(order?.discount_total)}
                  &nbsp;
                  {order > order?.currency_code.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">
                  {order && FormattedCurrencyWithDot(order?.shipping_total)}
                  &nbsp;
                  {order > order?.currency_code.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between  text-lg font-semibold py-5 border-t border-gray-300">
                <span>Total</span>
                <span className="font-semibold">
                  {order && FormattedCurrencyWithDot(order?.total)}&nbsp;
                  {order > order?.currency_code.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          {/* customer detail */}
          <OrderCustomerDetail
            order={order}
            orderCustomerDetail={orderCustomerDetail}
          />
        </div>
        {/* right side */}
        <OrderActivity orderCustomerDetail={orderCustomerDetail} />
      </GridCol12>
    </CRUDContainer>
  );
};

export default OrderDetail;
