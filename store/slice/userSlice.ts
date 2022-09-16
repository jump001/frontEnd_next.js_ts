import { UserData } from "@/models/user.model";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import * as serverService from "@/services/serverService";









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
    isAuthenticating: true,
    user: undefined,
    error:""
  };

  interface SignAction {
    name: string;
    email:string;
    password: string;
  }


export const signUp = createAsyncThunk(
  "user/register",    //จะเอาคำนี้ไปแสดงผลที่ redux dev tool
  async (credential: SignAction) => {
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
    },
  });

// export common user selector
  export const userSelector = (store: RootState) => store.user;
  // // export reducer
export default userSlice.reducer;