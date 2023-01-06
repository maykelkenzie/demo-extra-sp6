import { NextFunction, Request, Response } from "express";
import createSessionService from "../services/session/session.service";



export const createSessionController = async (req: Request, res: Response, next: NextFunction) => {
    const data = await createSessionService(req.body)
    return res.status(200).send(data)
}