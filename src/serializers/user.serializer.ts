import * as yup from "yup";
import { ICreateUserRequest, ICreateUserResponse } from "../interfaces";

const createUserRequestSerializer /*: yup.SchemaOf<ICreateUserRequest>*/ = yup

const createUserResponseSerializer/*: yup.SchemaOf<ICreateUserResponse>*/ = yup


const listUsersResponseSerializer/*: yup.SchemaOf<ICreateUserResponse[]>*/ = yup

export {
  createUserRequestSerializer,
  createUserResponseSerializer,
  listUsersResponseSerializer,
};
