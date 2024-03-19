import { createSlice } from '@reduxjs/toolkit';
import { getAllUsers, followUnfollowAction, getUserAssets, getAllUserCatalogs, getAllUserFavAssets, getAllUserFavCatalogs, getAllPlacedOffers, getAllReceivedOffers, getAllPlacedBids, getAllReceivedBids, getAllMyDrafts, getAllMyOrders, getAllUserFollowers, getAllUserFollowing, getUsersActivity } from './users.action';
import IInitialState, { IUsers } from './usersInterface';
import { IFollower, IFollowing } from '@/Containers/userDetailPage/ConnectionsModal';

// *** All catalogs initial state & slice *** //

const initialState: IInitialState = {
  usersData: {
    users: [],
    totalCount: 0,
    loading: true,
    latestPage: 1,
    hasMore: true,
    serverError: null,
    userDetails: {},
    userDetailsLoading: true,
    userFollowers: {},
    userFollowing: {},
    userCreatedAssets: {},
    userCollectedAssets: {},
    userCatalogs: {},
    userFavAssets: {},
    userFavCatalogs: {},
    userPlacedOffers: {},
    userReceivedOffers: {},
    userPlacedBids: {},
    userReceivedBids: {},
    userProfileDrafts: {},
    userProfileOrders: {},
    userTabDataLoading: true,
    followUnfollowLoading: true,
    userActivityHistory: {}
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserStates: (state: IInitialState) => {
      state.usersData.userDetails = {};
      state.usersData.userFollowers = {};
      state.usersData.userFollowing = {};
      state.usersData.userCreatedAssets = {};
      state.usersData.userCollectedAssets = {};
      state.usersData.userCatalogs = {};
      state.usersData.userFavAssets = {};
      state.usersData.userFavCatalogs = {};
      state.usersData.userPlacedOffers = {};
      state.usersData.userReceivedOffers = {};
      state.usersData.userPlacedBids = {};
      state.usersData.userReceivedBids = {};
      state.usersData.userProfileDrafts = {};
      state.usersData.userProfileOrders = {};
      state.usersData.userActivityHistory = {};
    },
    resetUserAssets: (state: IInitialState) => {
      state.usersData.userCreatedAssets = {};
      state.usersData.userCollectedAssets = {};
      state.usersData.userFavAssets = {};
      state.usersData.userPlacedOffers = {};
      state.usersData.userReceivedOffers = {};
      state.usersData.userPlacedBids = {};
      state.usersData.userReceivedBids = {};
      },
    addNewCatalog: (state: IInitialState, action) => {
      if (!!state.usersData.userCatalogs.catalogs.length) {
        state.usersData.userCatalogs.catalogs = [
          ...state.usersData.userCatalogs.catalogs,
          action.payload];
      } else {
        state.usersData.userCatalogs.catalogs = [action.payload];
      }
    },
    updateFollowStatus: (state: IInitialState, action) => {
      switch (action.payload.title) {
        case "Followers": {
          const index = state.usersData.userFollowers.followers.findIndex(
            (follower: IFollower) => follower.followerId === action.payload.userId,
          );
          state.usersData.userFollowers.followers[index].isFollower = action.payload.followStatus;
          if (action.payload.ownProfile) {
            state.usersData.userFollowing = {};
          }
          break;
        }
        case "Following": {
          const index = state.usersData.userFollowing.following.findIndex(
            (following: IFollowing) => following.followingId === action.payload.userId,
          );
          state.usersData.userFollowing.following[index].isFollower = action.payload.followStatus;
          break;
        }
        case "Profile": {
          const updatedUserDetails = {
            ...state.usersData.userDetails,
            followerCount: action.payload.followStatus
              ? state.usersData.userDetails.followerCount + 1
              : state.usersData.userDetails.followerCount - 1,
            isFollower: action.payload.followStatus,
          };
          state.usersData.userDetails = { ...updatedUserDetails };
          state.usersData.userFollowers = {};
          break;
        }
        case "User Card": {
          const index = state.usersData.users.findIndex(
            (user: IUsers) => user.id === action.payload.userId,
          );
          state.usersData.users[index].isFollower = action.payload.followStatus;
          action.payload.followStatus ?
            state.usersData.users[index].followerCount += 1 :
            state.usersData.users[index].followerCount -= 1 ;
          break;
        }  
      }
      if (action.payload.ownProfile) {
        const updatedUserDetails = {
          ...state.usersData.userDetails,
          followingCount: action.payload.followStatus
            ? state.usersData.userDetails.followingCount + 1
            : state.usersData.userDetails.followingCount - 1,
        };
        state.usersData.userDetails = {...updatedUserDetails};
      }
    },
    deleteDraft: (state: IInitialState, action) => {
      state.usersData.userProfileDrafts.assets = state.usersData.userProfileDrafts.assets.filter(
        (draft: any) => draft.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    // getAllUsers reducers
    builder
      .addCase(getAllUsers.pending, (state: IInitialState) => {
        state.usersData.loading = true;
        state.usersData.serverError = null;
      })
      .addCase(getAllUsers.fulfilled, (state: IInitialState, action) => {
        if (action.payload.userId) {
          state.usersData.userDetails = action.payload?.resObj || {};
          state.usersData.loading = false;
        } else {
          state.usersData.loading = false;
          const newData = action.payload?.resObj?.data || [];
          state.usersData.users = action.payload.loadMore
            ? [...state.usersData.users, ...newData]
            : newData;
          state.usersData.totalCount =
            action.payload.resObj?.pagination?.totalCount;
          state.usersData.latestPage =
            action.payload.resObj?.pagination?.page;
          state.usersData.hasMore =
            action.payload.resObj?.pagination?.totalPages >
            action.payload?.latestPage;
        }
      })
      .addCase(getAllUsers.rejected, (state: IInitialState, action) => {
        state.usersData.loading = false;
        state.usersData.serverError = action.payload;
      });
    // follow unfollow reducers
    builder.addCase(followUnfollowAction.pending, (state: IInitialState) => {
      state.usersData.followUnfollowLoading = true;
      state.usersData.serverError = null;
    });
    builder.addCase(
      followUnfollowAction.fulfilled,
      (state: IInitialState, action) => {
        state.usersData.followUnfollowLoading = false;
      },
    );
    builder.addCase(
      followUnfollowAction.rejected,
      (state: IInitialState, action) => {
        state.usersData.followUnfollowLoading = false;
        state.usersData.serverError = action.payload;
      },
    );
    // getAllUserFollowers reducers
    builder.addCase(getAllUserFollowers.pending, (state: IInitialState) => {
      state.usersData.loading = true;
      });
      builder.addCase(getAllUserFollowers.fulfilled, (state: IInitialState, action: any) => {
        const newData = action.payload?.resObj?.data || [];
        state.usersData.userFollowers.followers = action.payload.loadMore
          ? [...state.usersData.userFollowers.followers, ...newData]
          : newData;
        state.usersData.userFollowers.totalCount =
          action.payload.resObj?.pagination?.totalCount;
        state.usersData.userFollowers.latestPage =
          action.payload.resObj?.pagination?.page;
        state.usersData.userFollowers.hasMore =
          action.payload.resObj?.pagination?.totalPages >
          action.payload?.latestPage;
        state.usersData.loading = false;
      });
      builder.addCase(getAllUserFollowers.rejected, (state: IInitialState) => {
        state.usersData.loading = false;
      });
    // getAllUserFollowing reducers
    builder.addCase(getAllUserFollowing.pending, (state: IInitialState) => {
      state.usersData.loading = true;
      });
    builder.addCase(getAllUserFollowing.fulfilled, (state: IInitialState, action: any) => {
        const newData = action.payload?.resObj?.data || [];
        state.usersData.userFollowing.following = action.payload.loadMore
          ? [...state.usersData.userFollowing.following, ...newData]
          : newData;
        state.usersData.userFollowing.totalCount =
          action.payload.resObj?.pagination?.totalCount;
        state.usersData.userFollowing.latestPage =
          action.payload.resObj?.pagination?.page;
        state.usersData.userFollowing.hasMore =
          action.payload.resObj?.pagination?.totalPages >
          action.payload?.latestPage;
        state.usersData.loading = false;
      });
      builder.addCase(getAllUserFollowing.rejected, (state: IInitialState) => {
        state.usersData.loading = false;
      });
    // userAssets reducers
    builder
      .addCase(getUserAssets.pending, (state: IInitialState) => {
        state.usersData.userTabDataLoading = true;
        state.usersData.serverError = null;
      })
      .addCase(getUserAssets.fulfilled, (state: IInitialState, action) => {
        switch (action.payload.paramField) {
          case 'creatorId':
            {
              const newData = action.payload?.resObj?.data || [];
              state.usersData.userCreatedAssets.assets = action.payload
                .loadMore
                ? [
                    ...state.usersData.userCreatedAssets.assets,
                    ...newData,
                  ]
                : newData;
              state.usersData.userCreatedAssets.totalCount =
                action.payload.resObj?.pagination?.totalCount;
              state.usersData.userCreatedAssets.latestPage =
                action.payload.resObj?.pagination?.page;
              state.usersData.userCreatedAssets.hasMore =
                action.payload.resObj?.pagination?.totalPages >
                action.payload?.latestPage;
              state.usersData.userTabDataLoading = false;
            }
            break;
          case 'ownerId':
            {
              const newData = action.payload?.resObj?.data || [];
              state.usersData.userCollectedAssets.assets = action.payload
                .loadMore
                ? [...state.usersData.userCollectedAssets.assets, ...newData]
                : newData;
              state.usersData.userCollectedAssets.totalCount =
                action.payload.resObj?.pagination?.totalCount;
              state.usersData.userCollectedAssets.latestPage =
                action.payload.resObj?.pagination?.page;
              state.usersData.userCollectedAssets.hasMore =
                action.payload.resObj?.pagination?.totalPages >
                action.payload?.latestPage;
              state.usersData.userTabDataLoading = false;
            }
            break;
        }
      })
      .addCase(getUserAssets.rejected, (state: IInitialState, action) => {
        state.usersData.userTabDataLoading = false;
        state.usersData.serverError = action.payload;
      });
    //  getAllUserCatalogs reducers
    builder
      .addCase(getAllUserCatalogs.pending, (state: IInitialState, action) => {
        state.usersData.userTabDataLoading = true;
        state.usersData.serverError = null;
      })
      .addCase(getAllUserCatalogs.fulfilled, (state: IInitialState, action) => {
        const newData = action.payload?.resObj?.data || [];
        state.usersData.userCatalogs.catalogs = action.payload
          .loadMore
          ? [...state.usersData.userCatalogs.catalogs, ...newData]
          : newData;
        state.usersData.userCatalogs.totalCount =
          action.payload.resObj?.pagination?.totalCount;
        state.usersData.userCatalogs.latestPage =
          action.payload.resObj?.pagination?.page;
        state.usersData.userCatalogs.hasMore =
          action.payload.resObj?.pagination?.totalPages >
          action.payload?.latestPage;
        state.usersData.userTabDataLoading = false;
      })
      .addCase(getAllUserCatalogs.rejected, (state: IInitialState, action) => {
        state.usersData.userTabDataLoading = false;
        state.usersData.serverError = action.payload;
      });
    // getAllUserFavAssets reducers
    builder
      .addCase(getAllUserFavAssets.pending, (state: IInitialState) => {
        state.usersData.userTabDataLoading = true;
      })
      .addCase(
        getAllUserFavAssets.fulfilled,
        (state: IInitialState, action) => {
          const newData = action.payload?.resObj?.formattedFavourites || [];
          state.usersData.userFavAssets.assets = action.payload
            .loadMore
            ? [...state.usersData.userFavAssets.assets, ...newData]
            : newData;
          state.usersData.userFavAssets.totalCount =
            action.payload.resObj?.pagination?.totalCount;
          state.usersData.userFavAssets.latestPage =
            action.payload.resObj?.pagination?.page;
          state.usersData.userFavAssets.hasMore =
            action.payload.resObj?.pagination?.totalPages >
            action.payload?.latestPage;
          state.usersData.userTabDataLoading = false;
        },
      )
      .addCase(
        getAllUserFavAssets.rejected,
        (state: IInitialState) => {
          state.usersData.userTabDataLoading = false;
        },
      );
    //  getAllUserFavCatalogs reducers
    builder
    .addCase(getAllUserFavCatalogs.pending, (state: IInitialState) => {
      state.usersData.userTabDataLoading = true;
      state.usersData.serverError = null;
    })
    .addCase(
      getAllUserFavCatalogs.fulfilled,
      (state: IInitialState, action) => {
        const newData = action.payload?.resObj?.formattedFavourites || [];
        state.usersData.userFavCatalogs.catalogs = action.payload
          .loadMore
          ? [...state.usersData.userFavCatalogs.catalogs, ...newData]
          : newData;
        state.usersData.userFavCatalogs.totalCount =
          action.payload.resObj?.pagination?.totalCount;
        state.usersData.userFavCatalogs.latestPage =
          action.payload.resObj?.pagination?.page;
        state.usersData.userFavCatalogs.hasMore =
          action.payload.resObj?.pagination?.totalPages >
          action.payload?.latestPage;
        state.usersData.userTabDataLoading = false;
      },
    )
    .addCase(
      getAllUserFavCatalogs.rejected,
      (state: IInitialState, action) => {
        state.usersData.userTabDataLoading = false;
        state.usersData.serverError = action.payload;
      },
    );
    // getAllPlacedOffers reducers
    builder.addCase(getAllPlacedOffers.pending, (state: IInitialState) => {
      state.usersData.userTabDataLoading = true;
    });
    builder.addCase(getAllPlacedOffers.fulfilled, (state: IInitialState, action: any) => {
      const newData = action.payload?.resObj?.data || [];
      state.usersData.userPlacedOffers.assets = action.payload.loadMore
        ? [...state.usersData.userPlacedOffers.assets, ...newData]
        : newData;
      state.usersData.userPlacedOffers.totalCount =
        action.payload.resObj?.pagination?.totalCount;
      state.usersData.userPlacedOffers.latestPage =
        action.payload.resObj?.pagination?.page;
      state.usersData.userPlacedOffers.hasMore =
        action.payload.resObj?.pagination?.totalPages >
        action.payload?.latestPage;
      state.usersData.userTabDataLoading = false;
    });
    builder.addCase(getAllPlacedOffers.rejected, (state: IInitialState) => {
      state.usersData.userTabDataLoading = false;
    });
    // getAllReceivedOffers reducers
    builder.addCase(getAllReceivedOffers.pending, (state: IInitialState) => {
    state.usersData.userTabDataLoading = true;
    });
    builder.addCase(getAllReceivedOffers.fulfilled, (state: IInitialState, action: any) => {
      const newData = action.payload?.resObj?.data || [];
      state.usersData.userReceivedOffers.assets = action.payload.loadMore
        ? [...state.usersData.userReceivedOffers.assets, ...newData]
        : newData;
      state.usersData.userReceivedOffers.totalCount =
        action.payload.resObj?.pagination?.totalCount;
      state.usersData.userReceivedOffers.latestPage =
        action.payload.resObj?.pagination?.page;
      state.usersData.userReceivedOffers.hasMore =
        action.payload.resObj?.pagination?.totalPages >
        action.payload?.latestPage;
      state.usersData.userTabDataLoading = false;
    });
    builder.addCase(getAllReceivedOffers.rejected, (state: IInitialState) => {
      state.usersData.userTabDataLoading = false;
    });
    // getAllPlacedBids reducers
    builder.addCase(getAllPlacedBids.pending, (state: IInitialState) => {
      state.usersData.userTabDataLoading = true;
    });
    builder.addCase(getAllPlacedBids.fulfilled, (state: IInitialState, action: any) => {
      const newData = action.payload?.resObj?.data || [];
      state.usersData.userPlacedBids.assets = action.payload.loadMore
        ? [...state.usersData.userPlacedBids.assets, ...newData]
        : newData;
      state.usersData.userPlacedBids.totalCount =
        action.payload.resObj?.pagination?.totalCount;
      state.usersData.userPlacedBids.latestPage =
        action.payload.resObj?.pagination?.page;
      state.usersData.userPlacedBids.hasMore =
        action.payload.resObj?.pagination?.totalPages >
        action.payload?.latestPage;
      state.usersData.userTabDataLoading = false;
    });
    builder.addCase(getAllPlacedBids.rejected, (state: IInitialState) => {
      state.usersData.userTabDataLoading = false;
    });
    // getAllReceivedBids reducers
    builder.addCase(getAllReceivedBids.pending, (state: IInitialState) => {
    state.usersData.userTabDataLoading = true;
    });
    builder.addCase(getAllReceivedBids.fulfilled, (state: IInitialState, action: any) => {
      const newData = action.payload?.resObj?.data || [];
      state.usersData.userReceivedBids.assets = action.payload.loadMore
        ? [...state.usersData.userReceivedBids.assets, ...newData]
        : newData;
      state.usersData.userReceivedBids.totalCount =
        action.payload.resObj?.pagination?.totalCount;
      state.usersData.userReceivedBids.latestPage =
        action.payload.resObj?.pagination?.page;
      state.usersData.userReceivedBids.hasMore =
        action.payload.resObj?.pagination?.totalPages >
        action.payload?.latestPage;
      state.usersData.userTabDataLoading = false;
    });
    builder.addCase(getAllReceivedBids.rejected, (state: IInitialState) => {
      state.usersData.userTabDataLoading = false;
    });
     // getAllMyDrafts reducers
     builder.addCase(getAllMyDrafts.pending, (state: IInitialState) => {
      state.usersData.userTabDataLoading = true;
    });
    builder.addCase(
      getAllMyDrafts.fulfilled,
      (state: IInitialState, action: any) => {
        const newData = action.payload?.resObj?.data || [];
      state.usersData.userProfileDrafts.assets = action.payload.loadMore
        ? [...state.usersData.userProfileDrafts.assets, ...newData]
        : newData;
      state.usersData.userProfileDrafts.totalCount =
        action.payload.resObj?.pagination?.totalCount;
      state.usersData.userProfileDrafts.latestPage =
        action.payload.resObj?.pagination?.page;
      state.usersData.userProfileDrafts.hasMore =
        action.payload.resObj?.pagination?.totalPages >
        action.payload?.latestPage;
      state.usersData.userTabDataLoading = false;
      },
    );
    builder.addCase(getAllMyDrafts.rejected, (state: IInitialState) => {
      state.usersData.userTabDataLoading = false;
    });
    // getAllMyOrders reducers
    builder.addCase(getAllMyOrders.pending, (state: IInitialState) => {
      state.usersData.userTabDataLoading = true;
    });
    builder.addCase(getAllMyOrders.fulfilled, (state: IInitialState, action: any) => {
      const newData = action.payload?.resObj?.data || [];
      state.usersData.userProfileOrders.orders = action.payload.loadMore
        ? [...state.usersData.userProfileOrders.orders, ...newData]
        : newData;
      state.usersData.userProfileOrders.totalCount =
        action.payload.resObj?.pagination?.totalCount;
      state.usersData.userProfileOrders.totalPages =
        action.payload.resObj?.pagination?.totalPages;
      state.usersData.userProfileOrders.latestPage =
        action.payload.resObj?.pagination?.page;
      state.usersData.userProfileOrders.hasMore =
        action.payload.resObj?.pagination?.totalPages >
        action.payload?.latestPage;
      state.usersData.userTabDataLoading = false;
    });
    builder.addCase(getAllMyOrders.rejected, (state: IInitialState) => {
      state.usersData.userTabDataLoading = false;
    });
    // get all user activity
    builder.addCase(getUsersActivity.pending, (state: IInitialState) => {
      state.usersData.userTabDataLoading = true;
    });
    builder.addCase(
      getUsersActivity.fulfilled,
      (state: IInitialState, action) => {
        const newData = action.payload?.resObj?.data || [];

        state.usersData.userActivityHistory.activities = action.payload.loadMore
          ? [...state.usersData.userActivityHistory.activities, ...newData]
          : newData;

        state.usersData.userActivityHistory.totalCount =
          action.payload.resObj?.pagination?.totalCount;

        state.usersData.userActivityHistory.totalPages =
          action.payload.resObj?.pagination?.totalPages;

        state.usersData.userActivityHistory.latestPage =
          action.payload.resObj?.pagination?.page;

        state.usersData.userActivityHistory.hasMore =
          action.payload.resObj?.pagination?.totalPages >
          action.payload?.latestPage;
          
        state.usersData.userTabDataLoading = false;
      }
    )
    builder.addCase(getUsersActivity.rejected, (state: IInitialState) => {
      state.usersData.userTabDataLoading = false;
    });
  },
});
export const { resetUserStates, resetUserAssets, addNewCatalog, updateFollowStatus, deleteDraft } = usersSlice.actions;
export default usersSlice.reducer;
