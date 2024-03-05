import React from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { persistor, store } from '../Lib/store';
import { PersistGate } from 'redux-persist/integration/react';
import useEffectOnce from '@/Hooks/useEffectOnce';

interface CustomPageProps {
  Component: React.FC;
  pageProps: any;
}

function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
      <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
export default MyApp;
