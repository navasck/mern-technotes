import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      // The validateStatus function is a callback used to determine whether the response is valid.
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      // This is how long RTK Query will keep your data cached for after the last component unsubscribes. For example, if you query an endpoint, then unmount the component, then mount another component that makes the same request within the given time frame, the most recent value will be served from the cache.  defaultnis 60 second.
      keepUnusedDataFor: 5,
      // A function to manipulate the data returned by a query or mutation.
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        // usersAdapter.setAll to update the state with the loaded users. Note that using setAll will replace the existing state.
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      // A callback function that provides tags for invalidation. It returns an array of tags, including a general 'LIST' tag and individual tags for each user ID. This is useful for cache management and automatic refetching when data changes.
      // The providesTags callback provides tags for invalidation, helping with cache management and automatic refetching when data changes.

      // When you define a query using RTK Query, it automatically normalizes the data by storing entities in a normalized state structure. The 'result.ids' array contains the unique identifiers (IDs) of the entities retrieved by the query.
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'User', id })),
          ];
        } else return [{ type: 'User', id: 'LIST' }];
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/users',
        method: 'POST',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/users',
        method: 'PATCH',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// returns the query result object
// It allows you to select the result of the getUsers query from the Redux store.

// In RTK Query, each query endpoint has a set of selectors automatically generated. For the getUsers endpoint, some of the common selectors include:

// select: Selects the entire result object, including data, error, isFetching, and other properties.
// selectData: Selects only the data property from the result object.
// selectError: Selects only the error property from the result object.
// selectLoading: Selects the isFetching property, indicating whether the query is currently fetching data.

// you've used select(), which selects the entire result object. You can use this selector to access the result of the getUsers query in your components or other parts of your application.
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// The 'createSelector' function is a utility provided by @reduxjs/toolkit for creating memoized selectors.
// This selector is designed to memoize the extraction of user data from the result object obtained from the getUsers query endpoint.
// You can use 'selectUsersData' in your components with the useSelector hook to efficiently access the normalized user data:
const selectUsersData = createSelector(
  selectUsersResult,
  // The second argument to createSelector is a function that takes the output of the selectUsersResult selector (the result object) and extracts the data property.
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
// In the provided code, the getSelectors function from the createEntityAdapter utility in @reduxjs/toolkit is used to generate selectors for interacting with the normalized state managed by the usersAdapter. These selectors are commonly used to query and access entities in a normalized Redux store.
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);

// createEntityAdapter

// createEntityAdapter is a utility function provided by @reduxjs/toolkit that simplifies the management of normalized data in a Redux store. It's particularly useful when dealing with data structures where entities have unique IDs and relationships. The primary purpose of createEntityAdapter is to generate selectors and reducer functions that work with normalized data.

// Selectors: - The entity adapter generates selectors for common operations on entities:

// selectAllUsers: Selects all entities as an array.
// selectUserById: Selects a single entity by ID.
// selectUserIds: Selects an array of entity IDs.

// Reducer Functions:
// const usersReducer = usersAdapter.reducer;
// The entity adapter also generates reducer functions that handle common entity-related actions:

// addOne: Adds a single entity to the state.
// addMany: Adds multiple entities to the state.
// upsertOne: Adds a single entity or updates it if it already exists.
// upsertMany: Adds multiple entities or updates them if they already exist.
// updateOne: Updates a single entity in the state.
// updateMany: Updates multiple entities in the state.
// removeOne: Removes a single entity from the state.
// removeMany: Removes multiple entities from the state.
// setAll: Replaces all entities in the state.

// The primary advantage of using createEntityAdapter is that it abstracts away a lot of boilerplate code for managing normalized data in Redux. It helps in writing concise and maintainable reducers, and it integrates well with other features of @reduxjs/toolkit, such as the createSlice function and the Redux DevTools Extension.
