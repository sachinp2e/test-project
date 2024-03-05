import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import {
  IAddCatalogs,
  IGetAssetsParams,
  IGetCatalogsParams,
} from './catalogsInterface';
import { RootState } from '@/Lib/store';
import { getAllAssetFilterPayload } from '@/Lib/assets/utils';
import { getAllCatalogsFilterPayload } from '@/Lib/catalogs/utils';

// *** GET catalogs API *** //

export const getAllCatalogs = createAsyncThunk(
  `/catalogue?page=number&pageSize=number`,
  async (
    {
      filters,
      loadMore = false,
      latestPage = 1,
      pageSize = 15,
      search,
    }: IGetCatalogsParams,
    thunkAPI: any,
  ) => {
    try {
      let url = `/catalogue?page=${latestPage}&pageSize=${pageSize}`;
      if (filters) {
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (key && value) {
            url += `&${key}=${value}`;
          }
        });
      }
      if (search) {
        url += `&search=${search}`;
      }
      const state: RootState = thunkAPI.getState();
      const payload = getAllCatalogsFilterPayload(state.globalSearch);
      const response: any = await axiosInstance.get(url, { params: payload });
      return {
        resObj: response.data?.result,
        loadMore,
        filters,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET Top Catalogs ***//

export const getTopCatalogs = createAsyncThunk(
  `/catalogue/getTopCatalogues?time=d|w|m&page=number&pageSize=number`,
  async (
    {
      filters,
      loadMore = false,
      latestPage = 1,
      pageSize = 15,
      duration = '',
    }: IGetCatalogsParams,
    thunkAPI: any,
  ) => {
    try {
      let url = `/catalogue/getTopCatalogues?page=${latestPage}&pageSize=${pageSize}`;
      if (duration) {
        url = `/catalogue/getTopCatalogues?time=${duration}&page=${latestPage}&pageSize=${pageSize}`;
      }
      if (filters) {
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (key && value) {
            url += `&${key}=${value}`;
          }
        });
      }
      // @ts-ignore
      const response = await axiosInstance.get(url, { restrictToken: true });
      return {
        resObj: response.data?.result,
        loadMore,
        filters,
        latestPage,
        duration,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET Trending Catalogs ***//

export const getTrendingCatalogs = createAsyncThunk(
  `/catalogue/trending?period=SEVEN_DAYS|ONE_MONTH|SIX_MONTH`,
  async ({ period = '' }: IGetCatalogsParams, thunkAPI: any) => {
    try {
      let url = `/catalogue/trending`;
      if (period) {
        url = `/catalogue/trending?period=${period}`;
      }
      // @ts-ignore
      const response = await axiosInstance.get(url, { restrictToken: true });
      return {
        resArr: response.data?.result,
        period,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET catalog details API *** //

export const getCataLogDetails = createAsyncThunk(
  `/catalogue?id=string`,
  async (
    { loadMore = false, latestPage = 1, id }: IGetCatalogsParams,
    thunkAPI: any,
  ) => {
    try {
      const url = `/catalogue?id=${id}`;
      const response: any = await axiosInstance.get(url);
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET assets API *** //

export const getAssetsById = createAsyncThunk(
  `/asset?page=number&pageSize=number`,
  async (
    {
      filters,
      loadMore = false,
      latestPage = 1,
      catalogId,
      categoryId,
    }: IGetAssetsParams,
    thunkAPI: any,
  ) => {
    try {
      let url = categoryId
          ? `/asset?page=${latestPage}&pageSize=15&category=${categoryId}`
          : catalogId
            ? `/asset?page=${latestPage}&pageSize=15&catalogue=${catalogId}`
            : `/asset?page=${latestPage}&pageSize=15`;
      if (filters) {
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (key && value) {
            url += `&${key}=${value}`;
          }
        });
      }
      // @ts-ignore
      const response = await axiosInstance.get(url, { restrictToken: true });
      return {
        resObj: response.data?.result,
        loadMore,
        filters,
        latestPage,
        paramField: catalogId
          ? { catalogId: catalogId }
          : categoryId
            ? { categoryId: categoryId,}
            : { default: 'default' },
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** POST addCatalogs API *** //

export const addCatalog = createAsyncThunk(
  'catalogues/addCatalogues',
  async ({ payload, cb }: IAddCatalogs, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        '/catalogue/create-catalogue',
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      cb?.(response.data);
      return response.data;
    } catch (err: any) {
      cb?.({ status: 400, error: err.response.data });
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const favUnfavCatalogAction = createAsyncThunk(
  'favourite/addOrRemoveUserFavoritesCatalogue',
  async (
    {
      userId,
      catalogueId,
      isFavourite,
    }: {
      userId: string;
      catalogueId: string;
      isFavourite: boolean;
    },
    thunkAPI: any,
  ) => {
    try {
      await axiosInstance.post('/favourite/addOrRemoveUserFavoritesCatalogue', {
        catalogueId,
        isFavourite,
      });
      return {
        catalogId: catalogueId,
        userId: userId,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);
