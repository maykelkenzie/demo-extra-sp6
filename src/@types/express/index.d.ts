import { JwtPayload } from "jsonwebtoken";
import { ICreateUserResponse } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      validatedBody: object;
      decoded: JwtPayload;
    }
  }
}
