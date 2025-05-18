// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import { dictApi } from 'features/dict/dictionaryApi';
import { friendsApi } from 'features/friends/friendsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dictApi.reducerPath]: dictApi.reducer,
    [friendsApi.reducerPath]: friendsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
  .concat(dictApi.middleware).concat(friendsApi.middleware),
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
