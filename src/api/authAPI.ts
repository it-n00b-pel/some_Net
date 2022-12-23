import {instance, ResponseTypeSocNet} from './instance';
import {AxiosResponse} from 'axios';

export const authAPI = {
    me(): Promise<AxiosResponse<ResponseTypeSocNet<MeData>>> {
        return instance.get <ResponseTypeSocNet<MeData>>
        ('auth/me');
    },
    login(loginData: LoginData): Promise<AxiosResponse<ResponseTypeSocNet>> {
        return instance.post<ResponseTypeSocNet<{ userId: number }>>('auth/login', loginData);
    },
    logOut(): Promise<AxiosResponse<ResponseTypeSocNet>> {
        return instance.delete<ResponseTypeSocNet>('auth/login');
    },
    getCaptchaUrl(): Promise<AxiosResponse<{ url: string }>> {
        return instance.get<{ url: string }>('security/get-captcha-url');
    },
};

export type MeData = {
    id: number,
    email: string,
    login: string
}

export type LoginData = {
    email: string,
    password: string,
    rememberMe?: boolean,
    captcha: string | null
}