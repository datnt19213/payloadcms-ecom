import React, {useEffect, useState} from "react";
import {CRUDContainer, ManagementContainer} from "../../components/container";
import {Button} from "../../components/ui/button";
import {TabComp} from "../../components/tabs";
import {DrawerSheet} from "../../components/drawer";
import {
  RelationshipMultiField,
  RelationshipSingleField,
  TextField,
  TextInactiveField,
} from "../../components/fields";
import axios from "axios";
import {TabsContent, TabsTrigger} from "../../components/ui/tabs";
import {Switch} from "../../components/ui/switch";
import {Label} from "../../components/ui/label";
import {Obj, User, ValueLabel} from "../../types";
import {useAuth} from "payload/components/utilities";
import {AddNewDashedLineButton, StatusSpan} from "../../components/elements";
import {
  CircleHelp,
  CirclePlus,
  EllipsisVertical,
  Loader2,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import {Input} from "../../components/ui/input";
import {
  AdjustColorBrightness,
  convertToSlug,
  GetBgColorFromFirstVowel,
  GetStatusColor,
} from "../../utils";
import {toast, ToastContainer} from "react-toastify";
import {data} from "../../components/chartjs/LineChart/config";
import {Modal} from "../../components/modal";
import {Value} from "payload/dist/admin/components/forms/field-types/Relationship/types";
import {TitleHover} from "../../components/hover";
import {ActionButton} from "../../components/buttons";
import {EmptyElement} from "../../components/empty";
import {notify, ToastNotify} from "../../components/toast";
import {SkeletonDynamics} from "../../components/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {Paginations} from "../../components/particals";
import {Enum} from "../../common/data";

interface PaymentSettings {
  options?: OptionPayment;
  portal_list?: PortalList[];
}

interface OptionPayment {
  id?: any;
  label?: string;
  value?: string;
  enable?: string;
}

interface PortalList {
  portal?: any;
  enabled?: string;
  childrens?: any;
}

interface PortalInOption {
  option?: any;
  portals_in_option?: string[];
}

const PaymentSettings = () => {
  const {user} = useAuth<User>();
  const [optionName, setOptionName] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const [optionEnable, setOptionEnable] = useState(false);
  const [optionNameEdit, setOptionNameEdit] = useState("");
  const [optionValueEdit, setOptionValueEdit] = useState("");
  const [optionEnableEdit, setOptionEnableEdit] = useState(false);
  const [optionEditRemove, setOptionEditRemove] = useState("");

  const [options, setOptions] = useState<OptionPayment[]>([]);
  const [paymentSetting, setPaymentSetting] = useState<PaymentSettings[]>([]);
  const [portals, setPortals] = useState([]);
  const [banks, setBanks] = useState([]);
  // const [portals2, setPortals2] = useState([]);

  // const [portalInOption, setPortalInOption] = useState<PortalInOption[]>([]);
  const [optionEditId, setOptionEditId] = useState<string>("");
  const [currOption, setCurrentOption] = useState<OptionPayment>(options[0]);

  const [loadingEnableEditOption, setLoadingEnableEditOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSaveSettings, setLoadingSaveSettings] = useState(false);
  const [loadingFetchOption, setLoadingFetchOption] = useState(true);
  const [loadingEditOption, setLoadingEditOption] = useState(false);
  const [deleteLoadModalOption, setDeleteLoadModalOption] = useState(false);

  const [isModal, setIsModal] = useState(null);
  const [modalOption, setModalOption] = useState(null);

  // #region Get all option in payment
  const fetchDataOption = async () => {
    await axios
      .get(`/api/payment_options?locale=en&depth=4`)
      .then((response) => {
        if (response.data.totalDocs > 0) {
          setOptions(response.data.docs);
          setLoadingFetchOption(false);
        }
      })
      .finally(() => {
        setCurrentOption(options[0]);
        setLoadingFetchOption(false);
      });
  };
  useEffect(() => {
    fetchDataOption();
  }, []);
  // #endregion

  // #region Get all banks payment
  const fetchDataBanks = async () => {
    await axios
      .get(`/api/bankings?locale=en&depth=4&limit=9999`)
      .then((response) => {
        if (response.data) {
          let bankList = [];
          response?.data?.docs.map((doc) => {
            bankList.push({
              ...doc,
              label: doc.name + " - " + doc.value,
              value: doc.value,
            });
          });
          setBanks(bankList);
        }
      });
  };

  useEffect(() => {
    fetchDataBanks();
  }, []);

  // #endregion

  // #region Get all settings payment
  const fetchDataSettings = async () => {
    await axios
      .get(`/api/globals/payment-settings?locale=en&depth=4`)
      .then((response) => {
        if (response.data) {
          setPaymentSetting(response?.data?.settings);
        }
      });
  };
  useEffect(() => {
    fetchDataSettings();
  }, []);

  // #endregion

  // #region Get all portals to add new portal view
  const fetchDataPayment = async () => {
    await axios.get(`${Enum.PAYMENT_LIST_METHOD}`).then((response) => {
      if (response.data) {
        setPortals(response.data.data);
      }
    });
  };
  useEffect(() => {
    fetchDataPayment();
  }, []);
  // #endregion

  // #region create new option
  const SaveOption = async () => {
    let formData: OptionPayment = {
      label: optionName,
      value: optionValue,
      enable: optionEnable.toString(),
    };
    try {
      setLoading(true);
      await axios
        .post(`/api/payment_options`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(async (response) => {
          if (response.data.totalDocs > 0) {
            setOptions(response.data.docs);
            setLoading(false);
            notify.success("Created payment option successfully");
          }
        })
        .finally(async () => {
          setLoading(false);
          setOptionName("");
          setOptionValue("");
          setOptionEnable(false);
          await fetchDataOption();
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
      notify.success("Created payment option failed");
    }
    setLoading(false);
  };
  // #endregion

  // #region is option selected
  const OptionSelect = (option: OptionPayment) => {
    setCurrentOption(option);
    console.log(JSON.stringify(option));
  };
  // #endregion

  // #region get portal value
  const GetPortalBanks = (
    data: any,
    portalIndex: number,
    settingsIndex: number
  ) => {
    console.log("Updating portal data:", {data, portalIndex, settingsIndex});
    setPaymentSetting((prevSettings) =>
      prevSettings.map((settings, idx) => {
        if (settings.options?.value === currOption?.value) {
          const updatedPortals = settings.portal_list?.map((portal, pIndex) => {
            if (pIndex === portalIndex) {
              return {...portal, childrens: data};
            }
            return portal;
          });
          return {...settings, portal_list: updatedPortals};
        }
        return settings;
      })
    );
  };
  // #endregion

  // #region get portal value
  const GetPortal = (data: any, portalIndex: number, settingsIndex: number) => {
    setPaymentSetting((prevSettings) =>
      prevSettings.map((settings, idx) => {
        if (settings.options?.value === currOption?.value) {
          const updatedPortals = settings.portal_list?.map((portal, pIndex) => {
            if (pIndex === portalIndex) {
              return {...portal, portal: data};
            }
            return portal;
          });
          return {...settings, portal_list: updatedPortals};
        }
        return settings;
      })
    );
    setTimeout(() => {
      console.log("Updating bank data:", {data, portalIndex, settingsIndex});
    }, 2000);
  };
  // #endregion

  // #region get enable value
  const GetEnable = (
    enabled: boolean,
    portalIndex: number,
    settingsIndex: number
  ) => {
    console.log("Updating portal enable status:", {
      enabled,
      portalIndex,
      settingsIndex,
    });
    setPaymentSetting((prevSettings: any) =>
      prevSettings.map((settings, idx) => {
        if (settings.options?.value === currOption?.value) {
          const updatedPortals = settings.portal_list?.map((portal, pIndex) => {
            if (pIndex === portalIndex) {
              return {...portal, enabled};
            }
            return portal;
          });
          return {...settings, portal_list: updatedPortals};
        }
        return settings;
      })
    );
  };
  // #endregion

  // #region create add new payment portal to an option
  const AddNewPortal = (option: OptionPayment) => {
    setPaymentSetting((prevSettings: any) => {
      const existingSetting = prevSettings.find(
        (setting) => setting.options?.value === option.value
      );

      if (existingSetting) {
        const updatedSettings = prevSettings.map((setting) =>
          setting.options?.value === option.value
            ? {
                ...setting,
                portal_list: [
                  ...(setting.portal_list || []),
                  {data: null, enabled: false},
                ],
              }
            : setting
        );
        return updatedSettings;
      } else {
        return [
          ...prevSettings,
          {
            options: {...option},
            portal_list: [{data: null, enabled: false}],
          },
        ];
      }
    });
  };

  // #endregion

  // #region remove portal payment
  const RemovePortal = (
    optionIndex: number,
    portalIndex: number,
    value: Obj
  ) => {
    if (value.key == "NoExecute") {
      setIsModal(null);
      return;
    } else {
      let pmSettings = paymentSetting;

      pmSettings.map((setting, index) => {
        if (index == optionIndex) {
          let newPortals = setting.portal_list.filter(
            (portal, j) => j != portalIndex
          );
          setting.portal_list = newPortals;
        }
      });

      setPaymentSetting(pmSettings);
      // setPaymentSetting((prevSettings) => {
      //   return prevSettings.map((setting, index) => {
      //     if (index === optionIndex) {
      //       const updatedPortals = setting.portal_list?.filter(
      //         (_, i) => i !== portalIndex
      //       );
      //       return {
      //         ...setting,
      //         portal_list: updatedPortals,
      //       };
      //     }
      //     return setting;
      //   });
      // });
      console.log(paymentSetting);

      setIsModal(null);
    }
  };
  // #endregion

  // #region show delete modal
  const ShowModalDelete = (jdex: number) => {
    setIsModal(jdex);
  };
  // #endregion

  // #region get to show option value to edit
  const ShowEditOption = (option: OptionPayment) => {
    setOptionEditId(option.id);
    setOptionNameEdit(option.label);
    setOptionValueEdit(option.value);
    setOptionEnableEdit(option.enable === "true");
  };
  // #endregion

  // #region change status of option payment
  const onChangeEditOptionEnable = async (
    value: string,
    checked: boolean,
    name: string,
    slug: string
  ) => {
    setLoadingEnableEditOption(value);
    let optionForm: OptionPayment = {
      enable: checked.toString(),
      label: name,
      value: slug,
    };
    await axios
      .patch(`/api/payment_options/${value}`, optionForm, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data) {
          setOptions((prevOptions) =>
            prevOptions.map((option) =>
              option.id === response.data.doc.id ? response.data.doc : option
            )
          );
          notify.success("Option updated successfully");
          setLoadingEnableEditOption("");
        } else {
          notify.error("Option updated failed");
          setLoadingEnableEditOption("");
        }
      });
    setLoadingEnableEditOption("");
  };
  // #endregion

  // #region Delete option payment
  const handleDeleteOptionEdit = async (value: Obj) => {
    if (value.key === "NoExecute") {
      setModalOption(value.open);
      return;
    }
    if (value.key === "Execute") {
      setDeleteLoadModalOption(true);
      try {
        const response = await axios.delete(
          `/api/payment_options/${optionEditRemove}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          await fetchDataOption();
          notify.success("Option deleted successfully");
          setModalOption(value.open);
          setDeleteLoadModalOption(false);
        } else {
          notify.error("Option deleted failed");
          setModalOption(value.open);
          setDeleteLoadModalOption(false);
        }
      } catch (error) {
        notify.error("Option deleted failed");
        setModalOption(value.open);
        setDeleteLoadModalOption(false);
        console.error(error);
      }
    }
  };
  // #endregion

  // #region Update an option
  const UpdateOption = async () => {
    let formData: OptionPayment = {
      label: optionNameEdit,
      value: optionValueEdit,
      enable: optionEnableEdit.toString(),
    };
    setLoadingEditOption(true);
    await axios
      .patch(`/api/payment_options/${optionEditId}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data) {
          console.log(JSON.stringify(response.data));
        } else {
          console.log("no response data");
        }
      })
      .finally(async () => {
        await fetchDataOption();
        setLoadingEditOption(false);
      });
  };

  // #endregion

  // #region Save all data payment setting
  const SavePaymentSettings = async () => {
    // console.log(JSON.stringify(paymentSetting));

    setLoadingSaveSettings(true);
    let data = {
      settings: paymentSetting,
    };

    try {
      await axios
        .post("/api/globals/payment-settings", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data) {
            setLoadingSaveSettings(false);
            notify.success("Payments saved changes successfully");
          }
        })
        .finally(async () => {
          await fetchDataSettings();
          setLoadingSaveSettings(false);
        });
    } catch (error) {
      console.error(error);
      setLoadingSaveSettings(false);
      notify.error("Payments saved changes failed");
    }
  };
  // #endregion

  return (
    <ManagementContainer
      isBell={true}
      maxWidth={true}
      title="Payment Settings"
      besideElement={
        <ActionButton
          loading={loadingSaveSettings}
          actionText="Saving"
          labelText="Save"
          handleClick={() => SavePaymentSettings()}
        />
      }
    >
      <div className="flex gap-5 flex-col">
        <TabComp
          className="w-full"
          defaultValue={options[0]?.value}
          containerClassName="w-full"
          tabHeaderClassName="!h-fit py-1.5"
          outsideTopHeaderElement={
            <div className="w-full flex justify-start items-center mb-5">
              {/* Payment method */}
              <DrawerSheet
                title="Payment Methods"
                size="xl"
                buttonOpenElement={
                  <Button type="button">Payment Methods</Button>
                }
              >
                <div className="flex flex-col gap-5 mt-3 px-7 py-7 bg-gray-50 rounded-md">
                  <div className="flex flex-col gap-2">
                    <Label className="text-base">Name</Label>
                    <Input
                      value={optionName}
                      placeholder="Payment With QR Code, Payment With Credit Card/Master Card, ..."
                      className=" focus:ring-1 text-base focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200"
                      onChange={(e) => setOptionName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-base">Value</Label>
                    <Input
                      value={optionValue}
                      placeholder="ACB, ..."
                      onChange={(e) => setOptionValue(e.target.value)}
                      className="text-base focus:ring-1 focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <Label className="text-base">Enable ?</Label>
                    <Switch
                      checked={optionEnable}
                      onCheckedChange={(e) => setOptionEnable(e)}
                    />
                  </div>
                  <ActionButton
                    className="mt-0 flex items-center gap-2 justify-center w-fit self-end"
                    actionText="Creating"
                    labelText="Create"
                    loading={loading}
                    handleClick={SaveOption}
                  />
                </div>
                <div className="w-full pt-5 pb-3 flex items-center justify-start">
                  <Label className="text-lg font-bold">
                    All payment methods
                  </Label>
                </div>
                <Modal
                  title="Are you sure to delete?"
                  open={modalOption}
                  handle={handleDeleteOptionEdit}
                  isLoad={deleteLoadModalOption}
                  button2="Cancel"
                  button="Delete"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {options?.length > 0 &&
                    options.map((optionManage, optionManageIndex) => (
                      <div
                        key={`option-edit-${optionManageIndex}`}
                        className="col-span-1"
                      >
                        <div className="h-16 w-full border border-gray-300 shadow-md rounded-md flex justify-between items-center px-3">
                          <span className="truncate">
                            {optionManage?.label}
                          </span>

                          <div className="flex items-center justify-end gap-3">
                            {loadingEnableEditOption == optionManage?.id ? (
                              <Loader2 className="animate-spin ease-in-out" />
                            ) : (
                              <Switch
                                checked={
                                  optionManage &&
                                  Boolean(optionManage?.enable === "true")
                                }
                                onCheckedChange={(e) =>
                                  onChangeEditOptionEnable(
                                    optionManage?.id,
                                    e,
                                    optionManage.label,
                                    optionManage.value
                                  )
                                }
                              />
                            )}
                            <DrawerSheet
                              containerClassName="z-[60]"
                              buttonOpenElement={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => ShowEditOption(optionManage)}
                                >
                                  <Pencil strokeWidth={1.5} size={20} />
                                </Button>
                              }
                            >
                              <div className="flex flex-col gap-5 mt-7">
                                <div className="flex flex-col gap-2">
                                  <Label className="text-base">Name</Label>
                                  <Input
                                    value={optionNameEdit}
                                    className=" focus:ring-1 text-base focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200"
                                    onChange={(e) => {
                                      setOptionNameEdit(e.target.value);
                                      setOptionValueEdit(
                                        convertToSlug(e.target.value)
                                      );
                                    }}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Label className="text-base">Value</Label>
                                  <Input
                                    value={optionValueEdit}
                                    disabled={true}
                                    className="pointer-events-none text-base select-none focus:ring-1 focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Label className="text-base">Value</Label>
                                  <Switch
                                    checked={optionEnableEdit}
                                    onCheckedChange={(e) =>
                                      setOptionEnableEdit(e)
                                    }
                                  />
                                </div>
                                <ActionButton
                                  loading={loadingEditOption}
                                  handleClick={UpdateOption}
                                />
                              </div>
                            </DrawerSheet>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setOptionEditRemove(optionManage?.id);
                                setModalOption(true);
                              }}
                            >
                              <Trash
                                className="text-red-600"
                                strokeWidth={1.5}
                                size={20}
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </DrawerSheet>
            </div>
          }
          tabHeader={
            !loadingFetchOption ? (
              <div className="flex items-center justify-start flex-wrap">
                {options?.length > 0 ? (
                  options.map((option, index) => (
                    <TabsTrigger
                      key={index}
                      value={`${option.value}`}
                      className="rounded-md text-base"
                    >
                      {option.label}
                    </TabsTrigger>
                  ))
                ) : (
                  <EmptyElement
                    iconElement={<></>}
                    containerClassName="flex items-center justify-center"
                    text="No payment method available"
                    childrenAfter={
                      <DrawerSheet
                        title="Payment Methods"
                        size="xl"
                        buttonOpenElement={
                          <Button
                            variant="link"
                            type="button"
                            className="underline text-base font-medium !px-0 text-slate-500"
                          >
                            Create Payment Method
                          </Button>
                        }
                      >
                        <div className="flex flex-col gap-5 mt-3 px-7 py-7 bg-gray-50 rounded-md">
                          <div className="flex flex-col gap-2">
                            <Label className="text-base">Name</Label>
                            <Input
                              value={optionName}
                              className=" focus:ring-1 text-base focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200"
                              onChange={(e) => setOptionName(e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-base">Value</Label>
                            <Input
                              value={optionValue}
                              onChange={(e) => setOptionValue(e.target.value)}
                              className="pointer-events-none text-base select-none focus:ring-1 focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200"
                            />
                          </div>
                          <div className="flex flex-row justify-start items-center gap-2">
                            <Label className="text-base">Enable ?</Label>
                            <Switch
                              checked={optionEnable}
                              onCheckedChange={(e) => setOptionEnable(e)}
                            />
                          </div>
                          <ActionButton
                            className="mt-0 flex items-center gap-2 justify-center w-fit self-end"
                            actionText="Creating"
                            labelText="Create"
                            loading={loading}
                            handleClick={SaveOption}
                          />
                        </div>
                        <div className="w-full pt-5 pb-3 flex items-center justify-start">
                          <Label className="text-lg font-bold">
                            All payment methods
                          </Label>
                        </div>
                        <Modal
                          title="Are you sure to delete?"
                          open={modalOption}
                          handle={handleDeleteOptionEdit}
                          isLoad={deleteLoadModalOption}
                          button2="Cancel"
                          button="Delete"
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                          {options?.length > 0 &&
                            options.map((optionManage, optionManageIndex) => (
                              <div
                                key={`option-edit-${optionManageIndex}`}
                                className="col-span-1"
                              >
                                <div className="h-16 w-full border border-gray-300 shadow-md rounded-md flex justify-between items-center px-3">
                                  <span>{optionManage?.label}</span>
                                  {loadingEnableEditOption ? (
                                    <Loader2 className="animate-spin ease-in-out" />
                                  ) : (
                                    <Switch
                                      checked={
                                        optionManage &&
                                        Boolean(optionManage?.enable === "true")
                                      }
                                      onCheckedChange={(e) =>
                                        onChangeEditOptionEnable(
                                          optionManage?.id,
                                          e,
                                          optionManage.label,
                                          optionManage.value
                                        )
                                      }
                                    />
                                  )}

                                  <div className="flex items-center justify-end gap-3">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setOptionEditRemove(optionManage?.id);
                                        setModalOption(true);
                                      }}
                                    >
                                      <Trash
                                        className="text-red-600"
                                        strokeWidth={1.5}
                                        size={20}
                                      />
                                    </Button>
                                    <DrawerSheet
                                      containerClassName="z-[60]"
                                      buttonOpenElement={
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            ShowEditOption(optionManage)
                                          }
                                        >
                                          <Pencil strokeWidth={1.5} size={20} />
                                        </Button>
                                      }
                                    >
                                      <div className="flex flex-col gap-5 mt-7">
                                        <div className="flex flex-col gap-2">
                                          <Label className="text-base">
                                            Name
                                          </Label>
                                          <Input
                                            value={optionNameEdit}
                                            className=" focus:ring-1 text-base focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200"
                                            onChange={(e) => {
                                              setOptionNameEdit(e.target.value);
                                              setOptionValueEdit(
                                                convertToSlug(e.target.value)
                                              );
                                            }}
                                          />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                          <Label className="text-base">
                                            Value
                                          </Label>
                                          <Input
                                            value={optionValueEdit}
                                            disabled={true}
                                            className="pointer-events-none text-base select-none focus:ring-1 focus:ring-gray-900 focus:outline-none border-none ring-1 focus:border-none focus-visible:ring-1 ring-gray-300 transition-all duration-200"
                                          />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                          <Label className="text-base">
                                            Value
                                          </Label>
                                          <Switch
                                            checked={optionEnableEdit}
                                            onCheckedChange={(e) =>
                                              setOptionEnableEdit(e)
                                            }
                                          />
                                        </div>
                                        <ActionButton
                                          loading={loadingEditOption}
                                          handleClick={UpdateOption}
                                        />
                                      </div>
                                    </DrawerSheet>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </DrawerSheet>
                    }
                  />
                )}
              </div>
            ) : (
              <SkeletonDynamics
                layout="table-column"
                count={1}
                columnCount={5}
                itemClassName="min-w-[7rem] !h-[0.5rem] !rounded-full"
                mode="normal"
              />
            )
          }
          tabContent={
            <div>
              {options.map((option, optionIndex) => (
                <TabsContent key={optionIndex} value={`${option.value}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {paymentSetting?.length > 0 &&
                      paymentSetting?.map((settings, jndex) => {
                        return (
                          settings.options?.value === option.value &&
                          settings?.portal_list?.length > 0 &&
                          settings.portal_list.map((portal, zndex) => (
                            <div
                              key={zndex}
                              className={`h-auto w-full p-3 hover:shadow-lg transition-all duration-200 aspect-[1.586] bg-gray-200 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-gray-100 flex flex-col justify-between `}
                            >
                              <div
                                className={`w-full flex ${portal?.portal?.image ? "justify-between" : "justify-end"}`}
                              >
                                {portal?.portal && (
                                  <img
                                    src={`${portal.portal.image}`}
                                    loading="lazy"
                                    className="w-1/4 h-auto"
                                  />
                                )}
                                <Switch
                                  className="!data-[state=checked]:bg-green-600"
                                  checked={Boolean(portal?.enabled)}
                                  onCheckedChange={(e) =>
                                    GetEnable(e, zndex, jndex)
                                  }
                                />
                              </div>
                              <div className="flex w-full justify-between items-center">
                                <span
                                  className={`text-2xl text-gray-700 font-extrabold`}
                                >
                                  {portal?.portal?.label || "Unknown"}
                                </span>
                                <DrawerSheet
                                  title={currOption?.label}
                                  buttonOpenElement={
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="hover:bg-transparent"
                                      onClick={() => {
                                        OptionSelect(option);
                                      }}
                                    >
                                      <EllipsisVertical
                                        size={20}
                                        strokeWidth={1.5}
                                        className="text-gray-900"
                                      />
                                    </Button>
                                  }
                                >
                                  <div className="w-full h-[80dvh] scrollbar-thin overflow-y-scroll overflow-x-hidden pr-3">
                                    {paymentSetting
                                      ?.filter(
                                        (settings) =>
                                          settings?.options?.value ===
                                          currOption?.value
                                      )
                                      .map((settings, settingIndex) => (
                                        <div
                                          key={settingIndex}
                                          className="w-full flex flex-col gap-5 ml-1"
                                        >
                                          {settings.portal_list?.length > 0 &&
                                            settings?.portal_list?.map(
                                              (portal, portalIndex) => {
                                                return (
                                                  <div
                                                    key={portalIndex}
                                                    className="w-full flex flex-col p-3 bg-gray-100 rounded-lg"
                                                  >
                                                    <Modal
                                                      title={`Are you sure to delete 'Portal ${portalIndex + 1}' ?`}
                                                      button2="Cancel"
                                                      button="Delete"
                                                      handle={(value: Obj) =>
                                                        RemovePortal(
                                                          settingIndex,
                                                          portalIndex,
                                                          value
                                                        )
                                                      }
                                                      open={
                                                        isModal === portalIndex
                                                          ? true
                                                          : false
                                                      }
                                                    />
                                                    <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      className="self-end"
                                                      onClick={() =>
                                                        ShowModalDelete(
                                                          portalIndex
                                                        )
                                                      }
                                                    >
                                                      <Trash
                                                        size={20}
                                                        strokeWidth={1.5}
                                                        className="text-red-600"
                                                      />
                                                    </Button>
                                                    <RelationshipSingleField
                                                      className="!p-0 !mt-0 "
                                                      title={`Portal ${portalIndex + 1}`}
                                                      titleClass="!text-base"
                                                      size="fit"
                                                      defaultValue={
                                                        portal.portal
                                                      }
                                                      options={portals}
                                                      onChange={(data) => {
                                                        GetPortal(
                                                          data,
                                                          portalIndex,
                                                          settingIndex
                                                        );
                                                      }}
                                                    />

                                                    <RelationshipMultiField
                                                      className="!p-0 "
                                                      title={`Childrens`}
                                                      titleClass="!text-base"
                                                      size="fit"
                                                      defaultValue={
                                                        portal.childrens
                                                      }
                                                      options={banks}
                                                      onChange={(data) => {
                                                        GetPortalBanks(
                                                          data,
                                                          portalIndex,
                                                          settingIndex
                                                        );
                                                      }}
                                                    />
                                                    <div className="flex items-center justify-start mt-5 gap-2">
                                                      <Label className="text-base">
                                                        Enable ?
                                                      </Label>
                                                      <Switch
                                                        checked={
                                                          typeof portal.enabled ===
                                                          "boolean"
                                                            ? portal.enabled
                                                            : Boolean(
                                                                portal.enabled
                                                              )
                                                        }
                                                        onCheckedChange={(e) =>
                                                          GetEnable(
                                                            e,
                                                            portalIndex,
                                                            settingIndex
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                        </div>
                                      ))}
                                    <AddNewDashedLineButton
                                      className="mt-5 w-full"
                                      onClick={() => AddNewPortal(option)}
                                    >
                                      <Label className="pointer-events-none text-base">
                                        Add More
                                      </Label>
                                    </AddNewDashedLineButton>
                                  </div>
                                </DrawerSheet>
                              </div>
                            </div>
                          ))
                        );
                      })}
                    {/* Payment portals */}
                    <DrawerSheet
                      title={currOption?.label}
                      buttonOpenElement={
                        <AddNewDashedLineButton
                          className="h-auto w-full aspect-[1.586] rounded-md cursor-pointer flex items-center justify-center"
                          onClick={() => {
                            OptionSelect(option);
                            // setPortals2([]);
                          }}
                        >
                          <CirclePlus
                            size={20}
                            strokeWidth={1.5}
                            className="text-gray-500"
                          />
                        </AddNewDashedLineButton>
                      }
                    >
                      <div className="w-full h-[80dvh] scrollbar-thin overflow-y-scroll overflow-x-hidden pr-3">
                        {paymentSetting
                          ?.filter(
                            (settings) =>
                              settings?.options?.value === currOption?.value
                          )
                          .map((settings, settingIndex) => (
                            <div
                              key={settingIndex}
                              className="w-full flex flex-col gap-5 ml-1 "
                            >
                              {settings.portal_list?.length > 0 &&
                                settings?.portal_list?.map(
                                  (portal, portalIndex) => (
                                    <div
                                      key={portalIndex}
                                      className="w-full flex flex-col p-3 bg-gray-100 rounded-lg"
                                    >
                                      <Modal
                                        title={"Are you sure to delete?"}
                                        button2="Cancel"
                                        button="Delete"
                                        handle={(value: Obj) =>
                                          RemovePortal(
                                            settingIndex,
                                            portalIndex,
                                            value
                                          )
                                        }
                                        open={
                                          isModal === portalIndex ? true : false
                                        }
                                      ></Modal>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="self-end"
                                        onClick={() =>
                                          ShowModalDelete(portalIndex)
                                        }
                                      >
                                        <X
                                          size={20}
                                          strokeWidth={1.5}
                                          className="text-red-600"
                                        />
                                      </Button>
                                      <RelationshipSingleField
                                        className="!p-0 !mt-0 "
                                        titleClass="text-base"
                                        title={`Portal ${portalIndex + 1}`}
                                        size="fit"
                                        defaultValue={portal.portal}
                                        options={portals}
                                        onChange={(data) => {
                                          GetPortal(
                                            data,
                                            portalIndex,
                                            settingIndex
                                          );
                                          // PortalInOption(option.id, data.id);
                                        }}
                                      />

                                      <RelationshipMultiField
                                        className="!p-0"
                                        title={`Childrens`}
                                        titleClass="!text-base"
                                        size="fit"
                                        defaultValue={portal.childrens}
                                        options={banks}
                                        onChange={(data) => {
                                          GetPortalBanks(
                                            data,
                                            portalIndex,
                                            settingIndex
                                          );
                                        }}
                                      />
                                      <div className="flex items-center justify-start mt-5 gap-2">
                                        <Label className="text-base">
                                          Enable ?
                                        </Label>
                                        <Switch
                                          checked={
                                            typeof portal.enabled === "boolean"
                                              ? portal.enabled
                                              : Boolean(portal.enabled)
                                          }
                                          onCheckedChange={(e) =>
                                            GetEnable(
                                              e,
                                              portalIndex,
                                              settingIndex
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          ))}
                        <AddNewDashedLineButton
                          className="mt-5 w-full"
                          onClick={() => AddNewPortal(option)}
                        >
                          <Label className="pointer-events-none text-base">
                            Add More
                          </Label>
                        </AddNewDashedLineButton>
                      </div>
                    </DrawerSheet>
                  </div>
                </TabsContent>
              ))}
            </div>
          }
        ></TabComp>
      </div>
      <ToastNotify />
    </ManagementContainer>
  );
};

export default PaymentSettings;
