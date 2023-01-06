import { NextFunction, Request, Response } from "express";
import createUserService from "../services/user/create.service";
import listUsersService from "../services/user/list.service";
import retrieveUserService from "../services/user/retrieve.service";


export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    const data = await createUserService(req.body)
    return res.status(201).send(data)
}

export const listUsersController = async (req: Request, res: Response, next: NextFunction) => {
    const data = await listUsersService()
    return res.status(200).send(data)
}

export const retrieveUserController =async (req: Request, res: Response, next: NextFunction) => {
    const data = await retrieveUserService(Number(req.params.id))
    return res.status(200).send(data)
}
