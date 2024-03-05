import { RootState } from '../store';
import { AssetsState } from '@/Lib/assets/assets.slice';

export const getAllAssetsSelector = (state: RootState) => state.assets as AssetsState;
