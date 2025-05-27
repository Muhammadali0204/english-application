import { Friend } from "./friend";

export type ErrorType = {
  status: number;
  data: any;
}

export type UserStatus = {
  user: Friend,
  status: boolean
}

export type Game = {
  owner: string,
  words_len: number,
  round_duration: number,
}
