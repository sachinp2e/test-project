import useEffectOnce from '@/Hooks/useEffectOnce';
import { clearAllGlobalFilters, toggleMakeApiCall } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.slice';
import { useAppDispatch } from '@/Lib/hooks';
import { getAllMyDrafts, getAllMyOrders, getAllPlacedBids, getAllPlacedOffers, getAllReceivedBids, getAllReceivedOffers, getAllUserCatalogs, getAllUserFavAssets, getAllUserFavCatalogs, getAllUsers, getUserAssets, getUsersActivity } from '@/Lib/users/users.action';
import { resetUserStates } from '@/Lib/users/users.slice';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IHelperUseEffectsHook {
  tab: string;
  showCategory: string;
  subCategory: string;
  search: string;
  userId: string;
  makeApiCall: boolean;
  setShowCategory: (showCategory: string) => void;
  setSubCategory: (subCategory: string) => void;
  setIsVisible: (visibility: boolean) => void;
  setSubCategoryTabs: ([subTab1, subTab2]: string[]) => void;
}

export const helperUseEffectsHook = (params: IHelperUseEffectsHook) => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const [firstRender, setFirstRender] = useState<boolean>(true);    
  const { tab, showCategory, subCategory, search, userId, makeApiCall,
      setShowCategory, setSubCategory, setSubCategoryTabs, setIsVisible } = params;

  // Very first useEffect to trigger resets common user redux states.
  useEffectOnce(() => {
    if (firstRender) {
      setFirstRender(false);
      dispatch(resetUserStates());
      dispatch(clearAllGlobalFilters()); // makeApiCall -> true (used for global filters)
      dispatch(getAllUsers({ userId: userId }));
    }
  })
  
  // footer redirection useEffect (if already on userDetail page)
  useEffect(() => {
    if (!firstRender) {
      setShowCategory(tab);
    }
  }, [tab])

  // 2nd useEffect to trigger and make first API call according to selected tabs & subTabs. Also triggers when filters are updated.
  useEffect(() => {
    if (makeApiCall) {
      if (showCategory === 'Assets' && subCategory === 'Created') {
        dispatch(getUserAssets({ creatorId: `${params?.userId}` }));
      } else if (showCategory === 'Assets' && subCategory === 'Collected') {
        dispatch(getUserAssets({ ownerId: `${params?.userId}` }));
      } else if (showCategory === 'Catalogs') {
        dispatch(getAllUserCatalogs({ userId: userId }));
      } else if (showCategory === 'Favorites' && subCategory === 'Assets') {
        dispatch(getAllUserFavAssets({ userId: `${params?.userId}` }));
      } else if (showCategory === 'Favorites' && subCategory === 'Catalogs') {
        dispatch(getAllUserFavCatalogs({ userId: `${params?.userId}` }));
      } else if (showCategory === 'Offers' && subCategory === 'Offers placed') {
        dispatch(getAllPlacedOffers({}));
      } else if (showCategory === 'Offers' && subCategory === 'Offers received') {
        dispatch(getAllReceivedOffers({}));
      } else if (showCategory === 'Bids' && subCategory === 'Bids placed') {
        dispatch(getAllPlacedBids({}));
      } else if (showCategory === 'Bids' && subCategory === 'Bids received') {
        dispatch(getAllReceivedBids({}));
      } else if (showCategory === 'My Drafts') {
        dispatch(getAllMyDrafts({}));
      } else if (showCategory === 'Orders') {
        dispatch(getAllMyOrders({}));
      } else if (showCategory === 'History') {
        dispatch(getUsersActivity({ userId: userId }));
      }
      dispatch(toggleMakeApiCall()); // makeApiCall -> false
    }
  }, [makeApiCall]);

  // useEffect to make calls whenever categoryTab is selected/changed
  useEffect(() => {
    if (showCategory === 'Assets') {
      setIsVisible(true);
      setSubCategoryTabs(['Collected', 'Created']);
      subCategory === 'Created' ? setSubCategory(subCategory) : setSubCategory('Collected');
    }
    if (showCategory === 'Favorites') {
      setIsVisible(true);
      setSubCategoryTabs(['Assets', 'Catalogs']);
      subCategory === 'Catalogs' ? setSubCategory(subCategory) : setSubCategory('Assets');
    }
    if (showCategory === 'Offers') {
      setIsVisible(false);
      setSubCategoryTabs(['Offers placed', 'Offers received']);
      subCategory === 'Offers received' ? setSubCategory(subCategory) : setSubCategory('Offers placed');
    }
    if (showCategory === 'Bids') {
      setIsVisible(false);
      setSubCategoryTabs(['Bids placed', 'Bids received']);
      subCategory === 'Bids received' ? setSubCategory(subCategory) : setSubCategory('Bids placed');
    }
    if (showCategory === 'Catalogs') {
      setIsVisible(true);
      setSubCategoryTabs([]);
      setSubCategory('');
      router.push(`${pathName}?tab=${showCategory}`, { scroll: false });
      dispatch(getAllUserCatalogs({ userId: userId }));
    }
    if (showCategory === 'My Drafts') {
      setIsVisible(false);
      setSubCategoryTabs([]);
      setSubCategory('');
      router.push(`${pathName}?tab=${showCategory}`, { scroll: false });
      dispatch(getAllMyDrafts({}));
    }
    if (showCategory === 'Orders') {
      setIsVisible(false);
      setSubCategoryTabs([]);
      setSubCategory('');
      router.push(`${pathName}?tab=${showCategory}`, { scroll: false });
      dispatch(getAllMyOrders({}));
    }
    if (showCategory === 'History') {
      setIsVisible(false);
      setSubCategoryTabs([]);
      setSubCategory('');
      router.push(`${pathName}?tab=${showCategory}`, { scroll: false });
      dispatch(getUsersActivity({ userId: userId }));
    }
  }, [showCategory]);

  // useEffect to make calls whenever subCategoryTab is selected/changed
  useEffect(() => {
    if(subCategory)router.push(`${pathName}?tab=${showCategory}&subTab=${subCategory}`, { scroll: false });
    if(firstRender){
      return;
    }
    else if (showCategory === 'Assets' && subCategory === 'Created') {
      dispatch(getUserAssets({ creatorId: `${params?.userId}` }));
    }
    else if (showCategory === 'Assets' && subCategory === 'Collected') {
      dispatch(getUserAssets({ ownerId: `${params?.userId}` }));
    }
    else if (showCategory === 'Favorites' && subCategory === 'Assets') {
      dispatch(getAllUserFavAssets({ userId: `${params?.userId}` }));
    }
    else if (showCategory === 'Favorites' && subCategory === 'Catalogs') {
      dispatch(getAllUserFavCatalogs({ userId: `${params?.userId}` }));
    }
    else if (showCategory === 'Offers' && subCategory === 'Offers placed') {
      dispatch(getAllPlacedOffers({}));
    }
    else if (showCategory === 'Offers' && subCategory === 'Offers received') {
      dispatch(getAllReceivedOffers({}));
    }
    else if (showCategory === 'Bids' && subCategory === 'Bids placed') {
      dispatch(getAllPlacedBids({}));
    }
    else if (showCategory === 'Bids' && subCategory === 'Bids received') {
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
    else if (showCategory === 'Favorites' && subCategory === 'Assets') {
      dispatch(getAllUserFavAssets({ userId: `${params?.userId}`, filters: {search: search} }));
    }
    else if (showCategory === 'Favorites' && subCategory === 'Catalogs') {
      dispatch(getAllUserFavCatalogs({ userId: `${params?.userId}`, filters: {search: search} }));
    }
  }, [search]);
};
