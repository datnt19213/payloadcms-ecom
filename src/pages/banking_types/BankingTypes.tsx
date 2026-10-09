import React, {ChangeEvent, KeyboardEvent, useEffect, useState} from "react";
import {Input} from "../../components/ui/input";
import {Enum, Styles} from "../../common/data";
import {Label} from "../../components/ui/label";
import {convertToSlug, formatDate2} from "../../utils";
import {CRUDContainer, ManagementContainer} from "../../components/container";
import {NoDataAvailableTable} from "../../components/empty";
import {SkeletonDynamics, SkeletonTable} from "../../components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {notify, ToastNotify} from "../../components/toast";
import {Gutter} from "payload/components/elements";
import {Modal} from "../../components/modal";
import {toast} from "react-toastify";
import {Button} from "../../components/ui/button";
import axios from "axios";
import {DrawerSheet} from "../../components/drawer";
import {ActionButton} from "../../components/buttons";
import {Checkbox} from "../../components/ui/checkbox";
import {RelationshipSingleField} from "../../components/fields";

const BankingTypes = () => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [portalId, setPortalId] = useState(null);
  const [portalSelected, setPortalSelected] = useState(null);
  const [data, setData] = useState([]);
  const [portalList, setPortalList] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [deletedAll, setDeleteAll] = useState<boolean>(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [loadSave, setLoadSave] = useState(false);

  const fetchDataBankingTypes = async () => {
    setSkeleton(true);
    try {
      axios
        .get("/api/bank-types?locale=en&depth=4")
        .then((response) => {
          if (response.data.totalDocs > 0) {
            setData(response.data.docs);
            setSkeleton(false);
          }
        })
        .finally(() => {
          setSkeleton(false);
        });
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchDataBankingTypes();
  }, []);
  const fetchDataPortalList = async () => {
    try {
      axios.get(`${Enum.PAYMENT_LIST_METHOD}`).then((response) => {
        if (response.data) {
          setPortalList(response.data.data);
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchDataPortalList();
  }, []);
  useEffect(() => {
    fetchDataBankingTypes();
  }, []);

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
  const deleteSelectedBankingType = async (val) => {
    if (val.key === "NoExecute") {
      setIsModal(val.open);
      return;
    }
    if (val.key === "Execute") {
      setIsLoad(true);
      try {
        if (deletedAll) {
          const deleteRequests = data.map((type) =>
            axios.delete(`/api/bank-types/${type.id}`)
          );
          await Promise.all(deleteRequests);
          toast.success("All bank types deleted successfully.");
          setIsModal(val);
        } else {
          const deleteRequests = selected.map((id) =>
            axios.delete(`/api/bank-types/${id}`)
          );
          await Promise.all(deleteRequests);
          toast.success("Selected bank types deleted successfully.");
          setIsModal(val.open);
        }

        const updateDatas = data.filter((data) => !selected.includes(data.id));
        setData(updateDatas);
        setIsLoad(false);
        setIsModal(false);
        setSelected([]);
        setDeleteAll(false);
        fetchDataBankingTypes();
      } catch (error) {
        console.error("Failed to delete selected bank types", error);
        toast.error("Failed to delete selected bank types.");
      }
    } else {
      throw new Error("Key modal transering is not accepted.");
    }
  };
  // #endregion

  useEffect(() => {
    const handlePortalSelected = () => {
      const portalSelect = portalList.find((portal) => portal.id === portalId);
      setPortalSelected(portalSelect);
    };
    handlePortalSelected();
  }, [portalId]);

  const CreateBankType = async () => {
    setLoadSave(true);
    let dataForm = {
      name: name,
      value: value,
      portal: portalSelected,
    };
    if (name == "" || value == "" || portalSelected == null) {
      name == "" && notify.error("Name field is required");
      value == "" && notify.error("Value field is required");
      portalSelected == null && notify.error("Portal field is required");
      setLoadSave(false)
      return;
    }
    try {
      axios
        .post("/api/bank-types", dataForm, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data) {
            toast.success("Banking type created successfully");
          } else {
            toast.error("Banking type created failed");
          }
          setLoadSave(false);
        })
        .finally(() => {
          fetchDataBankingTypes();
          setLoadSave(false);
          setName("");
          setValue("");
          setPortalSelected(null);
        });
    } catch (error) {}
  };

  return (
    <ManagementContainer
      isBell={true}
      maxWidth={true}
      title="Bank Types"
      besideElement={
        <DrawerSheet
          title="Create a new bank type"
          buttonOpenElement={<Button>Create new</Button>}
          buttonSaveElement={
            <ActionButton
              loading={loadSave}
              actionText="Saving"
              labelText="Save"
              handleClick={CreateBankType}
            />
          }
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-base">Name</Label>
              <Input
                value={name}
                placeholder="Ví điện tử, Ngân hàng quốc tế, ..."
                className={`${Styles.input}`}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    CreateBankType();
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
                    CreateBankType();
                  }
                }}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <RelationshipSingleField
              title="Portal ID"
              titleClass="text-base"
              className="!px-0 !mt-0"
              size="fit"
              options={portalList}
              onChange={(selected) => setPortalId(selected.id)}
            />
            {/* <div className="flex flex-col gap-2">
              <Label className="text-base">Value</Label>
              <Input
                value={convertToSlug(name)}
                disabled
                className={`${Styles.input} pointer-events-none`}
              />
            </div> */}
          </div>
        </DrawerSheet>
      }
    >
      {/* list management */}
      <div className="w-full">
        <Gutter className="dark:text-white dark:bg-transparent flex flex-col gap-12 py-12">
          {/* Modal popup */}
          <Modal
            title="Are you sure to delete?"
            button2="Cancel"
            button="Delete"
            open={isModal}
            handle={deleteSelectedBankingType}
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
                    <TableHead className="dark:text-white dark:bg-transparent flex justify-center items-center col-span-4 font-semibold text-base text-center">
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
                        data.map((type, index) => (
                          <TableRow
                            key={`o-${index}`}
                            className={`grid grid-cols-12 min-h-12 cursor-default`}
                          >
                            <TableCell className="dark:text-white dark:bg-transparent col-span-1 font-medium overflow-x-hidden flex justify-center items-start text-base">
                              <Checkbox
                                checked={selected.includes(type?.id.toString())}
                                onCheckedChange={() =>
                                  SetSelectedFnc(type?.id.toString())
                                }
                              />
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-4 font-medium flex justify-center items-start text-base px-5">
                              <span className="dark:text-white dark:bg-transparent truncate">
                                {type?.name && type?.name}
                              </span>
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-4 font-medium flex justify-center items-start text-base px-5">
                              <span className="dark:text-white dark:bg-transparent truncate">
                                {type?.value && type?.value}
                              </span>
                            </TableCell>
                            <TableCell className="dark:text-white dark:bg-transparent col-span-3 font-medium flex justify-center items-start text-base px-5">
                              <span className="dark:text-white dark:bg-transparent truncate">
                                {type?.createdAt &&
                                  formatDate2(type?.createdAt)}
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
        </Gutter>
        <ToastNotify position="top-right" />
      </div>
    </ManagementContainer>
  );
};

export default BankingTypes;
