import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { toastSuccessMessage } from '@/utils/constants';

export const getAssetDetails = createAsyncThunk(
  'assets/getAssetDetails',
  async (id: any, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/asset/item/${id}`);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const removeAssetFromSale = createAsyncThunk(
  '/asset/removeAssetFromSale',
  async (payload: any, thunkAPI: any) => {
    try {
      const response = await axiosInstance.patch(`/asset/${payload.assetId}`, {
        putOnMarketplace: false,
        supply: payload.supply
      });
      return response.data;
    } catch (error: any) {
      thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

interface ISalePayload {
  orderType: string;
  price?: number;
  minBid?: number;
  bidEndDate?: string;
  bidStartDate?: string;
  supply:number;
}

export const putAssetOnSale = createAsyncThunk(
  '/asset/putAssetOnSale',
  async (data: any, thunkAPI: any) => {
    try {
      let payload: ISalePayload = { orderType: 'fixed', supply:Number(data?.supply) || 1 };
      if (data?.orderType === 'fixed') {
        payload = { ...payload, price: data.price };
      } else if (data?.orderType === 'timed') {
        payload = {
          orderType: 'timed',
          minBid: data.minBid,
          bidEndDate: data.bidEndDate,
          bidStartDate: data.bidStartDate,
          supply:Number(data?.supply) || 1 
        };
      }
      const response = await axiosInstance.patch(`/asset/${data.id}`, {
        putOnMarketplace: true,
        ...payload,
      });
      return response.data;
    } catch (error: any) {
      // if()
      thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getSimilarAssets = createAsyncThunk(
  '/asset/getSimilarAssets',
  async (id: any, thunkAPI: any) => {
    if (!id) {
      return;
    }
    try {
      const response = await axiosInstance.get(`/asset/similarAsset/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const placeBidOnAsset = createAsyncThunk('asset/placeBidOnAsset',async(payload:any,thunkAPI:any)=>{
  try{
    const response = await axiosInstance.post('/bids',payload)
    return response.data;
  }catch(error:any){
    thunkAPI.rejectWithValue(error.response.data);
  }
})

export const deleteAsset = createAsyncThunk('asset/delete',async(payload:any,thunkAPI)=>{
  try{
    const response = await axiosInstance.post('/asset/delete',payload);
    return response.data;
  }catch(error:any){
    thunkAPI.rejectWithValue(error.response.data);
  }
})

export const getAssetCount = createAsyncThunk('asset/copies-count',async(id:any,thunkAPI)=>{
  try{
    const response = await axiosInstance.get(`/asset/get-copies-data/${id}`);
    return response.data;
  }catch(error:any){
    thunkAPI.rejectWithValue(error.response.data);
  }
})

export const getAssetCountListing = createAsyncThunk('asset/copies-count-listing',async(id:any,thunkAPI)=>{
  try{
    const response = await axiosInstance.get(`/asset/get-asset-data/${id}?query=listing&onSale=true`);
    return response.data;
  }catch(error:any){
    thunkAPI.rejectWithValue(error.response.data);
  }
})
export const getAssetCountOffers = createAsyncThunk('asset/copies-count-offers',async(id:any,thunkAPI)=>{
  try{
    const response = await axiosInstance.get(`/asset/get-asset-data/${id}?query=listing&onSale=false`);
    return response.data;
  }catch(error:any){
    thunkAPI.rejectWithValue(error.response.data);
  }
})

export const getAssetFavouriteUserList = createAsyncThunk('asset/favourite-listing',async({id, page, pageSize}:any, thunkAPI)=>{
  try{
    const response = await axiosInstance.get(`/favourite/get/users/${id}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }catch(error:any){
    thunkAPI.rejectWithValue(error.response.data)
  }
})

