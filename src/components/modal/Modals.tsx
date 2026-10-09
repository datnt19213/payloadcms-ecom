import React, {FC, ReactNode, useEffect, useRef, useState} from "react";
import {ChevronLeft, Copy, Loader2, X} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {Button} from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {KeyValue, Obj} from "../../types";
import {HeadingPage} from "../elements";

interface Modals {
  title: string;
  subTitle?: string;
  children?: ReactNode;
  contentPosition?: "left" | "right" | "center";
  titlePosition?: "left" | "right" | "center";
  buttonPosition?: "left" | "right" | "center" | "between";
  button?:
    | "Cancel"
    | "Confirm"
    | "Ok"
    | "No"
    | "Yes"
    | "Skip"
    | "Remove"
    | "Delete"
    | "Accept"
    | "Submit";
  button2?:
    | "Cancel"
    | "Confirm"
    | "Ok"
    | "No"
    | "Yes"
    | "Skip"
    | "Remove"
    | "Delete"
    | "Accept"
    | "Submit";
  handle: (value?: Obj) => void;
  open: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  isLoad?: boolean;
  scrollable?: boolean;
  scrollbar?: boolean;
  components?: ReactNode;
  topComponent?: ReactNode;
}
interface CarouselModals {
  title: string;
  contentPosition?: "left" | "right" | "center";
  titlePosition?: "left" | "right" | "center";
  handle: (value?: Obj) => void;
  open: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  isLoad?: boolean;
  scrollable?: boolean;
  images: any[];
}

export const Modal: FC<Modals> = ({
  button,
  title = "Title",
  children,
  contentPosition = "left",
  button2,
  subTitle = "",
  open = false,
  buttonPosition = "right",
  handle,
  titlePosition = "left",
  size = "md",
  isLoad = false,
  scrollable = false,
  scrollbar = false,
  components,
  topComponent,
}) => {
  let buttonColor =
    button === "Cancel" || button === "Skip" || button === "No"
      ? "bg-gray-700"
      : button === "Remove" || button === "Delete"
        ? "bg-red-600"
        : "bg-green-600";
  let buttonColor2 =
    button2 === "Cancel" || button2 === "Skip" || button2 === "No"
      ? "bg-gray-700"
      : button2 === "Remove" || button2 === "Delete"
        ? "bg-red-600"
        : "bg-green-600";

  let sizeBox =
    size === "sm"
      ? "max-w-[18.75rem]"
      : size === "md"
        ? "max-w-[37.5rem]"
        : size === "lg"
          ? "max-w-[56.25rem]"
          : size === "xl"
            ? "max-w-[75rem]"
            : "max-w-[93.75rem]";

  const handleFnc = (val) => {
    handle({open: false, key: val});
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className={`dark:text-white dark:bg-transparent ${sizeBox}`}
      >
        <Button
          className="dark:text-white dark:bg-transparent absolute top-0 right-0 z-10 bg-white"
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleFnc("NoExecute")}
        >
          <X size={16} strokeWidth={1.6} />
        </Button>
        <DialogHeader className="dark:text-white dark:bg-transparent relative">
          <DialogTitle
            className={`w-full ${
              titlePosition === "center"
                ? "text-center"
                : titlePosition === "right"
                  ? "text-right"
                  : "text-left"
            }`}
          >
            {title}
          </DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>
        {topComponent}
        <div
          className={`flex space-2 max-h-[40rem] min-w-fit ${
            scrollable && "overflow-auto min-h-[7rem]"
          } ${!scrollbar && "scrollbar-none"} ${
            contentPosition === "left"
              ? "justify-start"
              : contentPosition === "center"
                ? "justify-center"
                : "justify-end"
          }`}
        >
          {children}
        </div>
        {components}
        <DialogFooter className="dark:text-white dark:bg-transparent sm:justify-start">
          <div
            className={`flex w-full items-start gap-5 ${
              buttonPosition === "left"
                ? "justify-start"
                : buttonPosition === "center"
                  ? "justify-center"
                  : buttonPosition === "right"
                    ? "justify-end"
                    : "justify-between"
            }`}
          >
            {button2 && (
              <Button
                type="button"
                variant="default"
                className={`${buttonColor2}`}
                onClick={() => handleFnc("NoExecute")}
              >
                {button2}
              </Button>
            )}
            {button && (
              <Button
                type="button"
                disabled={isLoad}
                variant="default"
                className={`${buttonColor} ${
                  isLoad ? "pointer-events-none" : "pointer-events-auto"
                }`}
                onClick={() => handleFnc("Execute")}
              >
                {isLoad ? (
                  <Loader2 className="dark:text-white dark:bg-transparent animate-spin" />
                ) : (
                  `${button}`
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export const CarouselModal: FC<CarouselModals> = ({
  title = "Title",
  contentPosition = "",
  open = false,
  handle,
  titlePosition = "left",
  size = "md",
  isLoad = false,
  scrollable = false,
  images = [],
}) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);

  // const next = () => {
  //   sliderRef1.slickNext();
  //   sliderRef2.slickNext();
  // };
  // const previous = () => {
  //   sliderRef1.slickPrev();
  //   sliderRef2.slickPrev();
  // };

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  let sizeBox =
    size === "sm"
      ? "max-w-[18.75rem]"
      : size === "md"
        ? "max-w-[37.5rem]"
        : size === "lg"
          ? "max-w-[56.25rem]"
          : size === "xl"
            ? "max-w-[75rem]"
            : "max-w-[93.75rem]";

  const handleFnc = (val) => {
    handle({open: false, key: val});
  };

  // useEffect(() => {
  //   console.log(JSON.stringify(images));
  //   if (images.length > 0) setImgList(images);
  // }, [images]);
  return (
    <div
      className={`${open ? "flex" : "hidden"} top-0 left-0 fixed w-full h-full min-h-screen bg-black bg-opacity-50 z-[900]  justify-center items-start gap-5 animate-slowfadenozoom`}
    >
      <div className="flex flex-col w-full max-w-[134.75rem] max-h-[calc(100%-10rem)]">
        <div className="flex h-20 items-center justify-end py-5 px-12">
          {/* <HeadingPage className="text-white">{title}</HeadingPage> */}
          <Button
            className="bg-transparent z-10 hover:bg-transparent"
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleFnc("NoExecute")}
          >
            <X size={32} strokeWidth={1.6} />
          </Button>
        </div>
        <div className="flex flex-col gap-5 items-center w-full px-12">
          <div className="slider-container h-[36.25rem] min-w-[31.25rem] max-w-[62.5rem] w-full">
            <Slider
              asNavFor={nav2}
              ref={(slider) => (sliderRef1 = slider)}
              arrows={false}
              fade={true}
            >
              {images &&
                images?.map((image) => (
                  <div className="h-[36.25rem] overflow-hidden flex justify-center items-center">
                    <img
                      src={`${image?.url}`}
                      className="w-auto h-full mx-auto object-cover"
                    />
                  </div>
                ))}
            </Slider>
          </div>
          <div className="slider-container h-[10rem] min-w-[31.25rem] max-w-[62.5rem] w-full relative">
            {/* <Button
              type="button"
              variant="ghost"
              size="icon"
              className="!hover:bg-transparent absolute z-[902] top-1/2 -translate-y-1/2 -left-7"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="!hover:bg-transparent absolute z-[902] top-1/2 -translate-y-1/2 -right-7"
            >
              <ChevronLeft size={20} />
            </Button> */}
            <Slider
              asNavFor={nav1}
              ref={(slider) => (sliderRef2 = slider)}
              slidesToShow={5}
              swipeToSlide={true}
              focusOnSelect={true}
            >
              {images &&
                images?.map((image) => (
                  <div className="h-[10rem] overflow-hidden flex justify-center items-center">
                    <img
                      src={`${image?.url}`}
                      className="w-auto h-full mx-auto object-cover"
                    />
                  </div>
                ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};
