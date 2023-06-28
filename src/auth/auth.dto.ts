export interface ILogin {
  email: string;
  password: string;
}

export interface IUserDtoRequest extends ILogin {
  username: string;
}

export interface IUserDtoResponse extends IUserDtoRequest {
  id: string;
}

export interface IToken {
  access_token: string;
}
export interface IUserAfterJWT {
  id: string;
  email: string;
  username: string;
  iat: string;
}

export interface IReqUser extends Request {
  user: IUserAfterJWT;
}
