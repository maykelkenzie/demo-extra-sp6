import request from "supertest";
import { getRounds } from "bcryptjs";
import { DataSource, Repository } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities";
import {
  mockedAdminUserRequest,
  mockedAdminUserResponse,
  mockedCommonUserRequest,
  mockedCommonUserResponse,
  mockedMissingKeysUserRequest,
} from "../../mocks";

describe("Create user route", () => {
  const baseUrl: string = "/users";
  let connection: DataSource;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((dataSource) => {
        connection = dataSource;
        userRepo = connection.getRepository(User);
      })
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    const users = await userRepo.find();
    await userRepo.remove(users);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create a common user.", async () => {
    const response = await request(app)
      .post(baseUrl)
      .send(mockedCommonUserRequest);

    const commonUserResponse = {
      status: 201,
      notContain: "password",
      toEqual1: expect.objectContaining(mockedCommonUserResponse),
      toEqual2: expect.objectContaining({
        id: expect.any(Number),
        isAdmin: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    };
    expect(response.status).toBe(commonUserResponse.status);
    expect(response.body).not.toHaveProperty(commonUserResponse.notContain);
    expect(response.body).toEqual(commonUserResponse.toEqual1);
    expect(response.body).toEqual(commonUserResponse.toEqual2);

    const createdUser = await userRepo.findOneBy({ id: response.body.id });
    expect(createdUser).toBeTruthy();
    expect(getRounds(createdUser!.password)).toBeTruthy();
  });

  it("Should be able to create a admin user.", async () => {
    const response = await request(app)
      .post(baseUrl)
      .send(mockedAdminUserRequest);

    const adminUserResponse = {
      status: 201,
      notContain: "password",
      toEqual1: expect.objectContaining(mockedAdminUserResponse),
      toEqual2: expect.objectContaining({
        id: expect.any(Number),
        isAdmin: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    };

    expect(response.status).toBe(adminUserResponse.status);
    expect(response.body).not.toHaveProperty(adminUserResponse.notContain);
    expect(response.body).toEqual(adminUserResponse.toEqual1);
    expect(response.body).toEqual(adminUserResponse.toEqual1);

    const createdUser = await userRepo.findOneBy({ id: response.body.id });
    expect(createdUser).toBeTruthy();
    expect(getRounds(createdUser!.password)).toBeTruthy();
  });

  it("Should not be able to create user | missing required keys.", async () => {
    const response = await request(app)
      .post(baseUrl)
      .send(mockedMissingKeysUserRequest);

    const missingKeysUserResponse = {
      status: 400,
      message: {
        message: ["name is a required field", "email is a required field"],
      },
    };

    expect(response.status).toBe(missingKeysUserResponse.status);
    expect(response.body).toStrictEqual(missingKeysUserResponse.message);

    const [users, amount] = await userRepo.findAndCount();
    expect(amount).toStrictEqual(0);
    expect(users).toStrictEqual([]);
  });

  it("Should not be able to create user | email should be unique.", async () => {
    await userRepo.save({ ...mockedAdminUserRequest });

    const response = await request(app)
      .post(baseUrl)
      .send(mockedAdminUserRequest);

    const uniqueEmailResponse = {
      status: 409,
      message: {
        message: "Email already exists",
      },
      toStrictEqual: expect.arrayContaining([
        expect.objectContaining(mockedAdminUserRequest),
      ]),
    };

    expect(response.status).toBe(uniqueEmailResponse.status);
    expect(response.body).toStrictEqual(uniqueEmailResponse.message);

    const [users, amount] = await userRepo.findAndCount();
    expect(amount).toStrictEqual(1);
    expect(users).toStrictEqual(uniqueEmailResponse.toStrictEqual);
  });
});
