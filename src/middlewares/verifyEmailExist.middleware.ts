import { Request, NextFunction, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities";
import { AppError } from "../errors";


const verifyEmailExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({email:req.body.email})

    if(user){
        throw new AppError("Email already exists", 409)
    }

    return next()
}

export default verifyEmailExistMiddleware