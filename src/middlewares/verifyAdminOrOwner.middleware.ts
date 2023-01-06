import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities";
import { AppError } from "../errors";




const verifyAdminOrOwnerMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const {isAdmin, sub} = req.decoded
    const {id} = req.params

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({id: Number(id)})

    if (!user){
        throw new AppError("Entity not found",404)
    }

    if (!isAdmin && Number(sub) !== user.id){
        throw new AppError("Insufficient permission",403)
    }

    return next()
}

export default verifyAdminOrOwnerMiddleware