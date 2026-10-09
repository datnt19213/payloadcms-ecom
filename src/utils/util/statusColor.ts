/**
 * Color definitions
 * @param completed - (`#28a745` Green):** Success or finished.
 * @param canceled - (`#dc3545` Red):** Stopped or aborted.
 * @param pending - (`#ffc107` Yellow):** Waiting or in progress.
 * @param archived - (`#6c757d` Gray):** Inactive or stored.
 * @param requires_action - (`#007bff` Blue):** Needs attention.
 * @param refunded - (`#28a745` Green):** Money returned.
 * @param partially_refunded - (`#8bc34a` Light Green):** Partial return.
 * @param captured - (`#28a745` Green):** Payment processed.
 * @param awaiting - (`#ffc107` Yellow):** Waiting for next step.
 * @param not_paid - (`#c82333` Dark Red):** Payment not received.
 *
 * @param status - Status to return color
 * @returns - Return colors
 */

import {FC} from "react";

interface Status {
  status:
    | "completed"
    | "canceled"
    | "pending"
    | "archived"
    | "requires_action"
    | "refunded"
    | "partially_refunded"
    | "captured"
    | "awaiting"
    | "not_paid"
    | "white";
}

export const GetStatusColor = (status: Status["status"] = "white"): string => {
  return status === "completed"
    ? "bg-SGreen"
    : status === "canceled"
      ? "bg-SRed"
      : status === "pending"
        ? "bg-SYellow"
        : status === "archived"
          ? "bg-SGray"
          : status === "requires_action"
            ? "bg-SBlue"
            : status === "refunded"
              ? "bg-SGreen"
              : status === "partially_refunded"
                ? "bg-SLightGreen"
                : status === "captured"
                  ? "bg-SGreen"
                  : status === "awaiting"
                    ? "bg-SYellow"
                    : status === "not_paid"
                      ? "bg-SDarkRed"
                      : "bg-SLightGray";
};
