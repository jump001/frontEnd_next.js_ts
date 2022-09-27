import { ACCESS_TOKEN_KEY, HTTP_METHOD_GET, HTTP_METHOD_POST } from "@/utils/constant";
import { clearCookie, setCookie } from "@/utils/cookiesUtil";
import httpClient from "@/utils/httpClient";
import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import cookie from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const action = req.query["NextAuth"]?.[0];                                      
  if (req.method === HTTP_METHOD_POST && action === "signin") {
    return signin(req, res);
  } else if (req.method === HTTP_METHOD_GET && action === "signout") {
    return signout(req, res);
  } else if (req.method === HTTP_METHOD_GET && action === "session") {
    return getSession(req, res);
  } else {
    return res
      .status(405)
      .end(`Error: HTTP ${req.method} is not supported for ${req.url}`);
  }
}


export  async function signin(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const response = await httpClient.post(`user/login`, req.body).catch((error)=>{
      const er = error.message
      throw er
    })
                                    
    const { token } = response.data;   //.data เราคิดว่าtoken จะต้องส่งกลับมา
    setCookie(res, ACCESS_TOKEN_KEY, token, {   
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",  //เป็นการเปิดโหมด ถ้าเป็นproduction จะบังคับว่าต้องhttps:เท่านั้น
      sameSite: "strict",
      path: "/",
    });   
    res.json(response.data);
  } catch (error) {
    
    console.log(error)
    if(error == "Request failed with status code 404"){
      res.status(404).end("The user was not found in the system.");
    }
    else if(error == "Request failed with status code 401"){
      res.status(401).end("Incorrect password");
    }else
    ( res.status(401).end("check connection"))
  }
}



function signout(req: NextApiRequest, res: NextApiResponse<any>) {
  clearCookie(res, ACCESS_TOKEN_KEY); //ทำการเคลียร์token
  res.json({ result: "ok" }); //ตอบกลับไปว่า ok
}


async function getSession(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");  //ต้อง import cookie from "cookie";
    const accessToken = cookies[ACCESS_TOKEN_KEY]; //เช็คว่ามีkey ACCESS_TOKEN_KEY ที่cokiesไหม ถ้ามีก็ดึงออกมา
    if (accessToken) {                                  //ถ้ามีแสดงว่าเขาเคยlogin ก่อนหน้านี้นะ
      const response = await httpClient.get(`/authen/profile`, {    //ทำการยิงตัวนี้ไปที่backend
        headers: { Authorization: `Bearer ${accessToken}` }, // โดยต้องทำการแบtokenไปด้วย เพราะว่าอยู่ดีๆจะมีใครสักคนไปดึงใช้ต้องไม่ได้ เฉพาะคนที่loginเท่านั้น
      });
      res.json(response.data);
    } else {
      res.json({ result: "nok" });
    }
  } catch (error: any) {
    res.json({ result: "nok" });
}
}