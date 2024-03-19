import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createAsset, getAllAssets, getAssetsByCatalogueId
} from './assets.action';

// object that will have key as catalogue id and value as assets array
export type AssetsByCatalogue = {
  [key: string]: {
    assets: any[];
    pagination: {
      page: number | null;
      pageSize: number | null;
      totalCount: number;
      totalPages: number | null;
    };
    latestPage?:number;
    hasMore?: boolean,
  };
};

export type AssetsState = {
  assets: any[];
  assetsByCatalogue: AssetsByCatalogue;
  pagination: {
    page: number | null;
    pageSize: number | null;
    totalCount: number;
    totalPages: number | null;
  };
  latestPage?:number;
  hasMore?: boolean,
  loading: boolean;
};

const initialState: AssetsState = {
  assets: [],
  assetsByCatalogue: {},
  pagination: {
    page: null,
    pageSize: null,
    totalCount: 0,
    totalPages: null,
  },
  latestPage:1,
  hasMore: true,
  loading: false,
};

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    resetExploreAssets: (state: AssetsState) => {
      state.assets = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllAssets.pending, (state: AssetsState) => {
      state.loading = true;
    });
    builder.addCase(
      getAllAssets.fulfilled,
      (state: AssetsState, action: any) => {
        const newData = action.payload?.result?.data || [];
        state.assets = action.payload?.loadMore ? [...state.assets, ...newData]:newData
        state.latestPage = action.payload?.result?.pagination?.page;
        state.hasMore =  action.payload.result?.pagination?.totalPages > action.payload?.latestPage;
        state.pagination = action.payload?.result?.pagination || {};
        state.loading = false;
      },
    );
    builder.addCase(getAllAssets.rejected, (state: AssetsState) => {
      state.loading = false;
    });

    // Assets By Catalogue
    builder.addCase(getAssetsByCatalogueId.pending, (state: AssetsState) => {
      state.loading = true;
    });
    builder.addCase(
      getAssetsByCatalogueId.fulfilled,
      (state: AssetsState, action: PayloadAction<any>) => {
        // id the assets for the catalogue id already exists then append the data and pagination
        if (state.assetsByCatalogue[action.payload.catalogueId]) {
          state.assetsByCatalogue = {
            ...state.assetsByCatalogue,
            [action.payload.catalogueId]: {
              assets: [
                ...state.assetsByCatalogue[action.payload.catalogueId].assets,
                ...action.payload.assets,
              ],
              pagination: action.payload.pagination,
            },
          };
        } else {
          state.assetsByCatalogue = {
            ...state.assetsByCatalogue,
            [action.payload.catalogueId]: action.payload.assets,
          };
        }
        state.loading = false;
      },
    );

    // Create Asset
    builder.addCase(createAsset.pending, (state: AssetsState) => {
      state.loading = true;
    });
    builder.addCase(
      createAsset.fulfilled,
      (state: AssetsState, action: any) => {
        state.assets = [action.payload?.result, ...state.assets];
        state.loading = false;
      },
    );
    builder.addCase(createAsset.rejected, (state: AssetsState) => {
      state.loading = false;
    });
  },
});

export const { resetExploreAssets } = assetsSlice.actions;
export default assetsSlice.reducer;
