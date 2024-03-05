import { RootState } from '../store';

export const getAllCatalogsSelector = (state: RootState) => state.catalogs;
