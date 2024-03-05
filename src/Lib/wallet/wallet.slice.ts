import { createSlice } from '@reduxjs/toolkit';
import { getWalletDetails, getWalletTransactions } from './wallet.action';

interface IWalletState {
  walletBalance: number;
  isLoading: boolean;
  walletTransactions: any[];
  withdrawlTransactions: any[];
  depositedTransactions: any[];
  saleTransactions: any[];
  refundTransactions: any[];
}

const initialState: IWalletState = {
  walletBalance: 0,
  isLoading: true,
  walletTransactions: [],
  withdrawlTransactions: [],
  depositedTransactions: [],
  saleTransactions: [],
  refundTransactions: [],
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addWalletBalance: (state: IWalletState, action: { payload: number }) => {
      state.walletBalance = state.walletBalance + Number(action.payload);
    },
    clearWalletBalance: (state: IWalletState) =>{
      state.walletBalance = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getWalletDetails.pending, (state: IWalletState) => {
      state.isLoading = true;
    });
    builder.addCase(
      getWalletDetails.fulfilled,
      (state: IWalletState, { payload }) => {
        state.isLoading = false;
        state.walletBalance = payload?.result?.availableBalance;
      },
    );
    builder.addCase(getWalletDetails.rejected, (state: IWalletState) => {
      state.isLoading = false;
    });
    builder.addCase(getWalletTransactions.pending, (state: IWalletState) => {
      state.isLoading = true;
    });
    builder.addCase(
      getWalletTransactions.fulfilled,
      (state: IWalletState, { payload }: any) => {
        state.isLoading = false;
        if (payload?.type === 'deposit') {
          state.depositedTransactions = payload.data.items;
        } else if (payload?.type === 'withdrawl') {
          state.withdrawlTransactions = payload.data.items;
        } else if (payload?.type === 'transaction') {
          state.walletTransactions = payload.data.items;
        } else if (payload?.type === 'sale') {
          state.saleTransactions = payload.data.items;
        } else if (payload?.type === 'refund') {
          state.refundTransactions = payload.data.items;
        }
      },
    );
    builder.addCase(getWalletTransactions.rejected, (state: IWalletState) => {
      state.isLoading = false;
    });
  },
});

export const { addWalletBalance, clearWalletBalance } = walletSlice.actions;
export default walletSlice.reducer;
