import { RootState } from '../store';
import { AssetDetailState } from '@/Lib/assetDetail/assetDetail.slice';

export const AssetDetailSelector = (state: RootState) => state.assetDetail as AssetDetailState;