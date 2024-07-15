import {
  createApi,
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { ChatMessage, LoginUserResponse } from "../../../types/types";
import axiosBaseQuery from "../axiosClient/axiosClient";
import { v4 as uuid } from "uuid";
import { User } from "../../../types/enum";

const useMockResponse = true; // Toggle this to switch between real and mock data

export const chatFeature = createApi({
  reducerPath: "chatFeature",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAssistantResponse: builder.mutation<ChatMessage, { query: string }>({
      queryFn: async ({ query }, _api, _extraOptions, baseQuery) => {
        if (useMockResponse) {
          const promise = new Promise(resolve => setTimeout(resolve, 1000));          
          await promise;
          
          return {
            data: {
              id: uuid(),
              like: null,
              message: `Response for: ${query} at Time ${Date.now()}`,
              sentBy: User.AI,
              timestamp: Date.now().toString(),
            } as ChatMessage,
          };
        } else {
          const result = await baseQuery({
            url: "/api/auth/login",
            method: "POST",
            data: { query },
          });

          if ("error" in result) {
            return { error: result.error as FetchBaseQueryError };
          }

          return { data: result.data as ChatMessage };
        }
      },
    }),
  }),
});

export const { useGetAssistantResponseMutation } = chatFeature;
