import {
    Request,
    Response,
    NextFunction
} from 'express';
import {ValidationError} from "yup"

export class AppError extends Error {
    statusCode: number
    constructor(message: string, statusCode:number = 400){
        super()
        this.statusCode= statusCode
        this.message = message
    }
}

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError){
        return res.status(err.statusCode).send({message: err.message})   
    }

    return res.status(500).send({message: err.message})
}