import request from "supertest";
import { DataSource, Repository } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities";
import {
  mockedAdminUserRequest,
  mockedAdminUserToken,
  mockedCommonUserRequest,
  mockedInsufficientPermissionToken,
  mockedInvalidSignatureToken,
  mockedListUsers,
  mockedUserTokenNotFound,
} from "../../mocks";

describe("List users route", () => {
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

    for await (const user of mockedListUsers) {
      await userRepo.save({ ...user });
    }
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list users.", async () => {
    const userAdmin = await userRepo.save(mockedAdminUserRequest);
    const token = mockedAdminUserToken.token(userAdmin.id.toString());

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 200,
      bodyLength: mockedListUsers.length + 1,
      bodyNotToContain: expect.arrayContaining([
        expect.objectContaining({ password: expect.any(String) }),
      ]),
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).not.toContain(expectedResponses.bodyNotToContain);
    expect(response.body.length).toBe(expectedResponses.bodyLength);
  });

  it("Should not be able to list users. Missing auth token.", async () => {
    const response = await request(app).get(baseUrl);

    const expectedResponses = {
      status: 401,
      bodyMessage: { message: "Missing authorization token" },
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toStrictEqual(expectedResponses.bodyMessage);
  });

  it("Should not be able to list users. Invalid signature.", async () => {
    const { token } = mockedInvalidSignatureToken;
    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 401,
      bodyMessage: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toStrictEqual(expectedResponses.bodyMessage);
  });

  it("Should not be able to list users. User token not found.", async () => {
    const { token } = mockedUserTokenNotFound;
    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`);
    const expectedResponses = {
      status: 401,
      bodyMessage: { message: "Missing permission" },
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toStrictEqual(expectedResponses.bodyMessage);
  });

  it("Should not be able to list users. Insufficient permission.", async () => {
    const commonUser = await userRepo.save(mockedCommonUserRequest);
    const token = mockedInsufficientPermissionToken.token(
      commonUser.id.toString()
    );
    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 403,
      bodyMessage: { message: "Insufficient permission" },
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toStrictEqual(expectedResponses.bodyMessage);
  });
});
