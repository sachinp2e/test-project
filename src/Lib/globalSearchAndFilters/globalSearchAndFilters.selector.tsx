import { RootState } from '../store';
import { GlobalSearchType, initialState } from './globalSearchAndFilters.slice';

type FilterArrayType = {
  key: string,
  value: string | number,
  displayValue: string,
  originalKey?: string,
};

export const getGlobalSearchDataSelector = (state: RootState) => state.globalSearch as GlobalSearchType;

// TODO: make it dynamic
// return array based on the object
const generateArray = (obj: Partial<GlobalSearchType>) => {
  const arr: FilterArrayType[] = [];
  if (obj.minPrice && (obj.minPrice !== initialState.minPrice)) {
    arr.push({
      key: 'minPrice',
      value: obj.minPrice,
      displayValue: `Min. Price: ${obj.minPrice}`,
    });
  }
  if (obj.maxPrice && (obj.maxPrice !== initialState.maxPrice)) {
    arr.push({
      key: 'maxPrice',
      value: obj.maxPrice as number,
      displayValue: `Max. Price: ${obj.maxPrice}`,
    });
  }
  if (obj.orderType && (obj.orderType !== 'all')) {
    arr.push({
      key: 'saleType',
      value: obj.orderType as string,
      displayValue: obj.orderType === 'none' ? 'Not for Sale' : obj.orderType === 'fixed' ? 'Fixed Price' : 'Auction',
      originalKey: 'orderType',
    });
  }
  if (obj.editions && (obj.editions !== 'all')) {
    arr.push({
      key: 'Copies',
      value: obj.editions as string,
      displayValue: obj.editions === 'single' ? 'Single' : 'Multiple',
      originalKey: 'editions',
    });
  }
  // if (obj.category) {
  //   arr.push({
  //     key: 'Category',
  //     value: obj.category,
  //   });
  // }
  if (obj.featured) {
    arr.push({
      key: 'Extras',
      value: 'featured',
      displayValue: 'Featured',
      originalKey: 'featured',
    });
  }
  if (obj.expiringSoon) {
    arr.push({
      key: 'Extras',
      value: 'expiringSoon',
      displayValue: 'Expiring Soon',
      originalKey: 'expiringSoon',
    });
  }
  if (obj.upcoming) {
    arr.push({
      key: 'Extras',
      value: 'upcoming',
      displayValue: 'Upcoming',
      originalKey: 'upcoming',
    });
  }
  return arr;
}

// return the object with the difference of initial state and current state
export const getSelectedFiltersSelector = (state: RootState) => {
  const { ...rest } = state.globalSearch as GlobalSearchType;
  const selectedFilters: Partial<GlobalSearchType> = { ...rest };
  const diff: Partial<GlobalSearchType> = {};
  Object.entries(selectedFilters).forEach(([key, v]) => {
    // @ts-ignore
    if (v !== initialState[key]) {
      // @ts-ignore
      diff[key] = v;
    }
  });
  return generateArray(diff);
};

export const makeFilterApiCallSelector = (state: RootState) => state.globalSearch.makeApiCall;
