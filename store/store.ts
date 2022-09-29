import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer from "@/store/slice/userSlice";
import productReducer from "./slice/shopSlice";

const reducer = {
    user: userReducer,
    shop: productReducer,
  };

  export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV === "development",
  });

  // export type of root state from reducers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();