import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllCurrencies } from './currencies.action';

export type CurrenciesStateType = {
  currencies: any[];
  loading: boolean;
};

const initialState: CurrenciesStateType = {
  currencies: [],
  loading: false,
};

export const currenciesSlice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCurrencies.pending, (state: CurrenciesStateType, action) => {
      state.loading = true;
    });
    builder.addCase(getAllCurrencies.fulfilled, (state: CurrenciesStateType, action: any) => {
      state.currencies = action.payload.result;
      state.loading = false;
    });
    builder.addCase(getAllCurrencies.rejected, (state: CurrenciesStateType, action) => {
      state.loading = false;
    });
  }
});

export default currenciesSlice.reducer;
