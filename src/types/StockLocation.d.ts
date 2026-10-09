export interface RootObject {
  stock_locations: Stocklocation[];
  count: number;
  offset: number;
  limit: number;
}

export interface Stocklocation {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  address_id: string;
  metadata: Metadata;
}

export interface Metadata {}
