import React from "react";
import {NoDataAvailable} from "../empty";

const OrderActivity = ({orderCustomerDetail}) => {
  return (
    <div className="col-span-12 xl:col-span-3 shadow-md w-full p-7 rounded-lg ring-1 flex flex-col gap-5 ring-gray-100 h-fit">
      <span className="font-semibold text-lg">Activity</span>
      <div className="flex flex-col justify-start items-start w-full">
        <div className="flex gap-5 justify-start items-start w-full">
          {orderCustomerDetail && orderCustomerDetail?.history?.length > 0 ? (
            orderCustomerDetail?.history.map((item, index) => (
              <div
                key={index}
                className={`${
                  orderCustomerDetail &&
                  orderCustomerDetail.history.length - 1 === index
                    ? "opacity-100"
                    : "opacity-50"
                } w-full flex justify-start items-start border-l border-gray-400 pb-5 gap-7`}
              >
                <div className="h-4 w-4 -translate-x-2 rounded-full bg-white flex justify-center items-center shadow-md">
                  <span className="rounded-full h-2 w-2 bg-blue-600 transform" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">
                    {item?.updated_at ? item.updated_at : "-/-/-"}
                  </span>
                  <div className="mt-3 flex flex-col gap-1">
                    <span className="font-semibold text-gray-900">
                      {item?.status_text ? item.status_text : "-"}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({item?.status_desc ? item.status_desc : "-"})
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoDataAvailable />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderActivity;
