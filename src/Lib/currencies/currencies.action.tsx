import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/Lib/axios';

export const getAllCurrencies = createAsyncThunk(
  'currencies/getAllCurrencies',
  async (_, thunkAPI:any) => {
    try {
      const response = await axiosInstance.get('/currency');
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
