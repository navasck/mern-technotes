import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

// baseQuery sets default configuration for API calls:
// baseUrl: The base URL for API requests.
// credentials: 'include': Ensures cookies are sent for authentication.
// prepareHeaders: Attaches an authorization header with the access token if available.

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3500',
  credentials: 'include',
  // prepareHeaders?: ((headers: Headers, api: Pick<BaseQueryApi, "type" | "getState" | "extra" | "endpoint" | "forced">) => MaybePromise<void | Headers>) | undefined
  // { getState } - this is destructured from api
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// this 'api' is different, prepareHeaders 'api' is different.
// this 'api' is baseQuery's api
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  // it is making use of the baseQuery function to perform an API request. Let me break down the parameters used in this call:
  // args: This represents the arguments for the API request. It could include the URL, method, and any other necessary data for the request.

  // api: This is an object that includes various properties and methods related to the Redux store, dispatching actions, and accessing the current state. It is provided by the createApi middleware.

  // extraOptions: This is an optional parameter that allows you to include additional options for the API request, such as headers or custom configurations.

  // The function returns a Promise that resolves to the result of the API request.
  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  // If a 403 status code is encountered, it attempts to refresh the access token by making a request to '/auth/refresh'.
  if (result?.error?.status === 403) {
    console.log('sending refresh token');

    // send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    // If the refresh is successful, it updates the Redux state with the new credentials and retries the original query with the new access token.
    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it.
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = 'Your login has expired.';
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Note', 'User'],
  endpoints: (builder) => ({}),
});
// export const apiSlice = createApi({
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
//   tagTypes: ['Note', 'User'],
//   endpoints: (builder) => ({}),
// });

// The base query used by each endpoint if no queryFn option is specified. RTK Query exports a utility called fetchBaseQuery as a lightweight wrapper around fetch for common use-cases. See Customizing Queries if fetchBaseQuery does not handle your requirements.

// tagTypes: ['Note', 'User'],: Defines tag types for entities. This is useful for caching and managing data in the Redux store.

// createApi - Creates a service to use in your application. Contains only the basic redux logic (the core module). it creates an API slice for managing data fetching and state.
