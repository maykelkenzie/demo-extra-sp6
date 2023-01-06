import * as yup from 'yup';
import { ICreateSessionRequest } from '../interfaces';

export const sessionSerializerRequest: yup.SchemaOf<ICreateSessionRequest> = yup.object().shape({
    email: yup.string().max(40).required(),
    password: yup.string().max(30).required()
})
