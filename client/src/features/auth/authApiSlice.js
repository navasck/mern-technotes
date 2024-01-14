import { apiSlice } from '../../app/api/apiSlice';
import { logOut } from './authSlice';
// The provided code appears to be setting up an API slice using Redux Toolkit's createSlice and injectEndpoints functions. It's defining a set of asynchronous actions related to authentication, including login, logout, and token refresh.
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),

      // This is a lifecycle callback that runs when the network request starts. Here, it's an asynchronous function that dispatches actions based on the result of the request.

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          //const { data } =
          // await queryFulfilled: This is an asynchronous call to wait for the completion of the network request.
          await queryFulfilled;
          //console.log(data)
          dispatch(logOut());
          // dispatch(apiSlice.util.resetApiState()): This dispatches an action to reset the state of the associated API slice. This is commonly used to handle loading, error, and success states associated with asynchronous actions.
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
