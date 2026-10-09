import React, {FC} from "react";
import {toast, ToastContainer, ToastOptions} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom";
interface Toast {
  position?:
    | "top-right"
    | "bottom-right"
    | "top-left"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}
export const ToastNotify: FC<Toast> = ({position = "top-right"}) => {
  let isPos =
    position === "top-right"
      ? "!top-0 !right-0"
      : position === "top-left"
        ? "!top-0 !left-0"
        : position === "top-center"
          ? "!top-0"
          : position === "bottom-right"
            ? "!bottom-0 !right-0"
            : position === "bottom-left"
              ? "!bottom-0 !left-0"
              : position === "bottom-center"
                ? "!bottom-0"
                : "!top-0";
  return (
    <>
      {ReactDOM.createPortal(
        <ToastContainer
          className={`!z-[999] ${isPos}`}
          style={{
            position: "fixed",
            zIndex: 999,
            left: "1rem",
            top: "1rem",
            width: "fit-content",
          }}
          position={`${position}`}
        />,
        document.body
      )}
    </>
  );
};

export const notify = {
  success: (message: string, options: ToastOptions = {}) => {
    toast.success(message, {
      ...options,
      style: {gap: "2rem"},
      autoClose: 2000,
      position: "top-left",
      className: "shadow-lg",
    });
  },
  warning: (message: string, options: ToastOptions = {}) => {
    toast.warn(message, {
      ...options,
      style: {gap: "2rem"},
      autoClose: 2000,
      position: "top-left",
      className: "shadow-lg",
    });
  },
  error: (message: string, options: ToastOptions = {}) => {
    toast.error(message, {
      ...options,
      style: {gap: "2rem"},
      autoClose: 2000,
      position: "top-left",
      className: "shadow-lg",
    });
  },
  info: (message: string, options: ToastOptions = {}) => {
    toast.info(message, {
      ...options,
      style: {gap: "2rem"},
      autoClose: 2000,
      position: "top-left",
      className: "shadow-lg",
    });
  },
  default: (message: string, options: ToastOptions = {}) => {
    toast(message, {
      ...options,
      style: {gap: "2rem"},
      autoClose: 2000,
      position: "top-left",
      className: "shadow-lg",
    });
  },
};
