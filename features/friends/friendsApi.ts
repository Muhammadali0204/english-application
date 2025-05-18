import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Friend } from 'types/friend';

const baseQuery = fetchBaseQuery({
  baseUrl: `https://${API_BASE_URL}/api/friends`,
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const friendsApi = createApi({
  reducerPath: 'friendsApi',
  baseQuery,
  tagTypes: ['Friends', 'Requests'],
  endpoints: (builder) => ({
    getFriends: builder.query<Friend[], void>({
      query: () => '/all',
      providesTags: ['Friends'],
    }),
    getFriendRequests: builder.query<Request[], void>({
      query: () => '/requests',
      providesTags: ['Requests'],
    }),
    sendFriendRequest: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/send-request/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Requests'],
    }),
    cancelFriendRequest: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/cancel-request/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Requests'],
    }),
    acceptFriendRequest: builder.mutation<any, number>({
      query: (requestId) => ({
        url: `/accept-request/${requestId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Friends', 'Requests'],
    }),
    rejectFriendRequest: builder.mutation<any, number>({
      query: (requestId) => ({
        url: `/reject-request/${requestId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Requests'],
    }),
    unfriend: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/unfriend/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Friends'],
    }),
    blockUser: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/block/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Friends'],
    }),
    searchFriends: builder.query<Friend[], string>({
      query: (username) => ({
        url: `/search`,
        params: { username },
      }),
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useGetFriendRequestsQuery,
  useSendFriendRequestMutation,
  useCancelFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useUnfriendMutation,
  useBlockUserMutation,
  useSearchFriendsQuery,
} = friendsApi;
