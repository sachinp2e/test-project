import { GlobalSearchType } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.slice';
import { AssetsState } from '@/Lib/assets/assets.slice';

export const getAllAssetFilterPayload = (filterState: GlobalSearchType, assetState: AssetsState) => {
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
  if (filterState.maxPrice !== 10000) {
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
