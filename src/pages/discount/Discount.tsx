import React, { useEffect, useRef, useState } from "react";
import { ManagementContainer } from "../../components/container";
import Modal from "./components/Modal";

import { APIDelete, APIGet } from "../../api";

import { useAuth } from "payload/components/utilities";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover"; // Thêm các import cần thiết
import { SkeletonTable } from "../../components/skeleton";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import { Modal as DeleteModal } from "../../components/modal";
import { Redirect } from "react-router-dom";
import { LinkBtn } from "../../components/buttons";
import { StatusSpan } from "../../components/elements";
import { capitalizeFirstLetter, GetStatusColor } from "../../utils";

interface User {
  id: number;
  email: string;
  token: string;
}

const Discount = () => {
  const { user } = useAuth<User>();

  const [showModal, setShowModal] = useState(false);
  const [discounts, setDiscounts] = useState([]);

  const [isModal, setIsModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [deleteDiscountId, setDeleteDiscountId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState({});
  const popoverRef = useRef({});

  const [skeleton, setSkeleton] = useState(true);

  const handleShow = (val: boolean) => {
    setShowModal(val);
  };

  const fetchDiscounts = async () => {
    try {
      const response = await APIGet("/admin/discounts", user?.token);
      setDiscounts(response.data.discounts);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleDelete = async (val) => {
    if (val.key === "NoExecute") {
      setIsModal(val.open);
      return true;
    }
    if (val.key === "Execute") {
      setIsLoad(true);
      try {
        await APIDelete(`/admin/discounts/`, deleteDiscountId, user?.token);
        fetchDiscounts();
        setIsModal(false);
      } catch (error) {
        console.error("Error deleting discount:", error);
      } finally {
        setIsLoad(false);
      }
    }
  };

  const togglePopover = (discountId) => {
    setPopoverOpen((prev) => ({
      ...prev,
      [discountId]: !prev[discountId],
    }));
  };

  const handleClickOutside = (event) => {
    Object.keys(popoverRef.current).forEach((key) => {
      if (
        popoverRef.current[key] &&
        !popoverRef.current[key].contains(event.target)
      ) {
        setPopoverOpen((prev) => ({
          ...prev,
          [key]: false,
        }));
      }
    });
  };

  useEffect(() => {
    fetchDiscounts();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <DeleteModal
        title="Are you sure to delete?"
        button2="Cancel"
        button="Delete"
        open={isModal}
        handle={handleDelete}
        isLoad={isLoad}
      />
      <ManagementContainer
        title="Discount"
        className="!max-w-[1296px] !mx-auto"
      >
        <div className="bg-card text-foreground">
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={() => handleShow(true)}
              className="relative bg-secondary text-secondary-foreground px-6 py-2 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 hover:bg-secondary/90 focus:outline-none focus:ring-4 focus:ring-ring"
            >
              <span className="pr-2">+</span> Add Discount
            </button>
          </div>
          <div className="overflow-x-auto bg-card shadow-md rounded-lg">
            {discounts && discounts.length > 0 ? (
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-lg text-left">Code</th>
                    <th className="px-4 py-2 text-lg text-left">Description</th>
                    <th className="px-4 py-2 text-lg text-center">Amount</th>
                    <th className="px-4 py-2 text-lg text-center">Status</th>
                    <th className="px-4 py-2 text-lg text-center">
                      Redemptions
                    </th>
                    <th className="px-4 py-2 text-lg text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {discounts.map((discount) => (
                    <tr key={discount.id}>
                      <td className="px-4 py-2 text-lg">{discount.code}</td>
                      <td className="px-4 py-2 text-lg">
                        {discount.rule.description}
                      </td>
                      <td className="px-4 py-2 text-lg text-center">
                        {discount.rule.type === "fixed"
                          ? formatCurrency(discount.rule.value)
                          : `${discount.rule.value}%`}
                      </td>
                      <td className="px-4 py-2 text-lg flex items-center justify-center">
                        <StatusSpan
                          className="!bg-opacity-0"
                          color={
                            discount.is_disabled == false
                              ? GetStatusColor("completed")
                              : GetStatusColor("canceled")
                          }
                          dotSize="lg"
                        >
                          {discount.is_disabled ? "Disabled" : "Active"}
                        </StatusSpan>
                      </td>
                      <td className="px-4 py-2 text-lg text-center">
                        {discount.usage_count}
                      </td>
                      <td className="px-4 py-2 text-lg text-center">
                        <Popover open={popoverOpen[discount.id] || false}>
                          <PopoverTrigger asChild>
                            <button
                              className="p-2 hover:bg-gray-200 rounded-full"
                              onClick={() => togglePopover(discount.id)}
                              ref={(el) =>
                                (popoverRef.current[discount.id] = el)
                              }
                            >
                              <HiOutlineDotsHorizontal size={24} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="bg-white rounded-lg shadow-lg">
                            <div className="flex flex-col">
                              <LinkBtn
                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                                link={`/admin/discount/edit/${discount?.id}`}
                              >
                                <FaRegEdit className="mr-2" /> Edit
                              </LinkBtn>
                              <button
                                className="flex items-center px-4 py-2 mt-1 text-red-500 hover:bg-red-100 w-full"
                                onClick={() => {
                                  setDeleteDiscountId(discount.id);
                                  setIsModal(true);
                                }}
                              >
                                <RiDeleteBin6Line className="mr-2" /> Delete
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <DiscountSkeleton />
            )}
          </div>
        </div>
      </ManagementContainer>
      {showModal && (
        <Modal handleShow={handleShow} fetchDiscounts={fetchDiscounts} />
      )}
    </>
  );
};

const DiscountSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        <div className="bg-card shadow rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="col-span-6 sm:col-span-1">
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-4 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discount;
