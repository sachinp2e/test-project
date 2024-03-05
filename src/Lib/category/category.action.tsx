import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/Lib/axios';

export const getAllCategories = createAsyncThunk(
  'category/getAllCategories',
  async (data: any, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/category');
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
