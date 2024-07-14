import {
  createApi,
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { LoginUserResponse } from "../../../types/types";
import axiosBaseQuery from "../axiosClient/axiosClient";

const useMockResponse = true; // Toggle this to switch between real and mock data

export const authFeature = createApi({
  reducerPath: "authFeature",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      LoginUserResponse,
      { email: string; password: string }
    >({
      queryFn: async ({ email, password }, _api, _extraOptions, baseQuery) => {
        if (
          useMockResponse &&
          email === process.env.REACT_APP_DUMMY_EMAIL &&
          password === process.env.REACT_APP_DUMMY_PASSWORD
        ) {
          return {
            data: {
              _id: "1",
              token: "mocked-jwt-token",
              email,
              message: "User has successfully logged in",
            } as LoginUserResponse,
          };
        } else {
          const result = await baseQuery({
            url: "/api/auth/login",
            method: "POST",
            data: { email, password },
          });

          if ("error" in result) {            
            return { error: result.error as FetchBaseQueryError };
          }

          return { data: result.data as LoginUserResponse };
        }
      },
    }),
  }),
});

export const { useLoginUserMutation } = authFeature;