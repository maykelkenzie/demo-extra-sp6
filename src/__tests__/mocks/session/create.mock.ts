import { ICreateSessionPayloadMock } from "../../../interfaces";
import {
  mockedAdminUserRequest,
  mockedCommonUserRequest,
} from "../user/create.mock";

const mockedAdminUserSession: ICreateSessionPayloadMock = {
  userPayload: mockedAdminUserRequest,
  sessionPayload: {
    email: mockedAdminUserRequest.email,
    password: mockedAdminUserRequest.password,
  },
};

const mockedCommonUserSession: ICreateSessionPayloadMock = {
  userPayload: mockedCommonUserRequest,
  sessionPayload: {
    email: mockedCommonUserRequest.email,
    password: mockedCommonUserRequest.password,
  },
};

const mockedInvalidBodySession: object = {};

const mockedInvalidEmailSession: ICreateSessionPayloadMock = {
  userPayload: mockedCommonUserRequest,
  sessionPayload: {
    email: "mail@mail.com",
    password: mockedCommonUserRequest.password,
  },
};

const mockedInvalidPasswordSession: ICreateSessionPayloadMock = {
  userPayload: mockedCommonUserRequest,
  sessionPayload: {
    email: mockedCommonUserRequest.email,
    password: "invalidPassword",
  },
};

export {
  mockedAdminUserSession,
  mockedCommonUserSession,
  mockedInvalidBodySession,
  mockedInvalidEmailSession,
  mockedInvalidPasswordSession,
};
