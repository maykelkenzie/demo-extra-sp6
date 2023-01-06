import { sign } from "jsonwebtoken";
import {
  ICreateUserRequest,
  IListUserTokenMock,
  IListUserDynamicTokenMock,
} from "../../../interfaces";

const mockedAdminUserToken: IListUserDynamicTokenMock = {
  token: (subject: string) =>
    sign({ isAdmin: true }, process.env.SECRET_KEY, { subject }),
};

const mockedInvalidSignatureToken: IListUserTokenMock = {
  token: sign({ isAdmin: false }, "12345", { subject: "2" }),
};

const mockedUserTokenNotFound: IListUserTokenMock = {
  token: sign({ isAdmin: false }, process.env.SECRET_KEY, {
    subject: "3454545",
  }),
};

const mockedInsufficientPermissionToken: IListUserDynamicTokenMock = {
  token: (subject: string) =>
    sign({ isAdmin: false }, process.env.SECRET_KEY, { subject }),
};

const mockedListUsers: ICreateUserRequest[] = Array.from(Array(10)).map(
  (_, i) => {
    return { name: `user${i}`, email: `user${i}@mail.com`, password: "1234" };
  }
);

export {
  mockedAdminUserToken,
  mockedInvalidSignatureToken,
  mockedUserTokenNotFound,
  mockedInsufficientPermissionToken,
  mockedListUsers,
};
