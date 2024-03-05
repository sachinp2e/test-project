import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTrendingAssets } from './landing.action';

interface LandingState {
  trendingAssets: any; // {allTrendingAssets: {[{},{}...]}}, SEVEN_DAYS:{[{},{}...]}, ONE_MONTH: {[{},{}...]}, SIX_MONTH: {[{},{}...]},}
  loading: boolean;
  serverError: null | number;
}

const initialState: LandingState = {
  trendingAssets: {},
  loading: false,
  serverError: null,
};

export const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // trendingAssets data reducers
    builder
      .addCase(getTrendingAssets.pending, (state: LandingState) => {
        state.trendingAssets.loading = true;
        state.trendingAssets.serverError = null;
      })
      .addCase(getTrendingAssets.fulfilled, (state: LandingState, action) => {
        state.trendingAssets.loading = false;
        if (!!action.payload?.period) {
          const period = action.payload?.period;
          state.trendingAssets[period] = action.payload?.resArr || [];
        } else {
          state.trendingAssets.allTrendingAssets = action.payload?.resArr || [];
        }
      })
      .addCase(getTrendingAssets.rejected, (state: LandingState, action) => {
        state.trendingAssets.loading = false;
        state.trendingAssets.serverError = action.payload;
      });
  },
});

export default landingSlice.reducer;
