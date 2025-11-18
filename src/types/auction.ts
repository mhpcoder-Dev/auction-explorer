export type AssetType = 'land-buildings' | 'trailers' | 'cars' | 'motorcycles' | 'bikes' | 'other';

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  location: string;
  country: string;
  state?: string;
  region?: string;
  city?: string;
  assetType: AssetType;
  auctionStartDate?: string;
  auctionEndDate?: string;
  sourceUrl: string;
  sourceName: string;
  isActive: boolean;
  isFuture: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface DataSource {
  id: string;
  name: string;
  country: string;
  attribution?: {
    required: boolean;
    text: string;
    link: string;
    license: string;
  };
}

export interface CountryGroup {
  country: string;
  items: LocationGroup[];
}

export interface LocationGroup {
  location: string;
  items: AuctionItem[];
}
