import { UserData } from "@/models/user.model";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState, store } from "@/store/store";
import * as serverService from "@/services/serverService";
import httpClient from "@/utils/httpClient";
import { AxiosRequestConfig } from "axios";
import  Router  from "next/router";









interface UserState {
    username: string;
    accessToken: string;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    user?: UserData;
    error?:string
  }

  const initialState: UserState = {
    username: "",
    accessToken: "",
    isAuthenticated: false,
    isAuthenticating: false,
    user: undefined,
    error:""
  };

  interface SignUpAction {
    name: string;
    email:string;
    password: string;
  }
  interface SignInAction {
    email: string;
    password: string;
  }


export const signUp = createAsyncThunk(
  "user/register",    //จะเอาคำนี้ไปแสดงผลที่ redux dev tool
  async (credential: SignUpAction) => {
      const response = await serverService.signUp(credential)
      .catch((error) => {
        const err1 = JSON.stringify(error.response.data.error)
         const err2 = JSON.parse(err1)
         
        // console.log(err2.message)
        // console.log(err2.validation[0].msg)
        // console.log(err2.validation[1].msg)
        throw new Error((err2.message))
       // throw new Error(JSON.stringify(error.response.data.error.message))
      })  
      return response
  })
 
  export const signIn = createAsyncThunk(
    "user/login",
    async (credential: SignInAction) => {
      //ในกรณีของsignInจะยิงไปที่serverServicesแต่serverServicesจะไม่ได้ยิงไปที่backendโดยตรงเหมือนsignUP
      //ถ้าเราทำการlogin สำเร็จเราจะได้ค่าtokenกลับมาโดยtokenจะอยู่ในresponse
        const response = await serverService.signIn(credential).catch((error)=>{

          console.log(error.message)
          if(error.message == "Request failed with status code 404"){
            throw new Error("ไม่พบผู้ใช้งานในระบบ");
          }
          else if(error.message == "Request failed with status code 401"){
            throw new Error("รหัสผ่านไม่ถูกต้อง");
          }else
            throw new Error("ตรวจสอบการเชื่อมต่อ")
        })
       
         
      // set access token
      httpClient.interceptors.request.use((config?: AxiosRequestConfig) => {
        if (config && config.headers) {
          //คือการเอาค่าtokenที่อยู่ในreponseไปเก็บไว้ที่้httpClientข้างบน
       config.headers["Authorization"] = `Bearer ${response.token}`; 
 // เพื่อที่การเชื่อมต่อครั้งถัดไป เช่นการดึงข้อมูลสต็อกสินค้าจะได้แนบtokenไปกับตัวhedersที่ชื่อว่า["Authorization"]
 //ส่งผลให้รีเควสที่แนบไปเข้าถึงได้เช่นการinsertสินค้า
        }
  
        return config;
      });
      return response;
    }
  );

  export const signOut = createAsyncThunk("user/signout", async () => {
    await serverService.signOut();  
    Router.push("/login");                
  });
  

  export const getSession = createAsyncThunk("user/fetchSession", async () => { 
    const response = await serverService.getSession();  
         // set access token
    if (response) {
      httpClient.interceptors.request.use((config?: AxiosRequestConfig) => {
        if (config && config.headers && response.user) {
          config.headers["Authorization"] = `Bearer ${response.user?.token}`; //เป็นการเอาตัวtoken ยัดไปที่headerของaxiosหรือ httpClient
        }
        return config;
      });
    }
    return response; //ส่งผลลัพธ์กลับไป
  });    


  const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
      builder.addCase(signUp.fulfilled, (state, action) => {
        state.accessToken = "";
        state.user = undefined;
        state.isAuthenticated = false;
      });
      builder.addCase(signUp.rejected, (state, action) => {
          state.error = action.error.message
        
      });
      builder.addCase(signIn.fulfilled, (state, action) => {  
        state.accessToken = action.payload.token;   
        state.isAuthenticated = true;   
        state.isAuthenticating = false;  
        state.user = action.payload.user; 

      });
      builder.addCase(signIn.rejected, (state, action) => {
        state.accessToken = "";   
        state.isAuthenticated = false; 
        state.isAuthenticating = false; 
        state.user = undefined;    
        state.error = action.error.message
      });  
      builder.addCase(signOut.fulfilled, (state, action) => {
        state.accessToken = "";
        state.isAuthenticated = false;
        state.isAuthenticating = false;
        state.user = undefined;
      });
      builder.addCase(getSession.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        if (action.payload && action.payload.user && action.payload.user.token) { //เช็คต่อว่าpayloadมีไหม เช็คต่อว่าpayload userมีไหม เช็คต่อว่าpayload user.tokenมีไหม
          state.accessToken = action.payload.user.token; //ถ้าทุกอย่างมีจะrestoreกลับมาที่redux เพื่อใช้งานต่อไปได้
          state.user = action.payload.user;  //คือicon profile คือถ้าเราอยากผูกข้อมูลกับ prrofile
          state.isAuthenticated = true;   // ถ้าดึงtokenได้แปลว่าได้ทำการauthenแล้ว
        }
      });
  
    },
  });

 
// export common user selector
  export const userSelector = (store: RootState) => store.user;
  export const erorMessage = (store:RootState)  => store.user;

  export const isAuthenticatedSelector = (store: RootState): boolean => 
  store.user.isAuthenticated;     //เมื่อเราloginสำเร็จเราจะsetค่าให้เป็นtrue
export const isAuthenticatingSelector = (store: RootState): boolean =>
  store.user.isAuthenticating;

  // // export reducer
export default userSlice.reducer;