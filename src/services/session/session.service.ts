import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities";
import { AppError } from "../../errors";
import { ICreateSessionRequest, ICreateSessionResponse } from "../../interfaces";

const createSessionService = async (params:ICreateSessionRequest): Promise<ICreateSessionResponse> => {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({email:params.email})

    if (!user){
        throw new AppError("Invalid credentials", 401)
    }

    const passwordMatch = await compare(params.password, user.password)
    if (!passwordMatch){
        throw new AppError("Invalid credentials", 401)
    }

    const token = sign(
        {
            email: user.email,
            isAdmin: user.isAdmin
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "24h",
            subject: user.id.toString()
        }
    )

    return {token}
}

export default createSessionService