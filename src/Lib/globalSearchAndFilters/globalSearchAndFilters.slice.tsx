import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GlobalSearchType = {
  // value: string,
  // type: 'assets' | 'catalogs' | 'users',
  minPrice?: number,
  maxPrice?: number,
  orderType?: 'fixed' | 'Auction' | 'none' | 'all',
  editions?: 'single' | 'multiple' | 'all',
  category?: string,
  featured?: boolean,
  expiringSoon?: boolean,
  upcoming?: boolean,
  sortBy?: string,
  makeApiCall: boolean,
};

export const initialState: GlobalSearchType = {
  // value: '',
  // type: 'assets',
  minPrice: 0,
  maxPrice: 10000,
  orderType: 'all',
  editions: 'all',
  category: '',
  featured: false,
  expiringSoon: false,
  upcoming: false,
  makeApiCall: false,
};

export const globalSearchAndFiltersSlice = createSlice({
  name: 'globalSearch',
  initialState,
  reducers: {
    setGlobalSearchFilter: (state, action: PayloadAction<Partial<GlobalSearchType>>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        // @ts-ignore
        state[key as keyof GlobalSearchType] = value;
      });
      state.makeApiCall = true;
    },
    removeGlobalSearchFilter: (state, action: PayloadAction<keyof GlobalSearchType>) => {
      // @ts-ignore
      state[action.payload] = initialState[action.payload];
      state.makeApiCall = true;
    },
    clearAllGlobalFilters: (state) => {
      Object.entries(initialState).forEach(([key, value]) => {
        // @ts-ignore
        state[key as keyof GlobalSearchType] = value;
      });
      state.makeApiCall = true;
    },
    toggleMakeApiCall: (state) => {
      state.makeApiCall = false;
    },
  },
});

export default globalSearchAndFiltersSlice.reducer;

export const {
  setGlobalSearchFilter,
  clearAllGlobalFilters,
  toggleMakeApiCall,
  removeGlobalSearchFilter,
} = globalSearchAndFiltersSlice.actions;
