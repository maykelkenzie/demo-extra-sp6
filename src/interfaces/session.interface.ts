interface ICreateSessionRequest {
  email: string;
  password: string;
}

interface ICreateSessionResponse {
  token: string;
}

export { ICreateSessionRequest, ICreateSessionResponse };
