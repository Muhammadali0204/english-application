import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
  baseUrl: `https://${API_BASE_URL}/api/game`,
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery,
  endpoints: (builder) => ({
    createGame: builder.mutation({
      query: (credentials) => ({
        url: '/create',
        method: 'POST',
        body: credentials
      })
    })
  })
})


export const {
  useCreateGameMutation
} = gameApi
