import { Request, NextFunction, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { AppError } from "../errors";


const verifyAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if(!token){
        throw new AppError("Missing authorization token", 401)
    }
    const splitToken = token.split(' ')[1]

    const verifyToken =  verify(splitToken, process.env.SECRET_KEY, (err, decoded) =>{
        if(err){
            throw new AppError(err.message, 401)
        }
        req.decoded = decoded as JwtPayload
    })
    return next()
}

export default verifyAuthMiddleware