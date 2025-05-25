import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Friend, FriendshipMyRequest, FriendshipRequest } from 'types/friend';

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
  tagTypes: ['Friends', 'Requests', 'MyRequests'],
  endpoints: (builder) => ({
    getFriends: builder.query<Friend[], void>({
      query: () => '/all',
      providesTags: ['Friends'],
    }),
    getFriendshipRequests: builder.query<FriendshipRequest[], void>({
      query: () => '/requests',
      providesTags: ['Requests'],
    }),
    getMyFriendshipRequests: builder.query<FriendshipMyRequest[], void>({
      query: () => '/my-requests',
      providesTags: ['MyRequests'],
    }),
    sendFriendshipRequest: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/send-request`,
        method: 'POST',
        params: {user_id: userId}
      }),
      invalidatesTags: ['MyRequests'],
    }),
    cancelFriendshipRequest: builder.mutation<any, number>({
      query: (requestId) => ({
        url: `/cancel-request`,
        method: 'POST',
        params: {request_id: requestId}
      }),
      invalidatesTags: ['MyRequests'],
    }),
    acceptFriendshipRequest: builder.mutation<any, number>({
      query: (requestId) => ({
        url: `/accept-request`,
        method: 'POST',
        params: {request_id: requestId}
      }),
      invalidatesTags: ['Friends', 'Requests'],
    }),
    rejectFriendshipRequest: builder.mutation<any, number>({
      query: (requestId) => ({
        url: '/reject-request',
        method: 'POST',
        params: {request_id: requestId}
      }),
      invalidatesTags: ['Requests'],
    }),
    unfriend: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/unfriend`,
        method: 'POST',
        params: {user_id: userId}
      }),
      invalidatesTags: ['Friends'],
    }),
    searchFriends: builder.query<Friend[], { query: string, ts: number }>({
      query: ({query}) => ({
        url: `/search`,
        params: { query: encodeURIComponent(query) },
      }),
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useGetFriendshipRequestsQuery,
  useSendFriendshipRequestMutation,
  useCancelFriendshipRequestMutation,
  useAcceptFriendshipRequestMutation,
  useRejectFriendshipRequestMutation,
  useUnfriendMutation,
  useLazySearchFriendsQuery,
  useGetMyFriendshipRequestsQuery,
} = friendsApi;
