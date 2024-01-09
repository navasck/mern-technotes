import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
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
      // The provided tags help in managing the cache and ensuring that data is refetched when needed.
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
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
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
