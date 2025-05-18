import { User } from "./user";

export type LoginCredentials = {
  username: string;
  password: string;
}

export type LoginResult = {
  message: string,
  token: string,
}

export type RegisterCredentials = {
  username: string;
  password: string;
  name: string;
}

export type RegisterResult = {
  message: string,
  token: string,
}

export type ChangePasswordCredentails = {
  newPassword: string,
}

export type ChangePasswordResult = {
  message: string,
}
