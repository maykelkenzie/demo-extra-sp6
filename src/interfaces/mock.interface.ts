import { ICreateSessionRequest } from "./session.interface";
import { ICreateUserRequest, ICreateUserResponse } from "./user.interface";

interface ICreateUserMissingKeysRequestMock
  extends Omit<ICreateUserRequest, "name" | "email"> {}

interface ICreateSessionPayloadMock {
  userPayload: ICreateUserRequest;
  sessionPayload: ICreateSessionRequest;
}

interface IListUserTokenMock {
  token: string;
}

interface IListUserDynamicTokenMock {
  token: (subject: string) => string;
}

type TRetrieveUsersKeysMock =
  | "adminUser1"
  | "adminUser2"
  | "commonUser1"
  | "commonUser2";

interface IRetrieveUserDataMock {
  entity: ICreateUserResponse;
  token: string;
}

type TRetrieveUsersMock = {
  [key in TRetrieveUsersKeysMock]: IRetrieveUserDataMock;
};

export {
  ICreateUserMissingKeysRequestMock,
  ICreateSessionPayloadMock,
  IListUserTokenMock,
  IListUserDynamicTokenMock,
  IRetrieveUserDataMock,
  TRetrieveUsersMock,
};
