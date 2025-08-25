import storage from "redux-persist/lib/storage";


import { persistReducer, persistStore } from "redux-persist";
import confirmModalReducer from "./slices/confirmModalSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// Combine reducers
const rootReducer = combineReducers({

  confirmModal: confirmModalReducer,
});

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid redux-persist warnings
    }),
});

// Create persistor
export const persistor = persistStore(store);
