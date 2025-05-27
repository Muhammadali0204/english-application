
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
  newPass: string,
}

export type ChangeNameCredentails = {
  newName: string,
}

export type ChangePasswordResult = {
  message: string,
}
