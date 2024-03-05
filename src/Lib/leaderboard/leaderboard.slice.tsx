import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLeaderboardTopCatalogs } from './leaderboard.action';

interface LeaderboardState {
  topCatalogs: any[];
  loading: boolean;
}

const initialState: LeaderboardState = {
  topCatalogs: [],
  loading: false,
};

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    updateLeaderboardState: (state: LeaderboardState, action: PayloadAction<LeaderboardState>) => {
      Object.assign(state, action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getLeaderboardTopCatalogs.pending, (state:LeaderboardState) => {
      state.loading = true;
    });
    builder.addCase(getLeaderboardTopCatalogs.fulfilled, (state, action) => {
      state.loading = false;
      Object.assign(state, action.payload);
    });
    builder.addCase(getLeaderboardTopCatalogs.rejected, (state, action) => {
      state.loading = false;
    });
  }
});

// actions
export const { } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
