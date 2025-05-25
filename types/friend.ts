export type Friend = {
  id: number;
  username: string;
  name: string;
}

export type FriendshipRequest = {
  id: number;
  requester: Friend;
  status: FriendshipStatus
}

export type FriendshipMyRequest = {
  id: number;
  receiver: Friend;
  status: FriendshipStatus
}

export type FriendshipStatus = {
  pending: "pending"
  accepted: "accepted"
  blocked: "blocked"
}
