import axiosInstance from '../axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILeaderboardCatalogType, leaderboardTopCatalogs } from './data';

export const getLeaderboardTopCatalogs = createAsyncThunk<ILeaderboardCatalogType>(
  'leaderboard/getTopCatalogs',
  (data: any, thunkAPI) => {
    try {
      // const response = await axiosInstance.get('/leaderboardTopCatalogs', data);
      // return response.data;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ topCatalogs: leaderboardTopCatalogs });
        }, 2000);
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
