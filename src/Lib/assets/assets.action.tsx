import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/Lib/axios';
import { getAllAssetFilterPayload } from '@/Lib/assets/utils';
import { RootState } from '@/Lib/store';

interface IGetAssetsParams {
  filters?: any;
  loadMore?: boolean;
  latestPage?: number;
  pageSize?: number;
  userId?: string;
  search?: string;
}

export const getAllAssets = createAsyncThunk(
  'assets/getAllAssets',
  async ({  loadMore = false, latestPage = 1, pageSize = 15, filters, search }: IGetAssetsParams, thunkAPI) => {
    try {
      let url = `/asset?page=${latestPage}&pageSize=${pageSize}`;
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
      // @ts-ignore
      const state: RootState = thunkAPI.getState();
      const payload = getAllAssetFilterPayload(state.globalSearch, state.assets);
      const response = await axiosInstance.get(url, { params: payload });
      return {...response.data, loadMore, latestPage};
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// API that will get all the assets by catalogue id passed in params
export const getAssetsByCatalogueId = createAsyncThunk(
  'assets/getAssetsByCatalogueId',
  async (data: any, thunkAPI) => {
    try {
      // TODO: change data with proper by fixing the typescript error
      const response = await axiosInstance.get('/asset', {
        params: { catalogue: data },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const createAsset = createAsyncThunk(
  'assets/createAsset',
  async (data: any, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/asset/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const draftAssetAction = createAsyncThunk(
  'assets/draftAsset',
  async (payload: any, thunkAPI) => {
    try {
      let url = '/draft/createDraftAsset';
      let method = 'POST';
      if (payload.id) {
        url = `/draft/updateDraftAsset/${payload.id}`;
        method = 'PUT';
      }
      const response = await axiosInstance({
        method,
        url,
        data: payload.data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getDraftAssetByIdAction = createAsyncThunk(
  'assets/getDraftAssetById',
  async (id: any, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/draft/getDraftedAsset/${id}`);
      if (response.data.status === 200) {
        return response.data.result;
      }
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
