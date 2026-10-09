import {CollectionConfig, GlobalConfig} from "payload/types";
import {
  APIKeyField,
  GroupIDField,
  KafkaBrokerField,
  PaymentProviderField,
  SecretKeyField,
  ServiceSettingField,
  ShippingSettingField,
  TopicField,
} from "../components/fields";
import {ConfigurationsPage} from "../pages/settings_and_configurations";

const Configurations: GlobalConfig = {
  slug: "Configurations",
  label: "Configurations",
  access: {
    read: () => true,
    update: ({req: {user}}) => user.roles.includes("admin"),
  },
  admin: {
    components: {
      views: {
        Edit: ConfigurationsPage,
      },
    },
  },
  fields: [
    {
      name: "payment_settings",
      label: "Payment Settings",
      type: "group",
      fields: [
        {
          name: "payment_provider",
          label: "Payment Provider",
          type: "text",
          admin: {
            components: {
              Field: PaymentProviderField,
            },
          },
        },
        {
          name: "api_key",
          label: "API Key",
          type: "text",
          admin: {
            components: {
              Field: APIKeyField,
            },
          },
        },
        {
          name: "secret_key",
          label: "Secret Key",
          type: "text",
          admin: {
            components: {
              Field: SecretKeyField,
            },
          },
        },
      ],
    },
    {
      name: "shipping_settings",
      label: "Shipping Settings",
      type: "text",
      admin: {
        components: {
          Field: ShippingSettingField,
        },
      },
    },
    {
      name: "service_settings",
      label: "Service Settings",
      type: "text",
      admin: {
        components: {
          Field: ServiceSettingField,
        },
      },
    },
    {
      name: "kafka_settings",
      label: "Kafka Settings",
      type: "group",
      fields: [
        {
          name: "kafka_broker",
          label: "Kafka Broker",
          type: "text",
          admin: {
            components: {
              Field: KafkaBrokerField,
            },
          },
        },
        {
          name: "topic",
          label: "Topic",
          type: "text",
          admin: {
            components: {
              Field: TopicField,
            },
          },
        },
        {
          name: "group_id",
          label: "Group ID",
          type: "text",
          admin: {
            components: {
              Field: GroupIDField,
            },
          },
        },
      ],
    },
  ],
};

export default Configurations;
