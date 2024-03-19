import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAssetCount,
  getAssetCountListing,
  getAssetCountOffers,
  getAssetDetails,
  getAssetFavouriteUserList,
  getSimilarAssets,
  placeBidOnAsset,
  putAssetOnSale,
  removeAssetFromSale,
} from './assetDetail.action';

export type AssetDetailState = {
  AssetDetails: any;
  similarAssets: any[];
  loading: boolean;
  assetCounts: any;
  assetListing: any;
  assetOffersListing:any;
  favouriteUserList:any;
};

const initialState: AssetDetailState = {
  AssetDetails: {},
  assetCounts: {},
  assetListing: {},
  assetOffersListing:{},
  similarAssets: [],
  favouriteUserList: {},
  loading: false,
};

export const assetsSlice = createSlice({
  name: 'assetDetail',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearAssetState:(state)=>{
      state.AssetDetails = {};
      state.assetCounts = {};
      state.assetListing = {};
      state.favouriteUserList = {}
    },
    assetBought: (state) => {
      state.AssetDetails = { ...state.AssetDetails, onHold: true };
    },
    updateAssetDetails: (state, action: PayloadAction<any>) => {
      Object.keys(action.payload).forEach((key) => {
        if (state.AssetDetails.hasOwnProperty(key) || key === 'userBid') {
          state.AssetDetails[key] = action.payload[key];
        }
      });
    },
  },
  extraReducers: (builder) => {
    // View Assets
    builder.addCase(getAssetDetails.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      getAssetDetails.fulfilled,
      (state: AssetDetailState, action: any) => {
        state.AssetDetails = action?.payload?.result;
        state.loading = false;
      },
    );
    builder.addCase(getAssetDetails.rejected, (state: AssetDetailState) => {
      state.loading = false;
    });

    // Get similar assets
    builder.addCase(getSimilarAssets.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      getSimilarAssets.fulfilled,
      (state: AssetDetailState, action: any) => {
        state.similarAssets = action?.payload?.result;
        state.loading = false;
      },
    );
    builder.addCase(getSimilarAssets.rejected, (state: AssetDetailState) => {
      state.loading = false;
    });

    // Remove asset from sale
    builder.addCase(removeAssetFromSale.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      removeAssetFromSale.fulfilled,
      (state: AssetDetailState, { payload }: any) => {
        if (state.AssetDetails?.isMultiple) {
          state.AssetDetails =
            payload?.result?.onSaleSupply === 0
              ? (state.AssetDetails = {
                  ...state.AssetDetails,
                  orderType: 'none',
                  price: 0,
                  highestOffer: 0,
                })
              : {
                  ...state.AssetDetails,
                  onSaleSupply: payload?.result?.onSaleSupply,
                };
        } else {
          state.AssetDetails = {
            ...state.AssetDetails,
            orderType: 'none',
            price: 0,
            highestOffer: 0,
          };
        }
        state.loading = false;
      },
    );
    builder.addCase(removeAssetFromSale.rejected, (state: AssetDetailState) => {
      state.loading = false;
    });

    // Put asset On sale
    builder.addCase(putAssetOnSale.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      putAssetOnSale.fulfilled,
      (state: AssetDetailState, { payload }: any) => {
        state.AssetDetails = { ...state.AssetDetails, ...payload?.result };
        state.loading = false;
      },
    );
    builder.addCase(putAssetOnSale.rejected, (state: AssetDetailState,{payload}:any) => {
      state.loading = false;
    });

    // Put Bid On asset
    builder.addCase(placeBidOnAsset.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      placeBidOnAsset.fulfilled,
      (state: AssetDetailState, { payload }: any) => {
        state.AssetDetails = { ...state.AssetDetails, ...payload?.result };
        state.loading = false;
      },
    );
    builder.addCase(placeBidOnAsset.rejected, (state: AssetDetailState) => {
      state.loading = false;
    });

    //Get Asset counts for multiple asset
    builder.addCase(getAssetCount.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      getAssetCount.fulfilled,
      (state: AssetDetailState, { payload }: any) => {
        state.assetCounts = payload?.result;
        state.loading = false;
      },
    );
    builder.addCase(getAssetCount.rejected, (state: AssetDetailState) => {
      state.loading = false;
    });

    //Get Asset Listing for multiple asset
    builder.addCase(getAssetCountListing.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      getAssetCountListing.fulfilled,
      (state: AssetDetailState, { payload }: any) => {
        state.assetListing = payload?.result;
        state.loading = false;
      },
    );
    builder.addCase(
      getAssetCountListing.rejected,
      (state: AssetDetailState) => {
        state.loading = false;
      },
    );

     //Get Asset Offers Listing for multiple asset
     builder.addCase(getAssetCountOffers.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      getAssetCountOffers.fulfilled,
      (state: AssetDetailState, { payload }: any) => {
        state.assetOffersListing = payload?.result;
        state.loading = false;
      },
    );
    builder.addCase(
      getAssetCountOffers.rejected,
      (state: AssetDetailState) => {
        state.loading = false;
      },
    );

    // Get asset favourite user list
    builder.addCase(getAssetFavouriteUserList.pending, (state: AssetDetailState) => {
      state.loading = true;
    });
    builder.addCase(
      getAssetFavouriteUserList.fulfilled,
      (state: AssetDetailState, { payload }: any) => {
        state.favouriteUserList = payload?.result;
        state.loading = false;
      },
    );
    builder.addCase(getAssetFavouriteUserList.rejected, (state: AssetDetailState) => {
      state.loading = false;
    });
  },
});

export const { assetBought, updateAssetDetails, clearAssetState } = assetsSlice.actions;
export default assetsSlice.reducer;
