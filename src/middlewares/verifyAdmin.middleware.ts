import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities";
import { AppError } from "../errors";




const verifyAdminMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({id:Number(req.decoded.sub)})
    
    if (!user){
        throw new AppError('Missing permission',401)
    }
    if (!req.decoded.isAdmin){
        throw new AppError('Insufficient permission',403)
    }
    return next()
}

export default verifyAdminMiddleware