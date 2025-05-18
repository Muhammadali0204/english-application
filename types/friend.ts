export type Friend = {
  id: number;
  username: string;
  name: string;
}

export type Request = {
  id: number;
  requester: Friend;
  status: FriendshipStatus
}

export type FriendshipStatus = {
  pending: "pending"
  accepted: "accepted"
  blocked: "blocked"
}
