import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './auth/auth.slice';
import landingReducer from './landing/landing.slice';
import notificationsReducer from './notifications/notifications.slice';
import leaderboardReducer from './leaderboard/leaderboard.slice';
import settingsReducer from './settings/settings.slice';
import catalogsReducer from './catalogs/catalogs.slice';
import usersReducer from './users/users.slice';
import categoryReducer from './category/category.slice';
import currenciesReducer from './currencies/currencies.slice';
import assetsReducer from './assets/assets.slice';
import walletReducer from './wallet/wallet.slice';
import assetDetailReducer from './assetDetail/assetDetail.slice'
import globalSearchReducer from './globalSearchAndFilters/globalSearchAndFilters.slice';

const authPersistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet:walletReducer,
    landing: landingReducer,
    notifications: notificationsReducer,
    leaderboard: leaderboardReducer,
    settings: settingsReducer,
    catalogs: catalogsReducer,
    users: usersReducer,
    assets: assetsReducer,
    category: categoryReducer,
    currencies: currenciesReducer,
    globalSearch: globalSearchReducer,
    assetDetail:assetDetailReducer
  },
});

export const persistor = persistStore(store);

// @ts-ignore
export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;
