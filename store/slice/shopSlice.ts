import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";  //ส่วนredux

import * as serverService from "@/services/serverService";   //ส่วนเชื่อมต่อกับserveService.ts เราจะต้องทำการเขียนโค้ดตัวนี้เพื่อยิงไปยังbackend
import { Shops } from "@/models/shop.model";        //อันนี้คือตัวmodel ที่เราทำข้างบนเมื่อกี้
import { RootState, store } from "../store";
import { NextRouter } from "next/router";



interface ShopState {
  shops: Shops[];   
}

const initialState: ShopState = {  
  shops: [],   
};



//อันนี้จะเป็นการยิง รีเควสในการดึงข้อมูลสินค้าไปที่serverService
export const getShops = createAsyncThunk(
  "shops/get",
  async (keyword?: string) => {  //ทำการgetProductโดยการใส่filterตัวกรองโดยใช้keywordมาด้วย ? อธิบายแล้ว
    return await serverService.getShops(keyword);  //.getProductต้องไปสร้างที่serverServices.ts โค้ดในนี้คือการselect allดึงมาหมด
  }
);

const shopSlice = createSlice({
  name: "product",                        
  initialState: initialState,            
  reducers: {},                           
  extraReducers: (builder) => {

    builder.addCase(getShops.fulfilled, (state, action) => {  
      state.shops = action.payload;  
    });
  },
});

  // export common user selector
export const shopSelector = (store: RootState): Shops[] | undefined =>store.shop.shops;

export default shopSlice.reducer;