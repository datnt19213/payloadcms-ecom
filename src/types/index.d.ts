export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

/* The `export interface Obj` is defining an interface named `Obj` that specifies a structure for
objects with properties `open` (boolean) and `key` (which can only have the values "NoExecute" or
"Execute"). This interface can be exported and used in other parts of the codebase to ensure
consistency in the shape of objects that adhere to this structure. */
export interface Obj {
  open: boolean;
  key: "NoExecute" | "Execute";
}

/* The `ValueLabel` interface is defining a structure for objects that have three properties: `id`,
`label`, and `value`. This interface is used to define the shape of objects that contain a label and
a corresponding value, with an optional `id` property. */
export interface ValueLabel {
  id?: string;
  label: string;
  value: string;
}
/* The `KeyValue` interface is defining a structure for objects that have three properties: `id`,
`label`, and `value`. */
export interface KeyValue {
  id?: string;
  label: string;
  value: string;
}

export type Sidebar = SidebarItems[];

export type SidebarItems = {
  label: string;
  disable: boolean;
  value: string;
  link: string;
  icon?: string;
  roles: any[];
  child: SidebarItems[];
};

export {
  IRootCategories,
  ProductCategory,
  CategoryChild,
  ParentCategory,
  CategoryFormatted,
  TransformedCategoryFormatted,
} from "./Categories";

export {RootObject, Stocklocation, Metadata} from "./StockLocation";
export {IAmounts, IDates, IOutputData} from "./Filter";


// #region payload setting collection interface

export interface SocialLink {
  logo: any;
  name: string;
  url: string;
}

export interface PaymentSettings {
  payment_provider: string;
  api_key: string;
  secret_key: string;
}

export interface KafkaSettings {
  kafka_broker: string;
  topic: string;
  group_id: string;
}

export interface ExternalURLConfiguration {
  url_name: string;
  url: string;
}

export interface SettingConfigurations {
  site_name: string;
  logo: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  social_links: SocialLink[];
  payment_settings: PaymentSettings;
  shipping_settings: string;
  service_settings: string;
  kafka_settings: KafkaSettings;
  external_url_configurations: ExternalURLConfiguration;
}
// #endregion


/**
 *
 * Auth payload interface
 *
 * @export
 * @interface User
 * 
 * @param id 
 * @param email
 * @param token
 */
export interface User {
  id: number;
  email: string;
  token: string;
}
