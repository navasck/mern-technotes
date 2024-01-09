import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, logger),
  devTools: true,
});

setupListeners(store.dispatch);

// setupListeners function from Redux Toolkit Query. This function is used for setting up listeners for automatic query lifecycle management.

// setupListeners(store.dispatch);: Sets up listeners for automatic query lifecycle management. This ensures that the necessary query lifecycle actions are dispatched automatically.
