import { AppDataSource } from "../../data-source"
import { User } from "../../entities"
import { ICreateUserResponse, IOmitUserPassword } from "../../interfaces"
import { listUsersResponseSerializer } from "../../serializers/user.serializer"


const listUsersService = async (): Promise<ICreateUserResponse[]> => {
    const userRepository = AppDataSource.getRepository(User)
    const users = await userRepository.find()

    const usersSerialized = await listUsersResponseSerializer.validate(users, {stripUnknown:true})

    return usersSerialized!
}

export default listUsersService