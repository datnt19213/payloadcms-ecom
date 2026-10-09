export interface IAmounts {
  from: any;
  to: any;
}

export interface IDates {
  from: any;
  to: any;
}

export interface IOutputData {
  orderStatus: string[];
  paymentStatus: string[];
  amounts: IAmounts;
  dates: IDates;
}

export interface IOutputProductData {
  status: string[];
  categories: string[];
  tags: string[];
  sales_channel: string[];
}
