import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllEmailNotificationsTriggerPoints, getAllNotificationEvents, getNotifications, updateEmailNotificationsTriggerPoint } from './notifications.action';
import { settingsSlice } from '@/Lib/settings/settings.slice';

interface NotificationsState {
  notifications: any[];
  emailNotifications: any[];
  loading: boolean;
  unreadCount: number;
  totalPages: number; 
  numUnseen: number;
  notificationSettings: any;
}

const initialState: NotificationsState = {
  loading: false,
  notifications: [],
  emailNotifications: [],
  notificationSettings:[],
  unreadCount: 0,
  totalPages: 1,
  numUnseen:0
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    updateNotificationsState: (
      state: NotificationsState,
      action: PayloadAction<NotificationsState>,
    ) => {
      state.numUnseen += 1
      state.notifications = [action?.payload,...state.notifications];
    },
    markAllNotificationsRead: (state:NotificationsState) =>{
      state.numUnseen = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getNotifications.pending, (state: any) => {
      state.isLoading = true;
    });
    builder.addCase(
      getNotifications.fulfilled,
      (state: any, { payload }: any) => {
        state.isLoading = false;
        state.notifications =
          payload?.messages?.length > 0 ? [...payload?.messages] : [];
        state.totalPages = payload?.totalPages || 1;
        state.numUnseen = payload?.numUnseen || 0;
      },
    );
    builder.addCase(getNotifications.rejected, (state: any) => {
      state.isLoading = false;
    });
    
    // get Notification trigger points
    builder.addCase(getAllNotificationEvents.pending, (state: any) => {
      state.isLoading = true;
    });
    builder.addCase(
      getAllNotificationEvents.fulfilled,
      (state: any, { payload }: any) => {
        state.isLoading = false;
        state.notifications =
          payload?.messages?.length > 0 ? [...payload?.messages] : [];
        state.totalPages = payload?.totalPages || 1;
        state.numUnseen = payload?.numUnseen || 0;
      },
    );
    builder.addCase(getAllNotificationEvents.rejected, (state: any) => {
      state.isLoading = false;
    });
    // builder.addCase(getTrendingAssets.rejected, (state, action) => {
    //   state.serverError = action.payload?.message || '';
    // });

    // get emailNotifications trigger points
    builder
      .addCase(getAllEmailNotificationsTriggerPoints.pending, (state: NotificationsState) => {
        state.loading = true;
      })
      .addCase(getAllEmailNotificationsTriggerPoints.fulfilled, (state: NotificationsState, action) => {
        state.emailNotifications = [...action.payload];
      })
      .addCase(getAllEmailNotificationsTriggerPoints.rejected, (state: NotificationsState, action) => {
        state.loading = false;
      });
    // update/post emailNotifications trigger points
    builder
      .addCase(updateEmailNotificationsTriggerPoint.pending, (state: NotificationsState) => {
        state.loading = true;
      })
      .addCase(updateEmailNotificationsTriggerPoint.fulfilled, (state: NotificationsState, action) => {
        const updatedActivityIndex =
          state.emailNotifications.findIndex(activity => activity.activityId === action.payload?.triggerPointId);
        state.emailNotifications[updatedActivityIndex] = {
          ...state.emailNotifications[updatedActivityIndex],
          isEnabled: action.payload?.isEnabled
      }
      })
      .addCase(updateEmailNotificationsTriggerPoint.rejected, (state: NotificationsState, action) => {
        state.loading = false;
      });
  },
});

export const { updateNotificationsState,markAllNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;
