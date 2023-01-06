import {
  ICreateUserMissingKeysRequestMock,
  ICreateUserRequest,
  IOmitUserPassword,
} from "../../../interfaces";

const mockedCommonUserRequest: ICreateUserRequest = {
  name: "common user",
  email: "common@mail.com",
  password: "1234",
};

const mockedCommonUserResponse: IOmitUserPassword = {
  name: "common user",
  email: "common@mail.com",
};

const mockedAdminUserRequest: ICreateUserRequest = {
  name: "admin user",
  email: "admin@mail.com",
  isAdmin: true,
  password: "1234",
};

const mockedAdminUserResponse: IOmitUserPassword = {
  name: "admin user",
  email: "admin@mail.com",
  isAdmin: true,
};

const mockedMissingKeysUserRequest: ICreateUserMissingKeysRequestMock = {
  isAdmin: true,
  password: "1234",
};

export {
  mockedCommonUserRequest,
  mockedCommonUserResponse,
  mockedAdminUserRequest,
  mockedAdminUserResponse,
  mockedMissingKeysUserRequest,
};
