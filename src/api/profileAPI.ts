import {instance, ResponseTypeSocNet} from './instance';

export const profileAPI = {
    getProfile(userId: number) {
        return instance.get<ProfileResponse>('profile/' + userId);
    },
    getStatus(userId: number) {
        return instance.get('profile/status/' + userId);
    },
    updateStatus(status: string) {
        return instance.put<ResponseTypeSocNet>('profile/status/', {status});
    },
    updatePhoto(image: File) {
        const formData = new FormData();
        formData.append('image', image);
        return instance.put<ResponseTypeSocNet<{ photos: PhotoType }>>('profile/photo/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateProfileData(data: any) {
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