import { AppDataSource } from "../../data-source"
import { User } from "../../entities"
import { AppError } from "../../errors"
import { ICreateUserResponse } from "../../interfaces"
import { createUserResponseSerializer } from "../../serializers/user.serializer"


const retrieveUserService = async (id:number): Promise<ICreateUserResponse> => {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({id: id})

    if (!user){
        throw new AppError("Entity not found", 404)
    }

    const userSerialized = await createUserResponseSerializer.validate(user, {stripUnknown:true})
    return userSerialized
}

export default retrieveUserService