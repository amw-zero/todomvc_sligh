import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { StateContext, useAsyncReducer } from '../state';
import { actionMapping, reducer } from '../../lib/state-async';

export default function App({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useAsyncReducer(actionMapping, reducer, { isLoading: false, todos: [] });

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <Component {...pageProps} />
    </StateContext.Provider>
  );
}
