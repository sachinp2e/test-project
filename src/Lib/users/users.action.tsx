import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { IGetUserAssetsParams, IGetUsersParams } from './usersInterface';
import { getAllAssetFilterPayload } from '../assets/utils';

// *** GET users API *** //

export const getAllUsers = createAsyncThunk(
  `/user?page=''&pageSize=''`,
  async (
    {
      filters,
      loadMore = false,
      latestPage = 1,
      pageSize = 15,
      userId = '',
      search,
    }: IGetUsersParams,
    thunkAPI: any,
  ) => {
    try {
      let url = userId
          ? `/user/id/${userId}`
          : `/user?page=${latestPage}&pageSize=${pageSize}`;
      if (filters) {
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (key && value) {
            url += `&${key}=${value}`;
          }
        });
      }
      if (search) {
        url += `&search=${search}`;
      }
      const response = await axiosInstance.get(url);
      return {
        resObj: response.data?.result,
        loadMore,
        filters,
        latestPage,
        userId
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** POST follow/unfollow user API *** //

export const followUnfollowAction = createAsyncThunk(
  'follower/addAndRemoveFollower',
  async (
    data: {
      followingId: string;
      isFollow: boolean;
    },
    thunkAPI: any,
  ) => {
    try {
      await axiosInstance.post('/follower/addAndRemoveFollower', data);
      return {
        userId: data?.followingId,
        followStatus: data?.isFollow
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET user's follow API *** //

export const getAllUserFollowers = createAsyncThunk(
  `/follower/getAllFollowers/userId?page=number&pageSize=number`,
  async ({
    loadMore = false,
    latestPage = 1,
    pageSize = 10,
    userId
  }: IGetUsersParams, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/follower/getAllFollowers/${userId}?page=${latestPage}&pageSize=${pageSize}`);
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// *** GET user's following API *** //

export const getAllUserFollowing = createAsyncThunk(
  `/follower/getAllFollowing/userId?page=number&pageSize=number`,
  async ({
    loadMore = false,
    latestPage = 1,
    pageSize = 10,
    userId
  }: IGetUsersParams, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/follower/getAllFollowing/${userId}?page=${latestPage}&pageSize=${pageSize}`);
      return {
        resObj: response.data?.result?.following,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// *** GET user collected/created assets API *** //

export const getUserAssets = createAsyncThunk(
  `/asset?page=number&pageSize=number`,
  async (
    {
      filters,
      loadMore = false,
      latestPage = 1,
      ownerId,
      creatorId,
    }: IGetUserAssetsParams,
    thunkAPI: any,
  ) => {
    try {
      let url = creatorId
        ? `/asset?page=${latestPage}&pageSize=15&creator=${creatorId}`
        : `/asset?page=${latestPage}&pageSize=15&owner=${ownerId}`;
      if (filters) {
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (key && value) {
            url += `&${key}=${value}`;
          }
        });
      }
      // @ts-ignore
      const state: RootState = thunkAPI.getState();
      const payload = getAllAssetFilterPayload(state.globalSearch, state.assets);
      const response = await axiosInstance.get(url, { params: payload });
      return {
        resObj: response.data?.result,
        loadMore,
        filters,
        latestPage,
        paramField: creatorId
            ? `creatorId` : `ownerId`
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET User Catalogs API *** //

export const getAllUserCatalogs = createAsyncThunk(
  `/catalogue?page=number&pageSize=number&user=string`,
  async (
    {
      filters,
      loadMore = false,
      latestPage = 1,
      pageSize = 15,
      userId,
    }: IGetUsersParams,
    thunkAPI: any,
  ) => {
    try {
      let url = `/catalogue?page=${latestPage}&pageSize=${pageSize}&user=${userId}`;
      if (filters) {
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (key && value) {
            url += `&${key}=${value}`;
          }
        });
      }
      const response: any = await axiosInstance.get(url);
      return {
        resObj: response.data?.result,
        loadMore,
        filters,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET User Fav Assets API *** //

export const getAllUserFavAssets = createAsyncThunk(
  `/favourite/getAllFavouriteAsset/userId=string?page=number&pageSize=number`,
  async (
    {
      filters,
      loadMore = false,
      latestPage = 1,
      pageSize = 15,
      userId,
    }: IGetUsersParams,
    thunkAPI: any,
  ) => {
    try {
      let url = `/favourite/getAllFavouriteAsset/${userId}?page=${latestPage}&pageSize=${pageSize}`;
      if (filters) {
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (key && value) {
            url += `&${key}=${value}`;
          }
        });
      }
      // @ts-ignore
      const state: RootState = thunkAPI.getState();
      const payload = getAllAssetFilterPayload(state.globalSearch, state.assets);
      const response = await axiosInstance.get(url, { params: payload });
      return {
        resObj: response.data?.result,
        loadMore,
        filters,
        latestPage,
        userId,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET User Fav Catalogs API *** //

export const getAllUserFavCatalogs = createAsyncThunk(
  `/favourite/getAllFavouriteCatalogue/userId=string?page=number&pageSize=number`,
  async (
    {
      filters,
      loadMore = false,
      latestPage = 1,
      pageSize = 15,
      userId,
    }: IGetUsersParams,
    thunkAPI: any,
  ) => {
    try {
      let url = `/favourite/getAllFavouriteCatalogue/${userId}?page=${latestPage}&pageSize=${pageSize}`;
      if (filters) {
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (key && value) {
            url += `&${key}=${value}`;
          }
        });
      }
      const response: any = await axiosInstance.get(url);
      return {
        resObj: response.data?.result,
        loadMore,
        filters,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET User Placed Offers API *** //

export const getAllPlacedOffers = createAsyncThunk(
  `/offer/getAllPlacedOffer?page=number&pageSize=number`,
  async ({
    loadMore = false,
    latestPage = 1,
    pageSize = 15,
  }: IGetUsersParams, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/offer/getAllPlacedOffer?page=${latestPage}&pageSize=${pageSize}`);
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// *** GET User Received Offers API *** //

export const getAllReceivedOffers = createAsyncThunk(
  `/offer/getAllUserAssetOffer?page=number&pageSize=number`,
  async ({
    loadMore = false,
    latestPage = 1,
    pageSize = 15,
  }: IGetUsersParams, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/offer/getAllUserAssetOffer?page=${latestPage}&pageSize=${pageSize}`);
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// *** POST Accept/Reject Offers API *** //

export const acceptRejectOfferAction = createAsyncThunk(
  '/offer/acceptOrRejectOnAsset',
  async (
    {
      offerId,
      assetId,
      query,
    }: {
      offerId: string;
      assetId: string;
      query: boolean;
    },
    thunkAPI: any,
  ) => {
    try {
      const response = await axiosInstance.post('/offer/acceptOrRejectOnAsset', {
        offerId,
        assetId,
        query
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  },
);

// *** GET User Placed Bids API *** //

export const getAllPlacedBids = createAsyncThunk(
  `/bids/getAllPlacedBids?page=number&pageSize=number`,
  async ({
    loadMore = false,
    latestPage = 1,
    pageSize = 15,
  }: IGetUsersParams, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/bids/getAllPlacedBids?page=${latestPage}&pageSize=${pageSize}`);
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// *** GET User Placed Bids API *** //

export const getAllReceivedBids = createAsyncThunk(
  `/bids/getAllUserAssetBids?page=number&pageSize=number`,
  async ({
    loadMore = false,
    latestPage = 1,
    pageSize = 15,
  }: IGetUsersParams, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/bids/getAllUserAssetBids?page=${latestPage}&pageSize=${pageSize}`);
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// *** GET User Drafts API *** //

export const getAllMyDrafts = createAsyncThunk(
  `/draft/getAllDraftedAssetByUser?page=number&pageSize=number`,
  async ({
    loadMore = false,
    latestPage = 1,
    pageSize = 15,
  }: IGetUsersParams, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/draft/getAllDraftedAssetByUser?page=${latestPage}&pageSize=${pageSize}`);
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// *** GET User Orders API *** //

export const getAllMyOrders = createAsyncThunk(
  `/orders/user?page=number&pageSize=number`,
  async ({
      loadMore = false,
      latestPage = 1,
      pageSize = 10
  }: IGetUsersParams, thunkAPI,) => {
    try {
      const response = await axiosInstance.get(
        `/orders/user?page=${latestPage}&pageSize=${pageSize}`,
      );
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
  );

export const getUsersActivity = createAsyncThunk(
  `/activity?userId=userId?page=number`,
  async ({
    loadMore = false,
    latestPage = 1,
    pageSize = 10,
    userId
  }: IGetUsersParams, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/activity?page=${latestPage}&limit=${pageSize}`,
      );
      return {
        resObj: response.data?.result,
        loadMore,
        latestPage,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)
