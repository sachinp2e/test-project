import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDeposits, getRefunds, getSalesAction, getTransactions, getWithdrawals } from './settings.action';

interface SettingsState {
  loading: boolean;
  deposits: any[];
  refunds: any[];
  sales: any[];
  transactions: any[];
  withdrawals: any[];
}

const initialState: SettingsState = {
  loading: false,
  deposits: [],
  refunds: [],
  sales: [],
  transactions: [],
  withdrawals: [],
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateLeaderboardState: (state: SettingsState, action: PayloadAction<SettingsState>) => {
      Object.assign(state, action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTransactions.pending, (state: SettingsState) => {
      state.loading = true;
    });
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.loading = false;
      Object.assign(state, action.payload);
    });
    // builder.addCase(getTransactions.rejected, (state, action) => {
    //   state.serverError = action.payload?.message || '';
    // });
    builder.addCase(getSalesAction.pending, (state: SettingsState) => {
      state.loading = true;
    });
    builder.addCase(getSalesAction.fulfilled, (state, action) => {
      state.loading = false;
      Object.assign(state, action.payload);
    });
    builder.addCase(getWithdrawals.pending, (state: SettingsState) => {
      state.loading = true;
    });
    builder.addCase(getWithdrawals.fulfilled, (state, action) => {
      state.loading = false;
      Object.assign(state, action.payload);
    });
    builder.addCase(getDeposits.pending, (state: SettingsState) => {
      state.loading = true;
    });
    builder.addCase(getDeposits.fulfilled, (state, action) => {
      state.loading = false;
      Object.assign(state, action.payload);
    });
    builder.addCase(getRefunds.pending, (state: SettingsState) => {
      state.loading = true;
    });
    builder.addCase(getRefunds.fulfilled, (state, action) => {
      state.loading = false;
      Object.assign(state, action.payload);
    });
  }
});

// actions
export const {} = settingsSlice.actions;

export default settingsSlice.reducer;
