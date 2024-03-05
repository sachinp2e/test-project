import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllCategories } from './category.action';

export interface ICategories {
  id: string;
  name: string;
  description: string;
  mediaUrl: string;
  isActive: boolean;
  mediaUrl_resized: string;
}

export type CategoryStateType = {
  categories: ICategories[];
  loading: boolean;
};

const initialState: CategoryStateType = {
  categories: [],
  loading: false,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAllCategories.pending,
      (state: CategoryStateType, action) => {
        state.loading = true;
      },
    );
    builder.addCase(
      getAllCategories.fulfilled,
      (state: CategoryStateType, action: any) => {
        state.categories = action.payload.result;
        state.loading = false;
      },
    );
    builder.addCase(
      getAllCategories.rejected,
      (state: CategoryStateType, action) => {
        state.loading = false;
      },
    );
  },
});

export default categorySlice.reducer;
