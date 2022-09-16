
import { SignUp } from "@/models/auth.model";
import { UserData } from "@/models/user.model";
import httpClient from "@/utils/httpClient";


type signProps = {
  name: string;
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

