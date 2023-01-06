import { Router } from "express";
import { createUserController, listUsersController, retrieveUserController } from "../controllers/user.controller";
import verifyAdminMiddleware from "../middlewares/verifyAdmin.middleware";
import verifyAdminOrOwnerMiddleware from "../middlewares/verifyAdminOrOwner.middleware";
import verifyAuthMiddleware from "../middlewares/verifyAuth.middleware";
import verifyEmailExistMiddleware from "../middlewares/verifyEmailExist.middleware";
import verifySerializerValidationMiddleware from "../middlewares/verifySerializerValidation.middleware";
import { createUserRequestSerializer } from "../serializers/user.serializer";


const userRouter = Router()

userRouter.post('', verifySerializerValidationMiddleware(createUserRequestSerializer), verifyEmailExistMiddleware, createUserController)
userRouter.get('', verifyAuthMiddleware, verifyAdminMiddleware, listUsersController)
userRouter.get('/:id', verifyAuthMiddleware, verifyAdminOrOwnerMiddleware, retrieveUserController)

export default userRouter