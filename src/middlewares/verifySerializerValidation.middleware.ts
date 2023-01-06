import { NextFunction, Request, Response } from "express";
import {SchemaLike} from "yup/lib/types"


const verifySerializerValidationMiddleware = (schema: SchemaLike) => async (req:Request, res:Response, next:NextFunction) => {
    const validation = await schema.validate(req.body,{stripUnknown:false, abortEarly:false})
    req.body = validation
    return next()
}

export default verifySerializerValidationMiddleware