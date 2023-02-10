///////////////////////////////////////////////////////////////////////////////
export interface IGameQuery {
  skip: string;
  take: string;
  order: string;
}

export function GameQueryBuilder(query: IGameQuery) {
  let query_str: string = "?";

  if (query?.order) query_str += "order=" + query?.order + "&";
  if (query?.skip) query_str += "skip=" + query?.skip + "&";
  if (query?.take) query_str += "take=" + query?.take + "&";

  return query_str;
}
///////////////////////////////////////////////////////////////////////////////
export interface ISearchQuery {
  key: string;
  skip?: string;
  take?: string;
}

export function SearchQueryBuilder(query: ISearchQuery) {
  let query_str: string = "?";

  if (query?.key) query_str += "key=" + query?.key + "&";
  if (query?.skip) query_str += "skip=" + query?.skip + "&";
  if (query?.take) query_str += "take=" + query?.take + "&";

  return query_str;
}
///////////////////////////////////////////////////////////////////////////////

export enum eSubscriptionState {
  BANNED,
  MUTED,
  OK,
}

export enum eRole {
  OWNER,
  ADMIN,
  USER,
}

export enum eChannelType {
  PUBLIC,
  PRIVATE,
  ONE_TO_ONE,
}

/*
** User
*/
export class User implements IUser {
  username                      : string;
  email                         : string;
  createdAt                     : string;
  updatedAt                     : string;
  TwoFA                         : boolean;
  password                      : string;
  salt                          : string;
  identification_token          : string;
  refresh_token                 : string;
  channelSubscriptions          : Subscription[];
  messages                      : Message[];
  gameHistoryPOne               : Game[];
  gameHistoryPTwo               : Game[];
  followedBy                    : Follows[];
  following                     : Follows[];
  blockedBy                     : Blocks[];
  blocking                      : Blocks[];
  avatars                       : Avatar;
  victoriesAsPOne               : number;
  victoriesAsPTwo               : number;
  defeatsAsPOne                 : number;
  defeatsAsPTwo                 : number;

  constructor(
    username                      : string,
    email                         : string,
    createdAt                     : string,
    updatedAt                     : string,
    TwoFA                         : boolean,
    password                      : string,
    salt                          : string,
    identification_token          : string,
    refresh_token                 : string,
    channelSubscriptions          : Subscription[],
    messages                      : Message[],
    gameHistoryPOne               : Game[],
    gameHistoryPTwo               : Game[],
    followedBy                    : Follows[],
    following                     : Follows[],
    blockedBy                     : Blocks[],
    blocking                      : Blocks[],
    avatars                       : Avatar,
    victoriesAsPOne               : number,
    victoriesAsPTwo               : number,
    defeatsAsPOne                 : number,
    defeatsAsPTwo                 : number,
  ) {
    this.username                       = username;
    this.email                          = email;
    this.createdAt                      = createdAt;
    this.updatedAt                      = updatedAt;
    this.TwoFA                          = TwoFA;
    this.password                       = password;
    this.salt                           = salt;
    this.identification_token           = identification_token;
    this.refresh_token                  = refresh_token;
    this.channelSubscriptions           = channelSubscriptions;
    this.messages                       = messages;
    this.gameHistoryPOne                = gameHistoryPOne;
    this.gameHistoryPTwo                = gameHistoryPTwo;
    this.followedBy                     = followedBy;
    this.following                      = following;
    this.blockedBy                      = blockedBy;
    this.blocking                       = blocking;
    this.avatars                        = avatars;
    this.victoriesAsPOne                = victoriesAsPOne;
    this.victoriesAsPTwo                = victoriesAsPTwo;
    this.defeatsAsPOne                  = defeatsAsPOne;
    this.defeatsAsPTwo                  = defeatsAsPTwo;
  }
}
interface IUser {
  username                      : string;
  email                         : string;
  createdAt                     : string;
  updatedAt                     : string;
  TwoFA                         : boolean;
  password                      : string;
  salt                          : string;
  identification_token          : string;
  refresh_token                 : string;
  channelSubscriptions          : Subscription[];
  messages                      : Message[];
  gameHistoryPOne               : Game[];
  gameHistoryPTwo               : Game[];
  followedBy                    : Follows[];
  following                     : Follows[];
  blockedBy                     : Blocks[];
  blocking                      : Blocks[];
  avatars                       : Avatar;
  victoriesAsPOne               : number;
  victoriesAsPTwo               : number;
  defeatsAsPOne                 : number;
  defeatsAsPTwo                 : number;
}

/*
** Follows
*/
export class Follows implements IFollows {
  follower                      : User;
  followerId                    : string;
  following                     : User;
  followingId                   : string;
  id                            : string;

  constructor(
    follower                      : User,
    followerId                    : string,
    following                     : User,
    followingId                   : string,
    id                            : string,
  ) {
    this.follower                       = follower;
    this.followerId                     = followerId;
    this.following                      = following;
    this.followingId                    = followingId;
    this.id                             = id;
  }
}
interface IFollows {
  follower                      : User;
  followerId                    : string;
  following                     : User;
  followingId                   : string;
  id                            : string;
}

/*
** Blocks
*/
export class Blocks implements IBlocks {
  blocker                       : User;
  blockerId                     : string;
  blocking                      : User;
  blockingId                    : string;
  id                            : string;

  constructor(
    blocker                       : User,
    blockerId                     : string,
    blocking                      : User,
    blockingId                    : string,
    id                            : string,
  ) {
    this.blocker                        = blocker;
    this.blockerId                      = blockerId;
    this.blocking                       = blocking;
    this.blockingId                     = blockingId;
    this.id                             = id;
  }
}
interface IBlocks {
  blocker                       : User;
  blockerId                     : string;
  blocking                      : User;
  blockingId                    : string;
  id                            : string;
}

/*
** Message
*/
export class Message implements IMessage {
  id                            : string;
  CreatedAt                     : string;
  ReceivedAt                    : string;
  content                       : string;
  user                          : User;
  username                      : string;
  channel                       : Channel;
  channelId                     : string;

  constructor(
    id                            : string,
    CreatedAt                     : string,
    ReceivedAt                    : string,
    content                       : string,
    user                          : User,
    username                      : string,
    channel                       : Channel,
    channelId                     : string,
  ) {
    this.id                             = id;
    this.CreatedAt                      = CreatedAt;
    this.ReceivedAt                     = ReceivedAt;
    this.content                        = content;
    this.user                           = user;
    this.username                       = username;
    this.channel                        = channel;
    this.channelId                      = channelId;
  }
}
interface IMessage {
  id                            : string;
  CreatedAt                     : string;
  ReceivedAt                    : string;
  content                       : string;
  user                          : User;
  username                      : string;
  channel                       : Channel;
  channelId                     : string;
}

/*
** Channel
*/
export class Channel implements IChannel {
  id                            : string;
  name                          : string;
  createdAt                     : string;
  updated                       : string;
  ispublic                      : boolean;
  SubscribedUsers               : Subscription[];
  Message                       : Message[];
  hash                          : string;
  salt                          : string;

  constructor(
    id                            : string,
    name                          : string,
    createdAt                     : string,
    updated                       : string,
    ispublic                      : boolean,
    SubscribedUsers               : Subscription[],
    Message                       : Message[],
    hash                          : string,
    salt                          : string,
  ) {
    this.id                             = id;
    this.name                           = name;
    this.createdAt                      = createdAt;
    this.updated                        = updated;
    this.ispublic                       = ispublic;
    this.SubscribedUsers                = SubscribedUsers;
    this.Message                        = Message;
    this.hash                           = hash;
    this.salt                           = salt;
  }
}
interface IChannel {
  id                            : string;
  name                          : string;
  createdAt                     : string;
  updated                       : string;
  ispublic                      : boolean;
  SubscribedUsers               : Subscription[];
  Message                       : Message[];
  hash                          : string;
  salt                          : string;
}

/*
** Subscription
*/
export class Subscription implements ISubscription {
  id                : string
  role              : eRole
  channel           : Channel
  user              : User
  username          : string
  channelId         : string
  state             : eSubscriptionState
  stateActiveUntil  : string

  constructor(
    id                    : string,
    role                  : eRole,
    channel               : Channel,
    user                  : User,
    username              : string,
    channelId             : string,
    state                 : eSubscriptionState,
    stateActiveUntil      : string,
  ) {
    this.id                  = id;
    this.role                = role;
    this.channel             = channel;
    this.user                = user;
    this.username            = username;
    this.channelId           = channelId;
    this.state               = state;
    this.stateActiveUntil    = stateActiveUntil;
  }
}
interface ISubscription {
  id                : string;
  channel           : Channel;
  user              : User;
  channelId         : string;
  username          : string;
  role              : eRole;
  state             : eSubscriptionState;
  stateActiveUntil  : string
}

/*
** Game
*/
export class Game implements IGame {
  id                            : string;
  finishedAt                    : string;
  startedAt                     : string;
  score_playerOne               : number;
  score_playerTwo               : number;
  playerOne                     : User;
  playerOneName                 : string;
  playerTwo                     : User;
  playerTwoName                 : string;

  constructor(
    id                            : string,
    finishedAt                    : string,
    startedAt                     : string,
    score_playerOne               : number,
    score_playerTwo               : number,
    playerOne                     : User,
    playerOneName                 : string,
    playerTwo                     : User,
    playerTwoName                 : string,
  ) {
    this.id                             = id;
    this.finishedAt                     = finishedAt;
    this.startedAt                      = startedAt;
    this.score_playerOne                = score_playerOne;
    this.score_playerTwo                = score_playerTwo;
    this.playerOne                      = playerOne;
    this.playerOneName                  = playerOneName;
    this.playerTwo                      = playerTwo;
    this.playerTwoName                  = playerTwoName;
  }
}
interface IGame {
  id                            : string;
  finishedAt                    : string;
  startedAt                     : string;
  score_playerOne               : number;
  score_playerTwo               : number;
  playerOne                     : User;
  playerOneName                 : string;
  playerTwo                     : User;
  playerTwoName                 : string;
}

/*
** Avatar
*/
export class Avatar implements IAvatar {
  id                            : string;
  updatedAt                     : string;
  createdAt                     : string;
  user                          : User;
  username                      : string;
  linkOriginal                  : string;
  linkThumbnail                 : string;
  linkMedium                    : string;
  linkLarge                     : string;

  constructor(
    id                            : string,
    updatedAt                     : string,
    createdAt                     : string,
    user                          : User,
    username                      : string,
    linkOriginal                  : string,
    linkThumbnail                 : string,
    linkMedium                    : string,
    linkLarge                     : string,
  ) {
    this.id                             = id;
    this.updatedAt                      = updatedAt;
    this.createdAt                      = createdAt;
    this.user                           = user;
    this.username                       = username;
    this.linkOriginal                   = linkOriginal;
    this.linkThumbnail                  = linkThumbnail;
    this.linkMedium                     = linkMedium;
    this.linkLarge                      = linkLarge;
  }
}
interface IAvatar {
  id                            : string;
  updatedAt                     : string;
  createdAt                     : string;
  user                          : User;
  username                      : string;
  linkOriginal                  : string;
  linkThumbnail                 : string;
  linkMedium                    : string;
  linkLarge                     : string;
}
