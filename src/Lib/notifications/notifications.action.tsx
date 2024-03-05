import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosNotificationInstance } from '../axios';

export const getNotifications = createAsyncThunk(
  'user/get-notifications',
  async (_,thunkAPI: any) => {
    try {
      const response = await axiosNotificationInstance.get(
        `/getNotifications?pageSize=${process.env.NEXT_PUBLIC_NOTIFICATION_LIMIT}&pageNumber=1`,
      );
      return response.data.result;
    } catch (error: any) {
      thunkAPI.rejectWithValue(error.resposne.data);
    }
  },
);

export const loadMoreNotifications = createAsyncThunk(
  'user/load-more-notifications',
  async (payload: any,thunkAPI:any) => {
    try {
      const response = await axiosNotificationInstance.get(
        `/getNotifications?pageSize=${payload?.limit}&pageNumber=${payload?.page}`,
      );
      return response.data.result;
    } catch (error:any) {
      thunkAPI.rejectWithValue(error.response.data)
    }
  },
);

export const getAllNotificationEvents = createAsyncThunk(
  'getAllNotificationEvents',
  async () => {
    try {
      const response = await axiosNotificationInstance.get(`/all/user/activities`);
      return response.data.result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  },
);

export const getAllEmailNotificationsTriggerPoints = createAsyncThunk(
  'getAllEmailNotificationEvents',
  async ({ userId }: { userId: string},
    thunkAPI: any,) => {
    try {
      const response = await axiosNotificationInstance.get(
        '/all/user/activities',
        {
          headers: {
            sender: userId,
          },
        }
      );
      return response.data.result;
    } catch (err) {
      console.log(err);
    }
  },
);

export const updateEmailNotificationsTriggerPoint = createAsyncThunk(
  'postEmailNotificationEvent',
  async (
    {
      userId,
      triggerPointId,
      isEnabled,
    }: {
      userId: string;
      triggerPointId: string;
      isEnabled: boolean;
    },
    thunkAPI: any,
  ) => {
    try {
      const response = await axiosNotificationInstance.post(
        '/add/user/activity',
        { activityId: triggerPointId, enable: isEnabled },
        {
          headers: {
            sender: userId,
          },
        }
      );
      return {triggerPointId, isEnabled};
    } catch (err: any) {
      thunkAPI.rejectWithValue(err.response.data)
    }
  },
);