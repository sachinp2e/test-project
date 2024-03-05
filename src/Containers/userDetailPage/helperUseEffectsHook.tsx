import useEffectOnce from '@/Hooks/useEffectOnce';
import { clearAllGlobalFilters, toggleMakeApiCall } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.slice';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllMyDrafts, getAllMyOrders, getAllPlacedBids, getAllPlacedOffers, getAllReceivedBids, getAllReceivedOffers, getAllUserCatalogs, getAllUserFavAssets, getAllUserFavCatalogs, getAllUsers, getUserAssets } from '@/Lib/users/users.action';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import { resetUserStates } from '@/Lib/users/users.slice';
import { useEffect, useState } from 'react';

interface IHelperUseEffectsHook {
  showCategory: string;
  subCategory: string;
  search: string;
  userId: string;
  makeApiCall: boolean;
  setSubCategory: (subCategory: string) => void;
  setIsVisible: (visibility: boolean) => void;
  setSubCategoryTabs: ([subTab1, subTab2]: string[]) => void;
  setDropDownVisible: (dropDownVisibility: boolean) => void;
}

export const helperUseEffectsHook = (params: IHelperUseEffectsHook) => {
    const [firstRender, setFirstRender] = useState<boolean>(true);    
    const { showCategory, subCategory, search, userId, makeApiCall,
    setSubCategory, setSubCategoryTabs, setIsVisible, setDropDownVisible } = params;

    const dispatch = useAppDispatch();
    const {
        usersData: { userCreatedAssets, userCollectedAssets, userCatalogs, userFavAssets, userFavCatalogs,
        userPlacedOffers, userReceivedOffers, userPlacedBids, userReceivedBids, userProfileDrafts, userProfileOrders: {orders}},
      } = useAppSelector(getAllUsersSelector);
      
    useEffectOnce(() => {
      setFirstRender(false);
      dispatch(resetUserStates());
      dispatch(clearAllGlobalFilters());
      dispatch(getAllUsers({ userId: userId }));
    });
  
    useEffect(() => {
      if (makeApiCall) {
        if (showCategory === 'Assets' && subCategory === 'Created') {
          dispatch(getUserAssets({ creatorId: `${params?.userId}` }));
        }
        else if (showCategory === 'Assets' && subCategory === 'Collected') {
          dispatch(getUserAssets({ ownerId: `${params?.userId}` }));
        }
        dispatch(toggleMakeApiCall());
      }
    }, [makeApiCall]);

    // useEffect to make calls whenever categoryTab is selected/changed
    useEffect(() => {
        if (showCategory === 'Assets') {
          setIsVisible(true);
          setSubCategoryTabs(['Collected', 'Created']);
          setSubCategory('Collected');
          setDropDownVisible(false);
        }
        if (showCategory === 'Favourites') {
          setIsVisible(true);
          setSubCategoryTabs(['Assets', 'Catalogs']);
          setSubCategory('Assets');
          setDropDownVisible(false);
        }
        if (showCategory === 'Offers') {
          setIsVisible(false);
          setSubCategoryTabs(['Offers placed', 'Offers received']);
          setSubCategory('Offers placed');
          setDropDownVisible(false);
        }
        if (showCategory === 'Bids') {
          setIsVisible(false);
          setSubCategoryTabs(['Bids placed', 'Bids received']);
          setSubCategory('Bids placed');
          setDropDownVisible(false);
        }
        if (showCategory === 'Catalogs') {
          setIsVisible(true);
          setSubCategoryTabs([]);
          setDropDownVisible(false);
          if (!userCatalogs?.catalogs?.length)
            dispatch(getAllUserCatalogs({ userId: userId }));
        }
        if (
          showCategory === 'Offers' ||
          showCategory === 'Bids'
        ) {
          setIsVisible(false);
        }
        if (showCategory === 'My Drafts') {
          setIsVisible(false);
          setSubCategoryTabs([]);
          setDropDownVisible(false);
          // if (!userProfileDrafts?.assets?.length)
            dispatch(getAllMyDrafts({}));
        }
        else if (showCategory === 'Orders') {
          setIsVisible(false);
          setSubCategoryTabs([]);
          setDropDownVisible(false);
          if(!orders?.length)
            dispatch(getAllMyOrders({}));
        }
        else if (showCategory === 'History') {
          setIsVisible(false);
          setSubCategoryTabs([]);
          setDropDownVisible(false);
        }
    }, [showCategory]);

    // useEffect to make calls whenever subCategoryTab is selected/changed
  useEffect(() => {
        if(firstRender){
          return;
        }
        else if (showCategory === 'Assets' && subCategory === 'Created' && !userCreatedAssets?.assets?.length) {
          dispatch(getUserAssets({ creatorId: `${params?.userId}` }));
        }
        else if (showCategory === 'Assets' && subCategory === 'Collected' && !userCollectedAssets?.assets?.length) {
          dispatch(getUserAssets({ ownerId: `${params?.userId}` }));
        }
        else if (showCategory === 'Favourites' && subCategory === 'Assets' && !userFavAssets?.assets?.length) {
          dispatch(getAllUserFavAssets({ userId: `${params?.userId}` }));
        }
        else if (showCategory === 'Favourites' && subCategory === 'Catalogs' && !userFavCatalogs?.catalogs?.length) {
          dispatch(getAllUserFavCatalogs({ userId: `${params?.userId}` }));
        }
        else if (showCategory === 'Offers' && subCategory === 'Offers placed' && !userPlacedOffers?.assets?.length) {
          dispatch(getAllPlacedOffers({}));
        }
        else if (showCategory === 'Offers' && subCategory === 'Offers received' && !userReceivedOffers?.assets?.length) {
          dispatch(getAllReceivedOffers({}));
        }
        else if (showCategory === 'Bids' && subCategory === 'Bids placed' && !userPlacedBids?.assets?.length) {
          dispatch(getAllPlacedBids({}));
        }
        else if (showCategory === 'Bids' && subCategory === 'Bids received' && !userReceivedBids?.assets?.length) {
          dispatch(getAllReceivedBids({}));
        }
    }, [subCategory]);

    // useEffect to make calls whenever search is changed
  useEffect(() => {
    if(firstRender){
      return;
    }
    else if (showCategory === 'Catalogs') {
        dispatch(getAllUserCatalogs({ userId: userId, filters: {search: search} }));
    }
    else if (showCategory === 'Assets' && subCategory === 'Created') {
      dispatch(getUserAssets({ creatorId: `${params?.userId}`, filters: {search: search} }));
    }
    else if (showCategory === 'Assets' && subCategory === 'Collected') {
      dispatch(getUserAssets({ ownerId: `${params?.userId}`, filters: {search: search} }));
    }
    else if (showCategory === 'Favourites' && subCategory === 'Assets') {
      dispatch(getAllUserFavAssets({ userId: `${params?.userId}`, filters: {search: search} }));
    }
    else if (showCategory === 'Favourites' && subCategory === 'Catalogs') {
      dispatch(getAllUserFavCatalogs({ userId: `${params?.userId}`, filters: {search: search} }));
    }
   }, [search]);

};
