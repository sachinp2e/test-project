import { GlobalSearchType } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.slice';

export const getAllCatalogsFilterPayload = (filterState: GlobalSearchType) => {
  let payload = {};
  // if (filterState.value) {
  //   payload = { ...payload, search: filterState.value };
  // }
  if (filterState.orderType !== 'all') {
    payload = { ...payload, orderType: filterState.orderType };
  }
  if (filterState.editions !== 'all') {
    payload = { ...payload, editions: filterState.editions };
  }
  if (filterState.minPrice !== 0) {
    payload = { ...payload, minPrice: filterState.minPrice };
  }
  if (filterState.maxPrice !== 5000) {
    payload = { ...payload, maxPrice: filterState.maxPrice };
  }
  if (filterState.featured) {
    payload = { ...payload, featured: true };
  }
  if (filterState.expiringSoon) {
    payload = { ...payload, expiringSoon: true };
  }
  if (filterState.upcoming) {
    payload = { ...payload, upcoming: true };
  }
  return payload;
};
