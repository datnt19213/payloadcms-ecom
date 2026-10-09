import axios from "axios";
import {Gutter} from "payload/components/elements";
import React, {KeyboardEvent, useCallback, useEffect, useState} from "react";
import {Styles} from "../../common/data";
import {ActionButton} from "../../components/buttons";
import {ManagementContainer} from "../../components/container";
import {DrawerSheet} from "../../components/drawer";
import {NoDataAvailableTable} from "../../components/empty";
import {Modal} from "../../components/modal";
import {SkeletonDynamics} from "../../components/skeleton";
import {notify, ToastNotify} from "../../components/toast";
import {
  TableHead,
  TableBody,
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "../../components/ui/table";
import {convertToSlug, formatDate2, TotalPageOfPaginations} from "../../utils";
import {Button} from "../../components/ui/button";
import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import {Checkbox} from "../../components/ui/checkbox";
import {RelationshipSingleField, UploadField} from "../../components/fields";
import * as XLSX from "xlsx";
import {useDropzone} from "react-dropzone";
import {Paginations} from "../../components/particals";
import {UnderlineSpan} from "../../components/elements";

const BankingsManagement = () => {
  const [logo, setLogo] = useState(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [bankType, setBankType] = useState(null);
  const [logoEdit, setLogoEdit] = useState(null);
  const [nameEdit, setNameEdit] = useState("");
  const [valueEdit, setValueEdit] = useState("");
  const [bankTypeEdit, setBankTypeEdit] = useState(null);
  const [data, setData] = useState([]);
  const [dataBankTypes, setDataBankTypes] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [skeletonBankTypes, setSkeletonBankTypes] = useState(true);
  const [deletedAll, setDeleteAll] = useState<boolean>(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [isLoadingUploadMulti, setLoadingUploadMulti] = useState(false);
  const [loadSave, setLoadSave] = useState(false);
  const [loadSaveEdit, setLoadSaveEdit] = useState(false);

  const [fileData, setFileData] = useState<any[]>([]);
  const [fileDataCopy, setFileDataCopy] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  // #region onDrop file
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    setError(null); // Reset any previous errors

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const binaryStr = e.target?.result;

        if (file.name.endsWith(".csv")) {
          const workbook = XLSX.read(binaryStr, {type: "binary"});
          const worksheet = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          setFileData(worksheet);
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          const workbook = XLSX.read(binaryStr, {type: "binary"});
          const worksheet = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          setFileData(worksheet);
        } else {
          throw new Error("Unsupported file format");
        }
      } catch (err) {
        setError(
          "Error processing the file. Please ensure it is a valid Excel or CSV file."
        );
        setFileData([]);
        console.error(err);
      }
    };
    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
    };
    reader.readAsBinaryString(file);
  }, []);
  // #endregion

  // #region Copy data from excel to a copy version
  useEffect(() => {
    if (fileData.length > 0) {
      setFileDataCopy(fileData);
    }
  }, [fileData]);
  // #endregion

  // #region fetch data bankings and bank types
  const fetchDataBankings = async () => {
    setSkeleton(true);
    try {
      axios
        .get(`/api/bankings?locale=en&depth=4&limit=10&page=${currentPage}`)
        .then((response) => {
          if (response.data.totalDocs > 0) {
            setData(response.data.docs);
            setSkeleton(false);
            setTotalPage(TotalPageOfPaginations(response.data.totalDocs, 10));
          }
        })
        .finally(() => {
          setSkeleton(false);
        });
    } catch (error) {
      throw new Error(error);
    }
  };
  const fetchDataBankTypes = async () => {
    setSkeletonBankTypes(true);
    try {
      axios
        .get("/api/bank-types?locale=en&depth=4")
        .then((response) => {
          if (response.data.totalDocs > 0) {
            let arr = [];
            response.data.docs.map((doc) => {
              arr.push({
                id: doc.id,
                label: doc.name,
                value: doc.value,
                updatedAt: doc.updatedAt,
                createdAt: doc.createdAt,
              });
            });
            setDataBankTypes(arr);
            setSkeletonBankTypes(false);
          }
        })
        .finally(() => {
          setSkeletonBankTypes(false);
        });
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchDataBankTypes();
  }, []);
  useEffect(() => {
    fetchDataBankings();
  }, [currentPage]);
  // #endregion

  // #region Single selected
  const SetSelectedFnc = (id: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        if (deletedAll) {
          let arr = selected;
          setDeleteAll(false);
          setSelected(arr);
        }
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };
  // #endregion

  // #region Select all rows
  const selectAllRows = (isChecked?: boolean) => {
    if (isChecked && data.length > 0) {
      let arr = [];
      data.forEach((type) => arr.push(type?.id?.toString()));
      setSelected(arr);
    } else {
      setSelected([]);
    }
  };

  // #endregion

  // #region Delete Function
  const deleteSelectedBankings = async (val) => {
    if (val.key === "NoExecute") {
      setIsModal(val.open);
      return;
    }
    if (val.key === "Execute") {
      setIsLoad(true);
      try {
        if (deletedAll) {
          const deleteRequests = data.map((type) =>
            axios.delete(`/api/bankings/${type.id}`)
          );
          await Promise.all(deleteRequests);
          setCurrentPage(1);
          notify.success("All bank deleted successfully.");
          setIsModal(val);
        } else {
          const deleteRequests = selected.map((id) =>
            axios.delete(`/api/bankings/${id}`)
          );
          await Promise.all(deleteRequests);
          setCurrentPage(1);
          notify.success("Selected bank deleted successfully.");
          setIsModal(val.open);
        }
        setCurrentPage(1);

        const updateDatas = data.filter((data) => !selected.includes(data.id));
        setData(updateDatas);
        setIsLoad(false);
        setIsModal(false);
        setSelected([]);
        setDeleteAll(false);
        fetchDataBankings();
      } catch (error) {
        console.error("Failed to delete selected bank", error);
        notify.error("Failed to delete selected bank.");
      }
    } else {
      throw new Error("Key modal transering is not accepted.");
    }
  };
  // #endregion

  // #region Create a bank
  const CreateBank = async () => {
    if (logo == null || name == "" || value == "" || bankType == null) {
      notify.error("Please enter all fields");
      return;
    }
    setLoadSave(true);
    let dataForm = {
      image: logo.id,
      name: name,
      value: value,
      type: bankType,
    };

    try {
      axios
        .post("/api/bankings", dataForm, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data) {
            notify.success("Banking type created successfully");
          } else {
            notify.error("Banking type created failed");
          }
          setLoadSave(false);
        })
        .finally(() => {
          setCurrentPage(1);
          fetchDataBankings();
          setLoadSave(false);
          setLogo(null);
          setName("");
          setValue("");
          setBankType(null);
        });
    } catch (error) {
      throw new Error(error);
    }
  };

  // #endregion

  // #region Create banks with file import
  const handleUploadMulti = async () => {
    if (fileDataCopy.length === 0) {
      setError("No data to upload.");
      return;
    }
    // console.log(JSON.stringify(fileDataCopy));

    setLoadingUploadMulti(true);
    setError(null);

    try {
      const promises = fileDataCopy.map(async (item) => {
        const response = await axios.post(`/api/bankings`, item, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.data;
      });

      await Promise.all(promises);
      setCurrentPage(1);
      fetchDataBankings();
      notify.success("Data uploaded successfully.");
      setFileData([]);
    } catch (err) {
      console.error(err);
      setError("Error uploading data to PayloadCMS. Please try again.");
    } finally {
      setLoadingUploadMulti(false);
    }
  };
  // #endregion

  // #region update data for excel data
  const onChangeBankTypeForExcelData = (option, value, name) => {
    let arr = fileDataCopy;
    arr.map((data, index) => {
      if (data.value == value) {
        arr[index] = {...data, type: option};
      }
    });
  };

  // #endregion

  // #region useDropZone
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDropRejected: () => {
      setError("File type not accepted. Please upload an Excel or CSV file.");
    },
  });

  // #endregion

  const handleSetDataEdit = (bank) => {
    // setLogoEdit(bank?.image?.url);
    setNameEdit(bank?.name);
    setValueEdit(bank?.value);
    setBankTypeEdit(bank?.type);
  };

  const EditBank = (id) => {
    if (
      logoEdit == null ||
      nameEdit == "" ||
      valueEdit == "" ||
      bankTypeEdit == null
    ) {
      logoEdit == null && notify.error("Image is required");
      nameEdit == "" && notify.error("Name is required");
      valueEdit == "" && notify.error("Value is required");
      bankTypeEdit == null && notify.error("Bank type is required");
      return;
    }
    setLoadSaveEdit(true);
    let dataForm = {
      image: logoEdit.id,
      name: nameEdit,
      value: valueEdit,
      type: bankTypeEdit,
    };

    try {
      axios
        .patch(`/api/bankings/${id}`, dataForm, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data) {
            notify.success("Banking type updated successfully");
          } else {
            notify.error("Banking type updated failed");
          }
          setLoadSaveEdit(false);
        })
        .finally(() => {
          setCurrentPage(1);
          fetchDataBankings();
          setLoadSaveEdit(false);
          setLogoEdit(null);
          setNameEdit("");
          setValueEdit("");
          setBankTypeEdit(null);
        });
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <ManagementContainer
      isBell={true}
      maxWidth={true}
      title="Bankings"
      besideElement={
        <div className="flex items-center gap-5">
          <DrawerSheet
            title="Create new banking"
            buttonOpenElement={<Button>Create new</Button>}
            buttonSaveElement={
              <ActionButton
                loading={loadSave}
                actionText="Saving"
                labelText="Save"
                handleClick={CreateBank}
              />
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <UploadField
                  logo={logo?.url}
                  title="Image"
                  onChange={(value) => setLogo(value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-base">Name</Label>
                <Input
                  value={name}
                  placeholder="Ngân hàng ABCXYZ, ..."
                  className={`${Styles.input}`}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      CreateBank();
                    }
                  }}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-base">Value</Label>
                <Input
                  value={value}
                  className={`${Styles.input}`}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      CreateBank();
                    }
                  }}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              {/* <div className="flex flex-col gap-2">
                <Label className="text-base">Value</Label>
                <Input
                  value={convertToSlug(name)}
                  disabled
                  className={`${Styles.input} pointer-events-none`}
                />
              </div> */}
              <RelationshipSingleField
                size="fit"
                className="!px-0 !mt-0"
                title="Bank type"
                options={dataBankTypes}
                onChange={(option) => setBankType(option)}
              />
            </div>
          </DrawerSheet>
          <DrawerSheet
            title="Import"
            size="xl"
            buttonOpenElement={<Button>Import</Button>}
            besideElement={
              <ActionButton
                loading={isLoadingUploadMulti}
                actionText="Saving"
                labelText="Save"
                handleClick={handleUploadMulti}
              />
            }
          >
            <div className="p-4 flex flex-col gap-12">
              <div
                {...getRootProps()}
                className="col-span-1 lg:col-span-8 rounded-xl ring-1 min-h-36 max-h-40 ring-gray-200 bg-gray-50 hover:ring-orange-500 transition-all duration-200 w-full flex flex-col justify-center items-center"
              >
                <input {...getInputProps()} />
                <span className="text-center px-3">
                  Drag & drop an Excel or CSV file here, or click to select a
                  file
                </span>
                {fileName && (
                  <span className="mt-2 text-base text-green-600">{`Selected file: ${fileName}`}</span>
                )}
                {error && (
                  <span className="mt-2 text-base text-red-600">{error}</span>
                )}
              </div>
              <div className="pr-3 scrollbar-thin h-[68dvh] overflow-y-scroll">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pb-32">
                  {fileDataCopy.length > 0 &&
                    fileDataCopy.map((item, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="flex flex-col gap-2 border border-gray-200 shadow-md bg-white p-4 rounded-md"
                        title={`${item.name}`}
                      >
                        <span className="text-lg font-bold truncate">
                          {item.value} - {item.name}
                        </span>
                        <RelationshipSingleField
                          title="Bank type"
                          titleClass="text-base"
                          size="fit"
                          options={dataBankTypes}
                          className="!px-0 !mt-0"
                          onChange={(optionData) =>
                            onChangeBankTypeForExcelData(
                              optionData,
                              item.value,
                              item.name
                            )
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </DrawerSheet>
        </div>
      }
    >
      {/* list management */}
      <div className="w-full">
        {/* Modal popup */}
        <Modal
          title="Are you sure to delete?"
          button2="Cancel"
          button="Delete"
          open={isModal}
          handle={deleteSelectedBankings}
          isLoad={isLoad}
        />

        {/* Banking types Page */}
        <div className="dark:text-white dark:bg-transparent w-full flex justify-end">
          <div className="dark:text-white dark:bg-transparent flex justify-end items-center gap-5">
            {(selected.length > 0 || deletedAll) && (
              <Button
                variant="default"
                className="dark:text-white dark:bg-transparent text-nowrap bg-red-600 animate-fade"
                onClick={() => setIsModal(true)}
              >
                Delete all selected
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setSelected([]), setDeleteAll(false);
              }}
            >
              Unselect all
            </Button>

            <span className="dark:text-white dark:bg-transparent text-nowrap text-sm font-semibold tracking-tight">
              {selected.length}&nbsp;rows selected
            </span>
          </div>
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
                      onCheckedChange={(e) => {
                        const isChecked = e === true;
                        setDeleteAll(isChecked);
                        selectAllRows(isChecked);
                      }}
                    />
                  </TableHead>
                  <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
                    <span>Name</span>
                  </TableHead>
                  <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-1 font-semibold text-base text-center">
                    <span>Image</span>
                  </TableHead>
                  <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                    <span>Value</span>
                  </TableHead>
                  <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-3 font-semibold text-base text-center">
                    <span>Created at</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length > 0 ? (
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
                      data.map((bank, index) => (
                        <TableRow
                          key={`bk-${index}`}
                          className={`grid grid-cols-12 min-h-12 cursor-default`}
                        >
                          <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-center text-base">
                            <Checkbox
                              checked={selected.includes(bank?.id?.toString())}
                              onCheckedChange={() =>
                                SetSelectedFnc(bank?.id?.toString())
                              }
                            />
                          </TableCell>
                          <TableCell className="dark:text-white dark:bg-transparent col-span-4 font-medium flex justify-center items-center text-base px-5">
                            <DrawerSheet
                              buttonOpenElement={
                                <UnderlineSpan
                                  onClick={() => handleSetDataEdit(bank)}
                                >
                                  {bank?.name && bank?.name}
                                </UnderlineSpan>
                              }
                              title="Edit bank"
                              buttonSaveElement={
                                <ActionButton
                                  loading={loadSaveEdit}
                                  actionText="Saving"
                                  labelText="Save"
                                  handleClick={() => EditBank(bank?.id)}
                                />
                              }
                            >
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                  <UploadField
                                    logo={bank?.image?.url}
                                    title="Image"
                                    onChange={(value) => setLogoEdit(value)}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Label className="text-base">Name</Label>
                                  <Input
                                    value={nameEdit}
                                    placeholder="Ngân hàng ABCXYZ, ..."
                                    className={`${Styles.input}`}
                                    onKeyDown={(
                                      e: KeyboardEvent<HTMLInputElement>
                                    ) => {
                                      if (e.key === "Enter") {
                                        EditBank(bank?.id);
                                      }
                                    }}
                                    onChange={(e) =>
                                      setNameEdit(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Label className="text-base">Value</Label>
                                  <Input
                                    value={valueEdit}
                                    className={`${Styles.input}`}
                                    onKeyDown={(
                                      e: KeyboardEvent<HTMLInputElement>
                                    ) => {
                                      if (e.key === "Enter") {
                                        EditBank(bank?.id);
                                      }
                                    }}
                                    onChange={(e) =>
                                      setValueEdit(e.target.value)
                                    }
                                  />
                                </div>
                                <RelationshipSingleField
                                  size="fit"
                                  className="!px-0 !mt-0"
                                  title="Bank type"
                                  defaultValue={bankTypeEdit}
                                  options={dataBankTypes}
                                  onChange={(option) => setBankTypeEdit(option)}
                                />
                              </div>
                            </DrawerSheet>
                          </TableCell>
                          <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium flex justify-center items-center text-base px-5">
                            <span className="dark:text-white dark:bg-transparent truncate">
                              <img
                                src={bank?.image?.url && bank?.image?.url}
                                alt="image-bank"
                                loading="lazy"
                              />
                            </span>
                          </TableCell>
                          <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium flex justify-center items-center text-base px-5">
                            <span className="dark:text-white dark:bg-transparent truncate">
                              {bank?.value && bank?.value}
                            </span>
                          </TableCell>
                          <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium flex justify-center items-center text-base px-5">
                            <span className="dark:text-white dark:bg-transparent truncate">
                              {bank?.createdAt && formatDate2(bank?.createdAt)}
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
        <ToastNotify position="top-right" />
      </div>
      <Paginations
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={handlePagination}
      />
    </ManagementContainer>
  );
};

export default BankingsManagement;
