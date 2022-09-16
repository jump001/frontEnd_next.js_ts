
import { UserData } from "./user.model";

export interface SignIn {
  
  token: string;
  error?: string;
  user: UserData;
}

export interface SignUp {
  error:string
  message: string; 
}

export interface GetSession {
  result: string;
  error?: string;
  user?: UserData;
}