export interface CreateAssetsProps {}

export type CreateAssetFormDataType = {
  id?: string;
  name: string;
  description: string;
  isMultiple: boolean;
  totalSupply?: number;
  onSaleSupply?: number;
  catalogueId: string;
  categoryId: string;
  royalty?: number;
  lazyMinting: boolean;
  putOnMarketplace: boolean;
  properties: string;
  orderType: 'fixed' | 'timed';
  price?: number;
  currencyId: string;
  minBid?: number;
  bidStartDate?: string;
  bidEndDate?: string;
  media: any;
  thumbnail?: File | string | null;
  // featured: boolean;
  physicalAsset: boolean;
  physicalAssetDescription?: string;
  isDefaultCatalogue?: boolean;
};
