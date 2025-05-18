// features/auth/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
import { ChangePasswordCredentails, ChangePasswordResult, LoginCredentials, LoginResult, RegisterCredentials, RegisterResult } from 'types/auth';
import { User } from 'types/user';

const baseQuery = fetchBaseQuery({
  baseUrl: `https://${API_BASE_URL}/api/auth`,
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginCredentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      // invalidatesTags: ['User']
      }
    ),
    register: builder.mutation<RegisterResult, RegisterCredentials>(
      {
        query: (credentials) => ({
          url: '/register',
          method: 'POST',
          body: credentials,
        })
      }
    ),
    getMe: builder.query<User, void>({
      query: () => '/me',
      // providesTags: ['User']
    }),
    changePassword: builder.mutation<ChangePasswordResult, ChangePasswordCredentails>({
      query: (credentials) => ({
        url: '/change-password',
        method: 'POST',
        body: credentials
      }),
    })
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useLazyGetMeQuery} = authApi;
