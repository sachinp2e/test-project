// *** Initial state interface: Catalog slice  *** //

export default interface IInitialState {
  catalogsData: ICatalogData;
  assetsData: IAssetData;
  topCatalogsData: ITopCatalogData;
}

// *** Action getAllCatalogs Param Interface *** //

export interface IGetCatalogsParams {
  filters?: any;
  loadMore?: boolean;
  latestPage?: number;
  pageSize?: number;
  userId?: string;
  id?: string;
  duration?: string;
  period?: string;
  search?: string;
}

// *** Slice Catalogs State Interfaces *** //

export interface ICatalogs {
  id: string;
  creatorId: string;
  name: string;
  image: string;
  bannerImage: string;
  symbol: string;
  description: string;
  shortUrl: string;
  likes: number;
  views: number;
  searchCount: number;
  volume: string;
  highestBid: number;
  highestOffer: number;
  floorPrice: number;
  website: string;
  twitter: string;
  discord: string;
  assetCount: number;
  isLegallyVerified: boolean;
  tokenStandard: string;
  txnHash: string;
  image_resized: string;
  isFavourite: boolean;
  creator: {
    firstName: string;
    lastName:string;
    userName: string;
    profileImage: string;
    isKycVerified: boolean;
  };
  creator_userName?: string;
  recentAssets: string[];
}

interface ICatalogData {
  catalogs: ICatalogs[];
  totalCount: number;
  serverError: any;
  latestPage: number;
  hasMore: boolean;
  allCatalogsLoading: boolean;
  trendingCatalogsLoading: boolean;
  catalogDetailsLoading: boolean;
  addCatalogLoading: boolean;
  favUnfavCatalogLoading: boolean;
  catalogDetails: any; // {ICatalogs}
  trendingCatalogs: any; // {allTrendingCatalogs: ICatalogs[], SEVEN_DAYS: ICatalogs, ONE_MONTH: ICatalogs, SIX_MONTH: ICatalogs}
}

// *** Action getTopCatalogs Interface *** //

export interface ITopCatalog {
  catalogueId: string;
  catalogueName: string;
  catalogueImage: string;
  creatorId: string;
  creatorName: string;
  items: number;
  floorprice: number;
  totalEarnings: string;
  catalogueImage_resized: string;
}

interface ITopCatalogData {
  catalogs: ITopCatalog[];
  totalCount: number;
  serverError: any;
  latestPage: number;
  hasMore: boolean;
  topCatalogsloading: boolean;
  topCatalogsByDuration: any; // {duration1: {catalogs: ICatalogs[]; totalCount: number; serverError: any; latestPage: number; hasMore: boolean; loading: boolean;}, ...}
}

// *** Action getAssets Param Interface *** //

export interface IGetAssetsParams {
  filters?: any;
  loadMore?: boolean;
  latestPage?: number;
  creatorId?: string;
  categoryId?: string;
  catalogId?: string;
  ownerId?: string;
}

// *** Slice Assets State Interfaces *** //

interface IAssets {
  id: string;
  creatorId: string;
  ownerId: string;
  name: string;
  description: string;
  isMultiple: boolean;
  isActive: boolean;
  totalSupply: number;
  catalogueId: string;
  categoryId: string;
  currencyId: string;
  royalty: number;
  featured: boolean;
  lazyMinting: boolean;
  mintStatus: string;
  tokenId: number;
  highestBid: number;
  highestOffer: number;
  assetMediaUrl: string;
  likes: number;
  assetThumbnail: string;
  putOnMarketplace: boolean;
  orderType: string;
  price: number;
  isLegallyVerified: boolean;
  minBid: number;
  bidStartDate: string;
  bidEndDate: string;
  properties: string;
  physicalAsset: boolean;
  physicalAssetDescription: string;
  created_at: string;
  creator: {
    id: string;
    firstName: string;
    userName: string;
    profileImage: string;
  };
  owner: {
    id: string;
    firstName: string;
    userName: string;
    profileImage: string | null;
  };
  category: {
    id: string;
    name: string;
  };
  catalogue: {
    id: string;
    name: string;
    image: string;
    isLegallyVerified: boolean;
  };
  currency: string | null;
  assetMediaUrl_resized: string;
  isFavourite: boolean;
}

interface IAssetData {
  assets: IAssets[];
  totalCount: number;
  serverError: any;
  latestPage: number;
  hasMore: boolean;
  loading: boolean;
  catalogAssets: any; // {assets: IAssets[]; totalCount: number; serverError: any; latestPage: number; hasMore: boolean; loading: boolean;}
  categoryAssets: any; // {categoryAssetsId1: {assets: IAssets[]; totalCount: number; serverError: any; latestPage: number; hasMore: boolean; loading: boolean;}, ...}
}

// *** Action getAssets Param Interface *** //

export interface IAddCatalogs {
  payload: FormData;
  cb?: (data?: any) => void;
}
