import axiosInstance from '../axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { depositsData, refundsData, salesData, transactionsData, withdrawalsData } from './data';

export const getTransactions = createAsyncThunk(
  'settings/getTransactions',
  (data: any, thunkAPI) => {
    try {
      // const response = await axiosInstance.get('/getTransactions');
      // return response.data;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // @ts-ignore
          resolve({ transactions: transactionsData });
        }, 1000);
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getSalesAction = createAsyncThunk(
  'settings/getSales',
  (data: any, thunkAPI) => {
    try {
      // const response = await axiosInstance.get('/getSales');
      // return response.data;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // @ts-ignore
          resolve({ sales: salesData });
        }, 1000);
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getWithdrawals = createAsyncThunk(
  'settings/getWithdrawals',
  (data: any, thunkAPI) => {
    try {
      // const response = await axiosInstance.get('/getWithdrawals');
      // return response.data;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // @ts-ignore
          resolve({ withdrawals: withdrawalsData });
        }, 1000);
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getDeposits = createAsyncThunk(
  'settings/getDeposits',
  (data: any, thunkAPI) => {
    try {
      // const response = await axiosInstance.get('/getDeposits');
      // return response.data;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // @ts-ignore
          resolve({ deposits: depositsData });
        }, 1000);
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getRefunds = createAsyncThunk(
  'settings/getRefunds',
  (data: any, thunkAPI) => {
    try {
      // const response = await axiosInstance.get('/getRefunds');
      // return response.data;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // @ts-ignore
          resolve({ refunds: refundsData });
        }, 1000);
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
