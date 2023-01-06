import "express-async-errors";
import express from "express";
import { handleError } from "./errors";
import sessionRouter from "./routes/session.routes";
import userRouter from "./routes/user.routes";


const app = express();
app.use(express.json());
app.use('/login', sessionRouter)
app.use('/users', userRouter)
app.use(handleError)

export default app;
