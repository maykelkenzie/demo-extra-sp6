import { Router } from "express";
import { createSessionController } from "../controllers/session.controller";
import verifySerializerValidationMiddleware from "../middlewares/verifySerializerValidation.middleware";
import { sessionSerializerRequest } from "../serializers/session.serializer";


const sessionRouter = Router()

sessionRouter.post('', verifySerializerValidationMiddleware(sessionSerializerRequest), createSessionController)

export default sessionRouter