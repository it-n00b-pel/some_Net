import {instance, ResponseTypeSocNet} from './instance';

export const authAPI = {
    me() {
        return instance.get <ResponseTypeSocNet<MeData>>
        ('auth/me');
    },
    login(loginData: LoginData) {
        return instance.post<ResponseTypeSocNet<{ userId: number }>>('auth/login', loginData);
    },
    logOut() {
        return instance.delete<ResponseTypeSocNet>('auth/login');
    },
    getCaptchaUrl() {
        return instance.get<{ url: string }>('security/get-captcha-url');
    },
};

type MeData = {
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