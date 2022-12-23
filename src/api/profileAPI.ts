import {AxiosResponse} from 'axios';

import {ProfilePayloadType} from '../store/reducers/profileReducer';

import {instance, ResponseTypeSocNet} from './instance';

export const profileAPI = {
    getProfile(userId: number): Promise<AxiosResponse<ProfileResponse>> {
        return instance.get<ProfileResponse>('profile/' + userId);
    },
    getStatus(userId: number): Promise<AxiosResponse> {
        return instance.get('profile/status/' + userId);
    },
    updateStatus(status: string): Promise<AxiosResponse<ResponseTypeSocNet>> {
        return instance.put<ResponseTypeSocNet>('profile/status/', {status});
    },
    updatePhoto(image: File): Promise<AxiosResponse<ResponseTypeSocNet<{ photos: PhotoType }>>> {
        const formData = new FormData();
        formData.append('image', image);
        return instance.put<ResponseTypeSocNet<{ photos: PhotoType }>>('profile/photo/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateProfileData(data: ProfilePayloadType): Promise<AxiosResponse<ResponseTypeSocNet>> {
        return instance.put<ResponseTypeSocNet>('profile', data);
    },
};

export type ProfileResponse = {
    lookingForAJob: boolean,
    aboutMe: string,
    lookingForAJobDescription: string,
    fullName: string,
    contacts: Contacts,
    photos: PhotoType,
}

export type Contacts = {
    github: string,
    vk: string,
    facebook: string,
    instagram: string,
    twitter: string,
    website: string,
    youtube: string,
    mainLink: string,
}

export type PhotoType = {
    small: string | null,
    large: string | null,
}