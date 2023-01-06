import request from "supertest";
import { DataSource, Repository } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities";
import {
  mockedInvalidSignatureToken,
  createUsersToRetrieveMock,
} from "../../mocks";
import { TRetrieveUsersMock } from "../../../interfaces";

describe("Retrieve user route", () => {
  const baseUrl: string = "/users";
  let connection: DataSource;
  let userRepo: Repository<User>;
  let usersToRetrieveMock: Partial<TRetrieveUsersMock> = {};

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((dataSource) => {
        connection = dataSource;
        userRepo = connection.getRepository(User);
      })
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    usersToRetrieveMock.adminUser1 = await createUsersToRetrieveMock(
      {
        name: "admin user 1",
        email: "admin1@mail.com",
        password: "1234",
        isAdmin: true,
      },
      userRepo
    );

    usersToRetrieveMock.adminUser2 = await createUsersToRetrieveMock(
      {
        name: "admin user 2",
        email: "admin2@mail.com",
        password: "1234",
        isAdmin: true,
      },
      userRepo
    );
    usersToRetrieveMock.commonUser1 = await createUsersToRetrieveMock(
      {
        name: "common user 1",
        email: "common1@mail.com",
        password: "1234",
      },
      userRepo
    );
    usersToRetrieveMock.commonUser2 = await createUsersToRetrieveMock(
      {
        name: "common user 2",
        email: "common2@mail.com",
        password: "1234",
      },
      userRepo
    );
  });

  afterAll(async () => {
    await connection.destroy();
  });

  afterEach(async () => {
    const users = await userRepo.find();
    await userRepo.remove(users);
  });

  it("Admin user should be able to retrieve it self.", async () => {
    const { token, entity: adminUser } = usersToRetrieveMock.adminUser1!;

    const response = await request(app)
      .get(baseUrl + `/${adminUser.id}`)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 200,
      bodyToEqual: expect.objectContaining(adminUser),
      bodyNotEqual: expect.objectContaining({ password: expect.any(String) }),
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toEqual(expectedResponses.bodyToEqual);
    expect(response.body).not.toEqual(expectedResponses.bodyNotEqual);
  });

  it("Admin user should be able to retrieve other admin user.", async () => {
    const token = usersToRetrieveMock.adminUser1!.token;
    const adminUser = usersToRetrieveMock.adminUser2!.entity;

    const response = await request(app)
      .get(baseUrl + `/${adminUser.id}`)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 200,
      bodyToEqual: expect.objectContaining(adminUser),
      bodyNotEqual: expect.objectContaining({ password: expect.any(String) }),
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toEqual(expectedResponses.bodyToEqual);
    expect(response.body).not.toEqual(expectedResponses.bodyNotEqual);
  });

  it("Admin user should be able to retrieve common user.", async () => {
    const token = usersToRetrieveMock.adminUser1!.token;
    const commonUser = usersToRetrieveMock.commonUser1!.entity;

    const response = await request(app)
      .get(baseUrl + `/${commonUser.id}`)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 200,
      bodyToEqual: expect.objectContaining(commonUser),
      bodyNotEqual: expect.objectContaining({ password: expect.any(String) }),
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toEqual(expectedResponses.bodyToEqual);
    expect(response.body).not.toEqual(expectedResponses.bodyNotEqual);
  });

  it("Common user should be able to retrieve it self.", async () => {
    const { token, entity: commonUser } = usersToRetrieveMock.commonUser1!;

    const response = await request(app)
      .get(baseUrl + `/${commonUser.id}`)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 200,
      bodyToEqual: expect.objectContaining(commonUser),
      bodyNotEqual: expect.objectContaining({ password: expect.any(String) }),
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toEqual(expectedResponses.bodyToEqual);
    expect(response.body).not.toEqual(expectedResponses.bodyNotEqual);
  });

  it("Common user should not be able to retrieve other common user. Insufficient permission", async () => {
    const token = usersToRetrieveMock.commonUser1!.token;
    const commonUser = usersToRetrieveMock.commonUser2!.entity;

    const response = await request(app)
      .get(baseUrl + `/${commonUser.id}`)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 403,
      bodyToEqual: expect.objectContaining({
        message: "Insufficient permission",
      }),
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toEqual(expectedResponses.bodyToEqual);
  });

  it("Common user should not be able to retrieve other admin user. Insufficient permission", async () => {
    const token = usersToRetrieveMock.commonUser1!.token;
    const adminUser = usersToRetrieveMock.adminUser1!.entity;

    const response = await request(app)
      .get(baseUrl + `/${adminUser.id}`)
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 403,
      bodyToEqual: expect.objectContaining({
        message: "Insufficient permission",
      }),
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toEqual(expectedResponses.bodyToEqual);
  });

  it("Should not be able to retrieve user. Missing auth token.", async () => {
    const response = await request(app).get(baseUrl + "/1");

    const expectedResponses = {
      status: 401,
      bodyMessage: { message: "Missing authorization token" },
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toStrictEqual(expectedResponses.bodyMessage);
  });

  it("Should not be able to retrieve user. Invalid signature.", async () => {
    const { token } = mockedInvalidSignatureToken;

    const response = await request(app)
      .get(baseUrl + "/1")
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 401,
      bodyMessage: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toStrictEqual(expectedResponses.bodyMessage);
  });

  it("Should not be able to retrieve user. User not found.", async () => {
    const { token } = usersToRetrieveMock.adminUser1!;
    const response = await request(app)
      .get(baseUrl + "/123456")
      .set("Authorization", `Bearer ${token}`);

    const expectedResponses = {
      status: 404,
      bodyMessage: { message: "Entity not found" },
    };

    expect(response.status).toBe(expectedResponses.status);
    expect(response.body).toStrictEqual(expectedResponses.bodyMessage);
  });
});
