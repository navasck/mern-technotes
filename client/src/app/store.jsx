import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    // This is the convention used by RTK Query to set up its reducer.
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, logger),
  devTools: true,
});

setupListeners(store.dispatch);

// setupListeners function from Redux Toolkit Query. This function is used for setting up listeners for automatic query lifecycle management.

// setupListeners(store.dispatch);: Sets up listeners for automatic query lifecycle management. This ensures that the necessary query lifecycle actions are dispatched automatically.

// getDefaultMiddleware is a function provided by Redux Toolkit that returns an array of default middleware.

// logger middleware for logging actions and state changes.