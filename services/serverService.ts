
import { SignIn, SignUp } from "@/models/auth.model";
import { Shops } from "@/models/shop.model";
import httpClient from "@/utils/httpClient";


type signProps = {
  name: string;
  email: string;
  password: string;
};
type signInProps = {
  email: string;
  password: string;
};



// export const signUp = async (user: signProps): Promise<SignUp> => {
//   const { data: response } = await httpClient.post<SignUp>(
//     `/authen/register`,
//     user
//   );
//   return response;
// };

  export const signUp = async (user: signProps): Promise<SignUp> => {
    const response = await httpClient.post<SignUp>("user/register", user)
    return response.data;
};

export const signIn = async (user: signInProps): Promise<SignIn> => { 
  const { data: response } = await httpClient.post<SignIn>(
    `/auth/signin`, //ตรงนี้จะต่างกับsingUpคือเราจะไม่วิ่งไปที่backendโดยตรง โดยจะวิ่งไปที่apiของnext.js
    user, //ข้อมูลuser แนบไป
    {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
      //เคสนี้เราจะเปลี่ยนไม่วิ่งไปที่ httpClient คือbaseURLที่จะวิ่งไปที่์next.js เป็นapiเฉพาะของnext.js
    }
  );
  return response;
};

export async function signOut() {
  const response = await httpClient.get(`/auth/signout`, { 
    
baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,  
});
return response.data; 
}
export async function getSession() {
  const response = await httpClient.get(`/auth/session`, {     //เป็นการยิงapiไปที่auth เราต้องไปสร้างที่api
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,        //เป็นการระบุว่าเราจะยิงไปที่local เพราะว่าเมื่อเราเปิดแอพขึ้นมาtoken ในreduxจะถูกทำลายแล้ว เราจึงต้องไปดึงที่next api มีcookiesเก็บไว้
  }); 
  return response.data;
}


export const getShops = async (keyword?: string): Promise<Shops[]> => {  //import typeมาจาก product.model.ts
  if (keyword) {   //ถ้ามี จะทำการแนบkeyword แล้วbackend จะreturnข้อมูลมา  โดยยิงตรงไปที่ backend
    return (await httpClient.get(`/shop/keyword/${keyword}`)).data;  
  } else {
    return (await httpClient.get(`/shop`)).data;  //ถ้าไม่มี keyword จะเป็นการqueryข้อมูลทั้งหมด
  }
};
