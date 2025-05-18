import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DictionaryDataResponse, WordsResponse } from "types/dict";


const baseQuery = fetchBaseQuery({
  baseUrl: `https://${API_BASE_URL}/api/dict`,
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const dictApi = createApi({
  reducerPath: "dicApi",
  baseQuery,
  tagTypes: ["Dictionary"],
  endpoints: (builder) => ({
    getDictionaryData: builder.query<DictionaryDataResponse, void>({
      query: () => ({
        url: '/',
        method: "GET",
      }),
      keepUnusedDataFor: 600
    }),
    getWords: builder.query<WordsResponse, {book: number, unit: number}>({
      query: (credentials) => ({
        url: '/words',
        params: credentials
      }),
      keepUnusedDataFor: 600
    }),
    completeUnit: builder.mutation({
      query: (credentials) => ({
        url: '/complete-unit',
        method: 'POST',
        params: credentials
      }),
    })
  }),
})

export const { useGetDictionaryDataQuery, useGetWordsQuery, useCompleteUnitMutation } = dictApi;

