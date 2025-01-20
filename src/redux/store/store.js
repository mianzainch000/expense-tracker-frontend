import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "@/redux/slice/expenseSlice";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  expense: expenseReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
