export type WebSocketMessage = {
  type: WSMessageTypes;
  data: any
}

export enum WSMessageTypes {
  RECEIVE_FRIENDSHIP_REQUEST = 'receive_friendship_request',
  USER_CANCEL_REQUEST = "user_cancel_request",
  ACCEPT_REQUEST = "accept_request",
  REJECT_REQUEST = "reject_request"
}
