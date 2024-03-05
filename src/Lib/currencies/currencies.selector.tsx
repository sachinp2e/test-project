import { RootState } from '../store';
import { CurrenciesStateType } from './currencies.slice';

export const getAllCurrenciesSelector = (state: RootState) => state.currencies as CurrenciesStateType;
