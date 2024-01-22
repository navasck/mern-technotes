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
          // await queryFulfilled;
          const { data } = await queryFulfilled;
          console.log('data from logout queryFulfilled', data); // {message: 'Cookie cleared'}
          // this message setting from api backend

          dispatch(logOut());
          // dispatch(apiSlice.util.resetApiState()): This dispatches an action to reset the state of the associated API slice. This is commonly used to handle loading, error, and success states associated with asynchronous actions.
          // as we added inside setTimeout, it gives plenty of time to go head and confirm that its unmounted that list component whether it is users or list component
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
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
