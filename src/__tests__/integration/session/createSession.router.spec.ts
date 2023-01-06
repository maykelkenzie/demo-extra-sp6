import request from "supertest";
import { decode } from "jsonwebtoken";
import { DataSource, Repository } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities";
import {
  mockedAdminUserSession,
  mockedCommonUserSession,
  mockedInvalidBodySession,
  mockedInvalidEmailSession,
  mockedInvalidPasswordSession,
} from "../../mocks";

describe("Create session route", () => {
  const baseUrl: string = "/login";
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

  it("Should be able to login as admin user.", async () => {
    const { userPayload, sessionPayload } = mockedAdminUserSession;
    const user = userRepo.create({ ...userPayload });
    await userRepo.save(user);

    const response = await request(app).post(baseUrl).send(sessionPayload);

    const adminUserResponse = {
      status: 200,
      bodyHaveProperty: "token",
      bodyStrictEqual: expect.objectContaining({ token: expect.any(String) }),
      bodyDecodedTokenContaining: expect.objectContaining({
        isAdmin: user.isAdmin,
        sub: user.id.toString(),
      }),
    };

    expect(response.status).toBe(adminUserResponse.status);
    expect(response.body).toHaveProperty(adminUserResponse.bodyHaveProperty);
    expect(response.body).toStrictEqual(adminUserResponse.bodyStrictEqual);
    expect(decode(response.body.token)).toStrictEqual(
      adminUserResponse.bodyDecodedTokenContaining
    );
  });

  it("Should be able to login as common user.", async () => {
    const { userPayload, sessionPayload } = mockedCommonUserSession;
    const user = userRepo.create({ ...userPayload });
    await userRepo.save(user);

    const response = await request(app).post(baseUrl).send(sessionPayload);

    const commonUserResponse = {
      status: 200,
      bodyHaveProperty: "token",
      bodyStrictEqual: expect.objectContaining({ token: expect.any(String) }),
      bodyDecodedTokenContaining: expect.objectContaining({
        isAdmin: user.isAdmin,
        sub: user.id.toString(),
      }),
    };

    expect(response.status).toBe(commonUserResponse.status);
    expect(response.body).toHaveProperty(commonUserResponse.bodyHaveProperty);
    expect(response.body).toStrictEqual(commonUserResponse.bodyStrictEqual);
    expect(decode(response.body.token)).toStrictEqual(
      commonUserResponse.bodyDecodedTokenContaining
    );
  });

  it("Should not be able to login | invalid body.", async () => {
    const response = await request(app)
      .post(baseUrl)
      .send(mockedInvalidBodySession);

    const commonUserResponse = {
      status: 400,
      bodyHaveProperty: "message",
      bodyStrictEqual: expect.objectContaining({
        message: expect.arrayContaining([
          "email is a required field",
          "password is a required field",
        ]),
      }),
    };

    expect(response.status).toBe(commonUserResponse.status);
    expect(response.body).toHaveProperty(commonUserResponse.bodyHaveProperty);
    expect(response.body).toStrictEqual(commonUserResponse.bodyStrictEqual);
  });

  it("Should not be able to login | invalid email.", async () => {
    const { userPayload, sessionPayload } = mockedInvalidEmailSession;
    const user = userRepo.create({ ...userPayload });
    await userRepo.save(user);

    const response = await request(app).post(baseUrl).send(sessionPayload);

    const commonUserResponse = {
      status: 401,
      bodyHaveProperty: "message",
      bodyStrictEqual: expect.objectContaining({
        message: "Invalid credentials",
      }),
    };

    expect(response.status).toBe(commonUserResponse.status);
    expect(response.body).toHaveProperty(commonUserResponse.bodyHaveProperty);
    expect(response.body).toStrictEqual(commonUserResponse.bodyStrictEqual);
  });

  it("Should not be able to login | invalid password.", async () => {
    const { userPayload, sessionPayload } = mockedInvalidPasswordSession;
    const user = userRepo.create({ ...userPayload });
    await userRepo.save(user);

    const response = await request(app).post(baseUrl).send(sessionPayload);

    const commonUserResponse = {
      status: 401,
      bodyHaveProperty: "message",
      bodyStrictEqual: expect.objectContaining({
        message: "Invalid credentials",
      }),
    };

    expect(response.status).toBe(commonUserResponse.status);
    expect(response.body).toHaveProperty(commonUserResponse.bodyHaveProperty);
    expect(response.body).toStrictEqual(commonUserResponse.bodyStrictEqual);
  });
});
