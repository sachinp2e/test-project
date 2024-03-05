import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const getWalletDetails = createAsyncThunk(
  '/user/wallet-details',
  async (_, thunkAPI: any) => {
    try {
      const response = await axiosInstance.get('/user/get-wallet-balance');
      return response.data;
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  },
);

export const getWalletTransactions = createAsyncThunk(
  'user/wallet-transactions',
  async (filter: any, thunkAPI: any) => {
    const query: any = {
      deposit: '&transactionType=0',
      withdrawl: '&transactionType=1',
      transaction:'',
      sale:'&orderType=0',
      refund:'&transactionType=2'
    };
    try {
      const response = await axiosInstance.get(
        `/user/get-wallet-transactions?page=1&limit=200${query[filter?.type]}`,
      );
      return { type: filter.type, data: response.data.result?.data };
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  },
);
