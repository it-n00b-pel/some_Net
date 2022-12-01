import axios from 'axios';

export const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    headers: {
        'API-KEY': process.env.REACT_APP_API_KEY,
    },
});

export type ResponseTypeSocNet<T = {}> = {
    resultCode: number,
    messages: Array<string>,
    fieldsErrors: Array<string>,
    data: T,
}