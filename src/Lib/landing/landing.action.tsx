import axiosInstance from '../axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface IGetTrendingAssetsParams {
  period?: string;
}

export const getTrendingAssets = createAsyncThunk(
  `/asset/trending?period=SEVEN_DAYS|ONE_MONTH|SIX_MONTH`,
  async ({ period = '' }: IGetTrendingAssetsParams, thunkAPI: any) => {
    try {
      let url = `/asset/trending`;
      if (period) {
        url = `/asset/trending?period=${period}`;
      }
      // @ts-ignore
      const response = await axiosInstance.get(url);
      return {
        resArr: response.data?.result,
        period,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);
