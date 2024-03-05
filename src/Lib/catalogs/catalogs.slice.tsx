import { createSlice } from '@reduxjs/toolkit';
import {
  favUnfavCatalogAction,
  getAllCatalogs,
  getCataLogDetails,
  getTopCatalogs,
  getTrendingCatalogs,
} from './catalogs.action';
import { addCatalog } from './catalogs.action';
import { getAssetsById } from './catalogs.action';
import IInitialState from './catalogsInterface';

// *** All catalogs initial state & slice *** //

const initialState: IInitialState = {
  catalogsData: {
    catalogs: [],
    totalCount: 0,
    allCatalogsLoading: true,
    trendingCatalogsLoading: true,
    catalogDetailsLoading: true,
    addCatalogLoading: false,
    favUnfavCatalogLoading: false,
    latestPage: 1,
    hasMore: true,
    serverError: null,
    catalogDetails: {},
    trendingCatalogs: {},
  },
  assetsData: {
    assets: [],
    totalCount: 0,
    loading: true,
    latestPage: 1,
    hasMore: true,
    serverError: null,
    catalogAssets: {},
    categoryAssets: {},
  },
  topCatalogsData: {
    catalogs: [],
    totalCount: 0,
    topCatalogsloading: true,
    latestPage: 1,
    hasMore: true,
    serverError: null,
    topCatalogsByDuration: {},
  },
};

const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: {
    updateCatalogFavAssets: (state: IInitialState, action) => {
      const updatedFavIndex =
        state.assetsData.catalogAssets.assets.findIndex((asset: any) =>
          asset.id === action.payload?.assetId);
        state.assetsData.catalogAssets.assets[updatedFavIndex] = {
          ...state.assetsData.catalogAssets.assets[updatedFavIndex],
          isFavourite: action.payload?.isLike
      }
    }
  },
  extraReducers: (builder) => {
    // getAllCatalogs reducers
    builder
      .addCase(getAllCatalogs.pending, (state: IInitialState) => {
        state.catalogsData.allCatalogsLoading = true;
        state.catalogsData.serverError = null;
      })
      .addCase(getAllCatalogs.fulfilled, (state: IInitialState, action) => {
        state.catalogsData.allCatalogsLoading = false;
        const newData = action.payload?.resObj?.data || [];
        state.catalogsData.catalogs = action.payload.loadMore
          ? [...state.catalogsData.catalogs, ...newData]
          : newData;
        state.catalogsData.totalCount =
          action.payload.resObj?.pagination?.totalCount;
        state.catalogsData.latestPage = action.payload.resObj?.pagination?.page;
        state.catalogsData.hasMore =
          action.payload.resObj?.pagination?.totalPages >
          action.payload?.latestPage;
      })
      .addCase(getAllCatalogs.rejected, (state: IInitialState, action) => {
        state.catalogsData.allCatalogsLoading = false;
        state.catalogsData.serverError = action.payload;
      });
    // topCatalogs data reducers
    builder
      .addCase(getTopCatalogs.pending, (state: IInitialState) => {
        state.topCatalogsData.topCatalogsloading = true;
        state.topCatalogsData.serverError = null;
      })
      .addCase(getTopCatalogs.fulfilled, (state: IInitialState, action) => {
        state.topCatalogsData.topCatalogsloading = false;
        if (action.payload?.duration) {
          const duration = action.payload?.duration;
          state.topCatalogsData.topCatalogsByDuration[duration] = {
            loading: false,
          };
          const newData = action.payload?.resObj?.data || [];
          state.topCatalogsData.topCatalogsByDuration[duration].catalogs =
            action.payload.loadMore
              ? [
                  ...state.topCatalogsData.topCatalogsByDuration[duration]
                    .catalogs,
                  ...newData,
                ]
              : newData;
          state.topCatalogsData.topCatalogsByDuration[duration].totalCount =
            action.payload.resObj?.pagination?.totalCount;
          state.topCatalogsData.topCatalogsByDuration[duration].latestPage =
            action.payload.resObj?.pagination?.page;
          state.topCatalogsData.topCatalogsByDuration[duration].hasMore =
            action.payload.resObj?.pagination?.totalPages >
            action.payload?.latestPage;
        } else {
          const newData = action.payload?.resObj?.data || [];
          state.topCatalogsData.catalogs = action.payload.loadMore
            ? [...state.topCatalogsData.catalogs, ...newData]
            : newData;
          state.topCatalogsData.totalCount =
            action.payload.resObj?.pagination?.totalCount;
          state.topCatalogsData.latestPage =
            action.payload.resObj?.pagination?.page;
          state.topCatalogsData.hasMore =
            action.payload.resObj?.pagination?.totalPages >
            action.payload?.latestPage;
        }
      })
      .addCase(getTopCatalogs.rejected, (state: IInitialState, action) => {
        state.topCatalogsData.topCatalogsloading = false;
        state.topCatalogsData.serverError = action.payload;
      });
    // trendingCatalogs data reducers
    builder
      .addCase(getTrendingCatalogs.pending, (state: IInitialState) => {
        state.catalogsData.trendingCatalogsLoading = true;
        state.catalogsData.serverError = null;
      })
      .addCase(
        getTrendingCatalogs.fulfilled,
        (state: IInitialState, action) => {
          state.catalogsData.trendingCatalogsLoading = false;
          if (!!action.payload?.period) {
            const period = action.payload?.period;
            state.catalogsData.trendingCatalogs[period] =
              action.payload?.resArr || [];
          } else {
            state.catalogsData.trendingCatalogs.allTrendingCatalogs =
              action.payload?.resArr || [];
          }
        },
      )
      .addCase(getTrendingCatalogs.rejected, (state: IInitialState, action) => {
        state.catalogsData.trendingCatalogsLoading = false;
        state.catalogsData.serverError = action.payload;
      });
    //  getCatalogDetails data reducers
    builder
      .addCase(getCataLogDetails.pending, (state: IInitialState, action) => {
        state.catalogsData.catalogDetailsLoading = true;
        state.catalogsData.serverError = null;
      })
      .addCase(getCataLogDetails.fulfilled, (state: IInitialState, action) => {
        state.catalogsData.catalogDetails =
          action.payload?.resObj || {};
      })
      .addCase(getCataLogDetails.rejected, (state: IInitialState, action) => {
        state.catalogsData.catalogDetailsLoading = false;
        state.catalogsData.serverError = action.payload;
      });
    //  Add Catalogs Reducers
    builder.addCase(addCatalog.pending, (state: IInitialState) => {
      state.catalogsData.addCatalogLoading = true;
      state.catalogsData.serverError = null;
    });
    builder.addCase(
      addCatalog.fulfilled,
      (state: IInitialState, action: any) => {
        if (!!state.catalogsData.catalogs.length) {
          state.catalogsData.catalogs = [
            ...state.catalogsData.catalogs,
            action.payload.result,
          ];
        }
        state.catalogsData.addCatalogLoading = false;
      },
    );
    builder.addCase(addCatalog.rejected, (state: IInitialState) => {
      state.catalogsData.addCatalogLoading = false;
    });
    //  Fav/Unfav Catalogs Reducers
    builder.addCase(favUnfavCatalogAction.pending, (state: IInitialState) => {
      state.catalogsData.favUnfavCatalogLoading = true;
      state.catalogsData.serverError = null;
    });
    builder.addCase(
      favUnfavCatalogAction.fulfilled,
      (state: IInitialState, action: any) => {
          const updatedCatalogData = {
            ...state.catalogsData.catalogDetails,
            isFavourite : !state.catalogsData.catalogDetails.isFavourite
          };
        state.catalogsData.catalogDetails = {...updatedCatalogData}
        state.catalogsData.favUnfavCatalogLoading = false;
      },
    );
    builder.addCase(favUnfavCatalogAction.rejected, (state: IInitialState) => {
      state.catalogsData.favUnfavCatalogLoading = false;
    });
    // asset data reducers
    builder
      .addCase(getAssetsById.pending, (state: IInitialState) => {
        state.assetsData.loading = true;
        state.assetsData.serverError = null;
      })
      .addCase(getAssetsById.fulfilled, (state: IInitialState, action) => {
        const [key, value] = Object.entries(action.payload.paramField)[0];
        switch (key) {
          case 'catalogId':
            {
              const newData = action.payload?.resObj?.data || [];
              state.assetsData.catalogAssets.assets = action.payload
                .loadMore
                ? [
                    ...state.assetsData.catalogAssets.assets,
                    ...newData,
                  ]
                : newData;
              state.assetsData.catalogAssets.totalCount =
                action.payload.resObj?.pagination?.totalCount;
              state.assetsData.catalogAssets.latestPage =
                action.payload.resObj?.pagination?.page;
              state.assetsData.catalogAssets.hasMore =
                action.payload.resObj?.pagination?.totalPages >
                action.payload?.latestPage;
            }
            break;
          case 'categoryId':
            {
              const categoryId = value as string;
              state.assetsData.categoryAssets[categoryId] = {
                loading: false,
              };
              const newData = action.payload?.resObj?.data || [];
              state.assetsData.categoryAssets[categoryId].assets = action
                .payload.loadMore
                ? [
                    ...state.assetsData.categoryAssets[categoryId].assets,
                    ...newData,
                  ]
                : newData;
              state.assetsData.categoryAssets[categoryId].totalCount =
                action.payload.resObj?.pagination?.totalCount;
              state.assetsData.categoryAssets[categoryId].latestPage =
                action.payload.resObj?.pagination?.page;
              state.assetsData.categoryAssets[categoryId].hasMore =
                action.payload.resObj?.pagination?.totalPages >
                action.payload?.latestPage;
            }
            break;
          default: {
            state.assetsData.loading = false;
            const newData = action.payload?.resObj?.data || [];
            state.assetsData.assets = action.payload.loadMore
              ? [...state.assetsData.assets, ...newData]
              : newData;
            state.assetsData.totalCount =
              action.payload.resObj?.pagination?.totalCount;
            state.assetsData.latestPage =
              action.payload.resObj?.pagination?.page;
            state.assetsData.hasMore =
              action.payload.resObj?.pagination?.totalPages >
              action.payload?.latestPage;
          }
        }
      })
      .addCase(getAssetsById.rejected, (state: IInitialState, action) => {
        state.assetsData.loading = false;
        state.assetsData.serverError = action.payload;
      });
  },
});


export const { updateCatalogFavAssets } = catalogsSlice.actions;
export default catalogsSlice.reducer;
