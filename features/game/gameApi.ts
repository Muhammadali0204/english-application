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
    createGame: builder.mutation<any, {users: string[]}>({
      query: (credentials) => ({
        url: '/create',
        method: 'POST',
        body: credentials
      })
    }),
    joinGame: builder.mutation({
      query: (gameId) => ({
        url: '/join',
        method: "POST",
        params: {game_id: gameId}
      })
    }),
    startGame: builder.mutation<any, void>({
      query: () => ({
        url: '/start',
        method: "POST",
      })
    })
  })
})


export const {
  useCreateGameMutation,
  useJoinGameMutation,
  useStartGameMutation
} = gameApi
