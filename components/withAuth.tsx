import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  isAuthenticatedSelector,
  isAuthenticatingSelector,
} from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { isClient } from "@/utils/commonUtil";

// eslint-disable-next-line react/display-name
const withAuth = (WrappedComponent: React.FC) => (props: any) => {
  // this hoc only supports client side rendering.
  if (isClient()) {
    const router = useRouter();
    const { route } = router;
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const isAuthenticating = useSelector(isAuthenticatingSelector);

    // is fetching session (eg. show spinner)
    if (isAuthenticating) {
      return null;
    }

    // // If user is not logged in, return signin component
    if (route !== "/login" && route !== "/register") {    //เมื่อloginมาแล้ว  เช็คว่า ถ้าไม่ใช่route !== "/login" หน้าlogin และ  route !== "/register หน้าregister แล้วไปเช็คบบรรทัดล่างต่อว่า
      if (!isAuthenticated) { //  เช็คว่า authen หรือยัง ถ้ายัง
        router.push(`/login`);//ให้ไปที่login
        return null;//แล้วให้ออกจากหน้านี้ไป
      } else if (route !== `/stock`) {//ถ้าauthenแล้ว จะให้ไปที่หน้า/ได้เลย ตรงนี้ไม่ต้องฟิกหน้าไว้ไม่งั้นจะเกิดลูป
        router.push(`/stock`);// default page after login when call root path    หน้าแรกเมื่อlogin
        return null;
      }
    }else{
      if(isAuthenticated){   //ถ้าเขาต้องการเข้าหน้าlogin  เช็คว่าloginหรือยัง
        router.push(`/stock`); //ถ้าlogin แล้วบังคับมาหน้าstock
        return null;
      }
    }

    // If user is logged in, return original component
    return <WrappedComponent {...props} />;
  }

  return null;
};

export default withAuth;