export interface IGetUsersParams {
  filters?: any;
  loadMore?: boolean;
  latestPage?: number;
  pageSize?: number;
  userId?: string;
  search?: string;
}

export interface IGetUserAssetsParams{
  filters?: any;
  loadMore?: boolean;
  latestPage?: number;
  pageSize?: number;
  creatorId?: string;
  ownerId?: string;
}

export interface IUsers {
  id: string;
  authId: string;
  firstName: string;
  lastName: string;
  userName: string;
  bio: string;
  email: string;
  phone: string;
  followerCount: number;
  followingCount: number;
  website: string;
  instagram: string;
  twitter: string;
  discord: string;
  kalpId: string;
  profileImage: string;
  bannerImage: string;
  isKycVerified: boolean;
  kycStatus: string;
  kycId: string;
  blockchainUserPassword: string;
  blockchainEnrolmentId: string;
  blockChainKycId: string;
  isBlockChainRegisterd: boolean;
  blockchainEnrollStatus: string;
  mai_wallet_id: string;
  first_login: string;
  last_login: string;
  isSuspend: boolean;
  isOtpDisabled: boolean;
  isFollower: boolean;
}

interface IUserData {
  users: IUsers[];
  totalCount: number;
  serverError: any;
  latestPage: number;
  hasMore: boolean;
  loading: boolean;
  followUnfollowLoading: boolean;
  currentUserTab: string;
  userDetails: any; //{IUsers}
  userFollowers: any; // {followers: IUsers[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userFollowing: any; // {following: IUsers[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userCreatedAssets: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userCollectedAssets: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userCatalogs: any; //{catalogs: catalogsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userFavAssets: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userFavCatalogs: any; //{catalogs: catalogsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userPlacedOffers: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userReceivedOffers: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userPlacedBids: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userReceivedBids: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userProfileDrafts: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userProfileOrders: any; //{assets: assetsArr[]; totalCount: number; latestPage: number; hasMore: boolean; loading: boolean; serverError: any;}
  userActivityHistory: any; 
}

export default interface IInitialState {
  usersData: IUserData;
}
