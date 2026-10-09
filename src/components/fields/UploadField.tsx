import React, {FC, KeyboardEvent, useEffect, useRef, useState} from "react";
import {
  ExternalURLConfiguration,
  KafkaSettings,
  Obj,
  PaymentSettings,
  SocialLink,
} from "../../types";
import {useDropzone} from "react-dropzone";
import {toast} from "react-toastify";
import {GridCol12} from "../container";
import {Button} from "../ui/button";
import {Loader2, Search, X} from "lucide-react";
import {Logo} from "../graphics";
import {Modal} from "../modal";
import axios from "axios";
import {Paginations} from "../particals";
import {RenameFile, TotalPageOfPaginations} from "../../utils";
import {SkeletonDynamics} from "../skeleton";
import {Progress} from "../ui/progress";
import {Label} from "../ui/label";
import {FormImages} from "../../api";
import {Input} from "../ui/input";
import {Common, Enum} from "../../common/data";
import {notify} from "../toast";

/**
 * @param title - Title of the upload field
 * @param logo - Logo of field
 * @param onChange - Function onchange event handle file[0] data
 */

type UploadFieldProps = {
  title?: string;
  onChange?: (value: PreviewFile) => void;
  onImageId?: (value: any) => void;
  logo?: string;
  id?: string;
};
export interface PreviewFile extends File {
  preview: string;
  id: any;
}

const UploadField: FC<UploadFieldProps> = ({
  title,
  onChange,
  onImageId,
  logo,
  id = "",
}) => {
  // #region useStates variables
  const [files, setFiles] = useState<PreviewFile | null>(null);
  const [size, setSize] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState("");

  const [isModal, setIsModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [imgList, setImgList] = useState([]);
  const [imgSelected, setImgSelected] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const [progress, setProgress] = useState(0);
  const [isProgress, setIsProgress] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  const [isAccepted, setIsAccepted] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);
  // #endregion

  // #region Images list of media
  const fetchData = async () => {
    try {
      setLoading(true);
      await axios
        .get(`/api/media?limit=10&page=${currentPage}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.totalDocs > 0) {
            setTotalPage(response.data.totalPages);
            setImgList(response.data.docs);
            setLoading(false);
          }
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // #endregion

  // #region onChange functions get data
  useEffect(() => {
    console.log(logo);

    setFiles((prev: PreviewFile) => {
      let lg = {...prev, preview: logo};
      console.log(lg);
      return lg;
    });
  }, [logo]);
  // #endregion

  // #region Image Dropzone handling
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "image/gif": [".gif"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (
        (selectedFile.type == "image/jpg" ||
          selectedFile.type == "image/png" ||
          selectedFile.type == "image/jpeg" ||
          selectedFile.type == "image/gif") &&
        selectedFile
      ) {
        let file = Object.assign(selectedFile, {
          preview: URL.createObjectURL(selectedFile),
        });

        if (controllerRef.current) {
          controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev < 70) {
              return prev + 1;
            }
            return prev;
          });
        }, 150);

        // if (isAccepted) {
        if (file) {
          try {
            setIsProgress(true);
            const formData = new FormData();
            formData.append(
              "file",
              RenameFile(file, file.name, file.name + "-sliders-image")
            );

            await axios
              .post("/api/media", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                signal: controller.signal,
              })
              .then((response) => {
                if (response.data.doc) {
                  clearInterval(interval);
                  setProgress(100);
                  setFiles((prev: PreviewFile) => {
                    return {
                      ...prev,
                      preview: response.data?.doc?.url,
                      id: response.data?.doc?.id,
                    };
                  });
                  setTimeout(() => {
                    setIsProgress(false);
                  }, 2000);
                }
              });
          } catch (error) {
            if (axios.isCancel(error)) {
              setFiles(null);
              clearInterval(interval);
              setProgress(0);
            } else {
              notify.error("Image creation failed");
              throw new Error(error);
            }
          } finally {
            fetchData();
          }
        } else {
          notify.error(
            "The file formats accepted are jpg, png, jpeg, and gif."
          );
        }
        // }
      } else {
        notify.error("The file formats accepted are jpg, png, jpeg, and gif.");
      }
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        if (file.file.size > 5 * 1024 * 1024) {
          setSize(file.file.size);
          notify.error("The file size exceeds the 5 MB limit.");
        }
      });
    },
  });
  // #endregion

  useEffect(() => {
    console.log(JSON.stringify(files));

    if (onChange && files) {
      onChange(files);
    }
  }, [files]);

  const handleModal = (val: Obj) => {
    if (val.key === "NoExecute") {
      setIsModal(val.open);
      return;
    }
    if (val.key === "Execute") {
      // onImageId(imgSelected?.id);
      setFiles((prev: PreviewFile) => {
        return {...prev, preview: imgSelected?.url, id: imgSelected?.id};
      });
      setIsModal(val.open);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData();
  };

  const handleCancelImagePost = () => {
    if (controllerRef.current) {
      setIsCancel(true);
      controllerRef.current.abort();
      setFiles(null);
      setProgress(0);
      setIsCancel(false);
    }
  };

  const handleSearchImage = async () => {
    setCurrentPage(1);
    try {
      setLoading(true);
      await axios
        .get(
          `/api/media?where[filename][contains]=${searchKeywords}&limit=10&page=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.totalDocs > 0) {
            setTotalPage(response.data.totalPages);
            setImgList(response.data.docs);
            setLoading(false);
          }
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-fit">
      <Modal
        title="Exist Images"
        open={isModal}
        handle={handleModal}
        button2="Cancel"
        button="Confirm"
        size="2xl"
        scrollable={true}
        scrollbar={true}
        components={
          <Paginations
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePageChange}
          />
        }
        topComponent={
          <div className="grid grid-cols-12 gap-3">
            <Input
              placeholder="Search here..."
              onChange={(e) => setSearchKeywords(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleSearchImage();
                }
              }}
              className="col-span-11 focus-visible:ring-1 !h-12 focus-visible:outline-none ring-1 border-none focus:ring-gray-900 ring-gray-300 outline-none transition-all duration-200"
            />
            <Button
              variant="outline"
              className="col-span-1 !h-12"
              onClick={() => handleSearchImage()}
            >
              <Search strokeWidth={1.5} size={20} />
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <SkeletonDynamics
            layout="row"
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 p-3"
            itemClassName="min-h-[9.375rem] col-span-1"
            count={12}
          />
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-y-12 gap-x-2 p-3">
            {imgList.length > 0 &&
              imgList.map((img, i) => (
                <div
                  className={`h-full w-auto aspect-auto col-span-1 cursor-pointer rounded-lg ${
                    img?.id == imgSelected?.id && "ring-2 ring-[#fe3f1a]"
                  } transition-all duration-200 `}
                >
                  <div
                    style={{
                      minHeight: "16rem",
                    }}
                    key={i}
                    className={` flex justify-center items-center overflow-hidden`}
                    onClick={() => {
                      setImgSelected(img == imgSelected ? null : img);
                    }}
                  >
                    <img
                      key={i}
                      src={img.url}
                      alt="image-items-data"
                      loading="lazy"
                      className={`object-cover object-center w-full h-auto`}
                    />
                  </div>
                  <div className="flex items-center justify-center px-5">
                    <span className="truncate">
                      {img?.filename?.replace(
                        Enum.secretRandomKey.toString(),
                        ""
                      )}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Modal>

      {title && <span>{title}</span>}
      {isProgress && (
        <div className="w-full flex justify-between items-center gap-3">
          <div className="w-full flex items-center gap-3">
            <Progress
              value={progress}
              className="h-2 rounded-full w-full animate-pulse"
            />
            <Label className="font-semibold">{progress}%</Label>
          </div>
          {isCancel ? (
            <Loader2
              className="animate-spin text-red-700"
              strokeWidth={1.5}
              size={20}
            />
          ) : (
            <Button
              size="icon"
              variant="destructive"
              onClick={() => handleCancelImagePost()}
            >
              <X strokeWidth={1.5} size={20} />
            </Button>
          )}
        </div>
      )}
      <GridCol12 className="gap-7 w-full min-h-28 lg:max-h-52">
        {files && (
          <aside className="col-span-1 lg:col-span-4 relative rounded-lg h-full flex justify-center">
            <img
              src={`${files.preview}` ? `${files.preview}` : ""}
              onLoad={() => {
                URL.revokeObjectURL(files.preview);
              }}
              className="min-h-16 max-h-40"
            />

            <X
              size={20}
              strokeWidth={1.7}
              className="text-red-500 absolute -top-3 -right-3 cursor-pointer"
              onClick={() => setFiles(null)}
            />
          </aside>
        )}
        {files == null && (
          <div className="w-full h-full col-span-1  lg:col-span-4 bg-gray-200 rounded-lg flex justify-center items-center min-h-16 max-h-40">
            <span className="text-xs italic">(Preview)</span>
          </div>
        )}

        <div
          {...getRootProps({className: "dropzone"})}
          className="col-span-1 lg:col-span-8 rounded-xl ring-1 min-h-28 max-h-40 ring-gray-200 bg-gray-50 hover:ring-orange-500 transition-all duration-200 w-full flex flex-col justify-center items-center"
        >
          <input {...getInputProps()} />
          <span className="text-center px-3">
            Drag or click to select files (Maximize of 5MB)
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsModal(true);
            }}
          >
            Choose exist file
          </Button>
          {size != 0 && (
            <span className="text-red-500">
              File is over than 5MB ({(size / 1024 / 1024).toFixed(3)}MB)
            </span>
          )}
        </div>
      </GridCol12>
    </div>
  );
};

export default UploadField;
