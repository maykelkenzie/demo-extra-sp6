import { sign } from "jsonwebtoken";
import { Repository } from "typeorm";
import { ICreateUserRequest, IRetrieveUserDataMock } from "../../../interfaces";
import { User } from "../../../entities";

const createUsersToRetrieveMock = async (
  payload: ICreateUserRequest,
  userRepo: Repository<User>
): Promise<IRetrieveUserDataMock> => {
  const user = await userRepo.save({ ...payload });
  const { password, ...entity } = user;

  const token = sign({ isAdmin: entity.isAdmin }, process.env.SECRET_KEY, {
    subject: entity.id.toString(),
  });

  return {
    entity: {
      ...entity,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    },
    token,
  };
};

export { createUsersToRetrieveMock };
