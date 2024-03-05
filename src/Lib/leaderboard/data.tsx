import catalogimg from '../../Assets/_images/avatar.svg';

export interface ILeaderboardCatalogType {
  topCatalogs: {
    id: number;
    catalog: any;
    name: string;
    totalAssets: string;
    totalSale: string;
    minPrice: string;
  }[];
}

export const leaderboardTopCatalogs = [
  {
    id: 1,
    catalog: catalogimg,
    name: 'Collection Name 1',
    totalAssets: '2',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 2,
    catalog: catalogimg,
    name: 'Collection Name 2',
    totalAssets: '10',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 3,
    catalog: catalogimg,
    name: 'Collection Name 3',
    totalAssets: '4',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 4,
    catalog: catalogimg,
    name: 'Collection Name 4',
    totalAssets: '14',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 5,
    catalog: catalogimg,
    name: 'Collection Name 5',
    totalAssets: '12',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 6,
    catalog: catalogimg,
    name: 'Collection Name 6',
    totalAssets: '6',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 7,
    catalog: catalogimg,
    name: 'Collection Name 7',
    totalAssets: '9',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 8,
    catalog: catalogimg,
    name: 'Collection Name 7',
    totalAssets: '9',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 9,
    catalog: catalogimg,
    name: 'Collection Name 7',
    totalAssets: '9',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 10,
    catalog: catalogimg,
    name: 'Collection Name 7',
    totalAssets: '9',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 11,
    catalog: catalogimg,
    name: 'Collection Name 7',
    totalAssets: '9',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  },
  {
    id: 12,
    catalog: catalogimg,
    name: 'Collection Name 7',
    totalAssets: '9',
    totalSale: '3000.00 USD',
    minPrice: '3000.00 USD',
  }
];
