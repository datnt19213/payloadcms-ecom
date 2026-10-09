import {ChevronUp} from "lucide-react";
import React, {useState} from "react";
import {capitalizeFirstLetter} from "../../utils";

const OrderCustomerDetail = ({order, orderCustomerDetail}) => {
  const [showCustomerInfo, setShowCustomerInfo] = useState(true);

  return (
    <div className="w-full p-7 shadow-md rounded-lg ring-1 ring-gray-100">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setShowCustomerInfo(!showCustomerInfo)}
      >
        <span className="font-semibold text-lg select-none">
          Customer details
        </span>
        <ChevronUp
          className={`${
            showCustomerInfo ? "rotate-180" : ""
          } transform transition-all duration-200`}
        />
      </div>
      <div
        className={`${
          showCustomerInfo ? "h-0 invisible mt-0" : "h-[12rem] visible mt-5"
        } transition-all transform duration-500 overflow-hidden w-full mt-5 grid grid-cols-1 lg:grid-cols-2 gap-7 border-t border-gray-300`}
      >
        <div className="w-full col-span-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-5">
            <span className="col-span-1">Name</span>
            <span className="col-span-1">
              {orderCustomerDetail ? orderCustomerDetail?.address_to.name : "-"}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-5">
            <span className="col-span-1">Email</span>
            <span className="col-span-1">
              {order ? order?.customer.email : "-"}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-5">
            <span className="col-span-1">Address from</span>
            <div className="col-span-1 text-wrap">
              {orderCustomerDetail
                ? orderCustomerDetail?.address_from.ward +
                  ", " +
                  orderCustomerDetail?.address_from.district +
                  ", " +
                  orderCustomerDetail?.address_from.city
                : "-"}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-5">
            <span className="col-span-1">Address to</span>
            <div className="col-span-1 text-wrap">
              {orderCustomerDetail
                ? orderCustomerDetail?.address_to.ward +
                  ", " +
                  orderCustomerDetail?.address_to.district +
                  ", " +
                  orderCustomerDetail?.address_to.city
                : "-"}
            </div>
          </div>
        </div>
        <div className="w-full col-span-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-5">
            <span className="col-span-1">Mobile</span>
            <span className="col-span-1">
              {order ? order?.customer?.phone : "-"}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-5">
            <span className="col-span-1">Payment</span>
            <span className="col-span-1">
              {order?.payments[0]?.metadata?.payment_service_name
                ? capitalizeFirstLetter(
                    order.payments[0]?.metadata?.payment_service_name
                  )
                : "-"}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-5">
            <span className="col-span-1">Status</span>
            <span className="col-span-1">
              {order && order?.payment_status
                ? capitalizeFirstLetter(order.payment_status)
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomerDetail;
