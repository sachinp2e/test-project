import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  forgotPasswordAction,
  loginAction,
  getProfileAction,
  otpAction,
  registerAction,
  resendAction,
  resetPasswordAction,
  changePasswordAction,
  updateProfileAction,
  getMyiprUserCredits,
} from './auth.action';

interface IUserDetails {
  authId?: string;
  bannerImage?: string;
  bio?: string;
  blockChainKycId?: string;
  blockchainEnrolmentId?: string;
  countryCode?: string | number;
  created_at?: string;
  discord?: string;
  email?: string;
  firstName?: string;
  first_login?: string;
  followerCount?: number;
  followingCount?: number;
  id?: string;
  instagram?: string;
  isKycVerified?: boolean;
  isOtpDisabled?: boolean;
  isPhoneVarified?: boolean;
  isSuspend?: boolean;
  is_2fa_enabled?: boolean;
  kalpId?: string;
  kycId?: string;
  kycStatus?: string;
  lastName?: string;
  last_login?: string;
  mai_wallet_id?: string;
  phone?: string;
  profileImage?: string;
  twitter?: null;
  userName?: string;
  website?: null;
  mobileNumber?: string;
  lastUserNameChange?: string;
}
interface AuthState {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  serverError?: any;
  message?: string;
  success?: boolean;
  loading?: boolean;
  updateProfileLoading?: boolean;
  otpVerifyLoading?: boolean;
  userDetails: IUserDetails;
  isLoggedIn: boolean;
  kycReminder: boolean;
  myiprCredits: 0;
}

const getTokenFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return '';
};

const initialState: AuthState = {
  id: getTokenFromLocalStorage('id') || '',
  userId: getTokenFromLocalStorage('userId') || '',
  accessToken: getTokenFromLocalStorage('accessToken') || '',
  refreshToken: getTokenFromLocalStorage('refreshToken') || '',
  isLoggedIn: false,
  serverError: null,
  myiprCredits: 0,
  message: '',
  success: false,
  loading: false,
  updateProfileLoading: false,
  otpVerifyLoading: false,
  kycReminder: false,
  userDetails: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state: AuthState) => {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        state.isLoggedIn = false;
        state.userDetails = {};
        state.userId = '';
        state.accessToken = '';
        state.kycReminder = false;
      }
    },
    updateAuthState: (state: AuthState, action: PayloadAction<AuthState>) => {
      Object.assign(state, action.payload);
    },
    updateKycReminder: (state: AuthState) => {
      state.kycReminder = false;
    },
    loginWithToken: (state: AuthState, action: PayloadAction<any>) => {
      state.id = action.payload?.result?.id;
      state.userId = action.payload?.result?.userId;
      state.accessToken = action.payload?.result?.access_token;
      state.refreshToken = action.payload?.result?.refresh_token;
      state.message = action.payload?.message;
      state.isLoggedIn = true;
    }
  },
  extraReducers: (builder) => {
    //-----login-----
    builder.addCase(loginAction.pending, (state: AuthState) => {
      state.loading = true;
      state.serverError = null;
    });
    builder.addCase(loginAction.fulfilled, (state: AuthState, action) => {
      state.loading = false;
      state.id = action.payload?.result?.id;
      state.userId = action.payload?.result?.userId;
      state.accessToken = action.payload?.result?.access_token;
      state.refreshToken = action.payload?.result?.refresh_token;
      state.message = action.payload?.message;
      state.isLoggedIn = true;
    });
    builder.addCase(loginAction.rejected, (state: AuthState, action) => {
      state.loading = false;
      state.serverError = action.payload;
    });

    //------fetch-user-profile-----
    builder.addCase(getProfileAction.pending, (state: AuthState) => {
      state.loading = true;
      state.serverError = null;
    });
    builder.addCase(
      getProfileAction.fulfilled,
      (state: AuthState, action: any) => {
        state.loading = false;
        if (!action?.payload) {
          return;
        }
        const kycReminderShownOnce = localStorage.getItem('kycReminderShownOnce');
        if(!kycReminderShownOnce){
          state.kycReminder = !['VERIFIED','INPROCESS'].includes(action.payload.result.kycStatus);
          localStorage.setItem('kycReminderShownOnce','true');
        }
        state.isLoggedIn = true;
        state.userDetails = action.payload?.result;
        state.id = action.payload?.result?.id
      },
    );
    builder.addCase(getProfileAction.rejected, (state: AuthState, action:any) => {
      state.loading = false;
      state.serverError = action.payload;
    });

    //-----register-----
    builder.addCase(registerAction.pending, (state: AuthState) => {
      state.loading = true;
      state.serverError = null;
    });
    builder.addCase(registerAction.fulfilled, (state: AuthState, action) => {
      state.loading = false;
      Object.assign(state, action.payload);
      state.message = action.payload?.message;
    });
    builder.addCase(registerAction.rejected, (state: AuthState, action) => {
      state.loading = false;
      state.serverError = action.payload;
    });

    //-----verify-email-otp-----
    builder.addCase(otpAction.pending, (state: AuthState) => {
      state.otpVerifyLoading = true;
      state.serverError = null;
    });
    builder.addCase(otpAction.fulfilled, (state: AuthState, action) => {
      state.otpVerifyLoading = false;
      Object.assign(state, action?.payload);
      state.message = action.payload?.message;
    });
    builder.addCase(otpAction.rejected, (state: AuthState, action) => {
      state.otpVerifyLoading = false;
      state.serverError = action.payload;
    });

    //-----resend-email-otp------
    builder.addCase(resendAction.pending, (state: AuthState) => {
      state.loading = true;
      state.serverError = null;
    });
    builder.addCase(resendAction.fulfilled, (state: AuthState, action) => {
      state.loading = false;
      Object.assign(state, action?.payload);
      state.message = action?.payload?.message;
    });
    builder.addCase(resendAction.rejected, (state: AuthState, action) => {
      state.loading = false;
      state.serverError = action.payload;
    });

    //-----forgot-password-----
    builder.addCase(forgotPasswordAction.pending, (state: AuthState) => {
      state.loading = true;
      state.serverError = null;
    });
    builder.addCase(
      forgotPasswordAction.fulfilled,
      (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        Object.assign(state, action?.payload);
        state.message = action?.payload?.message;
      },
    );
    builder.addCase(
      forgotPasswordAction.rejected,
      (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        state.serverError = action.payload?.message;
      },
    );

    //----reset-password-----
    builder.addCase(resetPasswordAction.pending, (state: AuthState) => {
      state.loading = true;
      state.serverError = null;
    });
    builder.addCase(
      resetPasswordAction.fulfilled,
      (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        Object.assign(state, action?.payload);
        state.message = action?.payload?.message;
      },
    );
    builder.addCase(
      resetPasswordAction.rejected,
      (state: AuthState, action) => {
        state.loading = false;
        state.serverError = action.payload;
      },
    );

    //----change-password-----
    builder.addCase(changePasswordAction.pending, (state: AuthState) => {
      state.loading = true;
      state.serverError = null;
    });
    builder.addCase(
      changePasswordAction.fulfilled,
      (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        Object.assign(state, action?.payload);
        state.message = action?.payload?.message;
      },
    );
    builder.addCase(
      changePasswordAction.rejected,
      (state: AuthState, action) => {
        state.loading = false;
        state.serverError = action.payload;
      },
    );

    //-----update-profile-----
    builder.addCase(updateProfileAction.pending, (state: AuthState) => {
      state.updateProfileLoading = true;
      state.serverError = null;
    });
    builder.addCase(
      updateProfileAction.fulfilled,
      (state: AuthState, action) => {
        state.userDetails = {
          ...state.userDetails,
          ...action.payload.updatedFieldsObj,
        };
      },
    );
    builder.addCase(
      updateProfileAction.rejected,
      (state: AuthState, action) => {
        state.updateProfileLoading = false;
        state.serverError = action.payload;
      },
    );

    //----get myipr credits-----
    builder.addCase(getMyiprUserCredits.pending, (state: AuthState) => {
      state.loading = true;
      state.serverError = null;
    });
    builder.addCase(
      getMyiprUserCredits.fulfilled,
      (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        state.myiprCredits = action.payload?.result?.availableCredit;
      },
    );
    builder.addCase(
      getMyiprUserCredits.rejected,
      (state: AuthState, action) => {
        state.loading = false;
        state.serverError = action.payload;
      },
    );
  },
});

// actions
export const { logout, updateKycReminder, loginWithToken } = authSlice.actions;

export default authSlice.reducer;
