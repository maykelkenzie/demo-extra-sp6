import { AppDataSource } from "../../data-source"
import { User } from "../../entities"
import { ICreateUserRequest, ICreateUserResponse } from "../../interfaces"
import { createUserResponseSerializer } from "../../serializers/user.serializer"

const createUserService = async (data: ICreateUserRequest): Promise<ICreateUserResponse> => {
    const userRepository = AppDataSource.getRepository(User)
    const newUser = userRepository.create(data)
    await userRepository.save(newUser)

    const userSerialized = await createUserResponseSerializer.validate(newUser,{stripUnknown:true})
    return userSerialized
}

export default createUserService