import { maxHeaderSize } from "http";
import * as yup from "yup";
import { ICreateUserRequest, ICreateUserResponse } from "../interfaces";

const createUserRequestSerializer : yup.SchemaOf<ICreateUserRequest> = yup.object().shape({
  name: yup.string().max(60).required(),
  email: yup.string().max(40).required(),
  isAdmin: yup.boolean().notRequired(),
  password: yup.string().max(30).required()
})

const createUserResponseSerializer: yup.SchemaOf<ICreateUserResponse> = 
  createUserRequestSerializer
  .concat(
    yup.object().shape({
      id: yup.number().required(),
      isAdmin: yup.boolean().required(),
      createdAt: yup.date().required(),
      updatedAt: yup.date().required(),
    })
  ).omit(["password"])


const listUsersResponseSerializer: yup.SchemaOf<ICreateUserResponse[]> = yup.array().of(createUserResponseSerializer)

export {
  createUserRequestSerializer,
  createUserResponseSerializer,
  listUsersResponseSerializer,
};
