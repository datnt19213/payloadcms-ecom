import React, {useState} from "react";
import {GridCol3, ManagementContainer} from "../../components/container";
import {
  FormExternalLinks,
  FormKafka,
  FormPayment,
  FormSocialLinks,
} from "../../components/particals";
import {TextField, UploadField} from "../../components/fields";
import {
  SocialLink,
  PaymentSettings,
  KafkaSettings,
  ExternalURLConfiguration,
} from "../../types";

const ConfigurationsPage = () => {
  // #region useStates variables
  const [logo, setLogo] = useState<string>("");
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    payment_provider: "",
    api_key: "",
    secret_key: "",
  });
  const [shippingSettings, setShippingSettings] = useState<string>("");
  const [serviceSettings, setServiceSettings] = useState<string>("");
  const [kafkaSettings, setKafkaSettings] = useState<KafkaSettings>({
    kafka_broker: "",
    topic: "",
    group_id: "",
  });
  const [externalURLConfigurations, setExternalURLConfigurations] =
    useState<ExternalURLConfiguration>({
      url_name: "",
      url: "",
    });
  // #endregion

  // #region onChange functions get data

  const handlePaymentSettingsChange = (
    field: keyof PaymentSettings,
    val: any
  ) => {
    setPaymentSettings((prevSettings) => ({
      ...prevSettings,
      [field]: val,
    }));
  };

  const handleShippingSettingsChange = (val: any) => {
    setShippingSettings(val);
  };

  const handleServiceSettingsChange = (val: any) => {
    setServiceSettings(val);
  };

  const handleKafkaSettingsChange = (field: keyof KafkaSettings, val: any) => {
    setKafkaSettings((prevSettings) => ({
      ...prevSettings,
      [field]: val,
    }));
  };

  const handleExternalURLConfigurationsChange = (
    field: keyof ExternalURLConfiguration,
    val: any
  ) => {
    setExternalURLConfigurations((prevConfig) => ({
      ...prevConfig,
      [field]: val,
    }));
  };
  // #endregion

  return (
    <ManagementContainer title="Configurations" maxWidth={true}>
      {/* Shipping and services */}
      <GridCol3 className="gap-7 p-5">
        <div className="col-span-1 flex flex-col gap-5 text-base">
          <span className="font-semibold">Shipping & Services</span>
          <span className="">
            The shipping and services that details the delivery and additional
            services available to customers for their orders.
          </span>
        </div>
        <div className="col-span-1 lg:col-span-2 border border-gray-100 shadow-md p-5 rounded-lg">
          <div className="w-full gap-2 flex flex-col">
            <TextField title="Shipping" />
            <span className="text-gray-500 mt-2"></span>
          </div>
          <div className="w-full gap-2 flex flex-col">
            <TextField title="Service" />
            <span className="text-gray-500 mt-2"></span>
          </div>
        </div>
      </GridCol3>
      {/* Payment */}
      <GridCol3 className="gap-7 p-5">
        <div className="col-span-1 flex flex-col gap-5 text-base">
          <span className="font-semibold">Payment</span>
          <span className="">
            The settings of payment that outlines the accepted methods of
            payment for complete the transactions.
          </span>
        </div>
        <div className="col-span-1 lg:col-span-2 border border-gray-100 shadow-md p-5 rounded-lg">
          <FormPayment />
        </div>
      </GridCol3>
      {/* Kafka */}
      <GridCol3 className="gap-7 p-5">
        <div className="col-span-1 flex flex-col gap-5 text-base">
          <span className="font-semibold">Kafka</span>
          <span className="">
            The kafke settings for brokers, topics, and group to manage data
            streaming and processing.
          </span>
        </div>
        <div className="col-span-1 lg:col-span-2 border border-gray-100 shadow-md p-5 rounded-lg">
          <FormKafka />
        </div>
      </GridCol3>
    </ManagementContainer>
  );
};

export default ConfigurationsPage;
