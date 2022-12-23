import {AxiosResponse} from 'axios';

import {instance, ResponseTypeSocNet} from './instance';

export const usersApi = {
    getUsers(args: UsersQueryParametersType): Promise<AxiosResponse<UsersResponse>> {
        return instance.get<UsersResponse>('users/', {params: args});
    },
    follow(userId: number): Promise<AxiosResponse<ResponseTypeSocNet>> {
        return instance.post<ResponseTypeSocNet>('follow/' + userId);
    },
    unFollow(userId: number): Promise<AxiosResponse<ResponseTypeSocNet>> {
        return instance.delete<ResponseTypeSocNet>('follow/' + userId);
    },
};

export type UsersQueryParametersType = {
    count: number,
    page: number,
    term: string,
    friend: boolean
}

export type UsersResponse = {
    items: UserType[],
    error: string | null,
    totalCount: number
}

export type UserType = {
    name: string,
    id: number,
    uniqueUrlName: string | null,
    photos: {
        small: string | null,
        large: string | null,
    },
    status: string | null,
    followed: boolean
}