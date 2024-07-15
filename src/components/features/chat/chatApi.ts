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
import { formatDate, generateTextFromJSON } from "../../../utils/helper";
import { JSONContent } from "@tiptap/react";

const useMockResponse = true; // Toggle this to switch between real and mock data

export const chatFeature = createApi({
  reducerPath: "chatFeature",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAssistantResponse: builder.mutation<ChatMessage, { query: JSONContent }>(
      {
        queryFn: async ({ query }, _api, _extraOptions, baseQuery) => {
          if (useMockResponse) {
            const promise = new Promise((resolve) => setTimeout(resolve, 1000));
            await promise;
            
            const timestamp: number = Date.now();
            const response: JSONContent = {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: `SentiSum Response @ ${formatDate(timestamp)}`,
                    },
                  ],
                },
                ...(query.content || []),
              ],
            };   
            return {
              data: {
                id: uuid(),
                like: null,
                message:  generateTextFromJSON(response),
                messageJSON: response,
                sentBy: User.AI,
                timestamp,
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
      }
    ),
  }),
});

export const { useGetAssistantResponseMutation } = chatFeature;
