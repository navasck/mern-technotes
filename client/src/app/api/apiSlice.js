import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ['Note', 'User'],
  endpoints: (builder) => ({}),
});

// The base query used by each endpoint if no queryFn option is specified. RTK Query exports a utility called fetchBaseQuery as a lightweight wrapper around fetch for common use-cases. See Customizing Queries if fetchBaseQuery does not handle your requirements.

// tagTypes: ['Note', 'User'],: Defines tag types for entities. This is useful for caching and managing data in the Redux store.

// createApi - Creates a service to use in your application. Contains only the basic redux logic (the core module).
