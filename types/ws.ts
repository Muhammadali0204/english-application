export type WebSocketMessage = {
  type: WSMessageTypes;
  data: any
}

export enum WSMessageTypes {
  RECEIVE_FRIENDSHIP_REQUEST = 'receive_friendship_request',
  USER_CANCEL_REQUEST = "user_cancel_request",
  ACCEPT_REQUEST = "accept_request",
  REJECT_REQUEST = "reject_request",
  REQUEST_JOIN_GAME = 'request_join_game',

  GAME_STARTED = 'game_started',
  NEXT_WORD = 'next_word',
  ALREADY_ANSWERED = 'already_answered',
  CORRECT_ANSWER = 'correct_answer',
  INCORRECT_ANSWER = 'incorrect_answer',
  JOIN_PLAYER = 'join_player',
  SEND_ANSWER = 'send_answer',
  END_GAME = 'end_game'
}
