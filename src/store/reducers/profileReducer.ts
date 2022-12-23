import {call, put, takeEvery} from '@redux-saga/core/effects';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosError, AxiosResponse} from 'axios';

import {Contacts, PhotoType, profileAPI, ProfileResponse} from '../../api/profileAPI';

import {ResponseTypeSocNet} from '../../api/instance';

import {handleServerAppError, handleServerNetworkError} from '../../utils-error/error-utils';

import {setPreloaderStatus} from './appReducer';

export const getProfileData = (userId: number) => ({type: 'PROFILE-GET_PROFILE_DATA', userId});

function* getProfileWorker(action: ReturnType<typeof getProfileData>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const profileData: AxiosResponse<ProfileResponse> = yield call(profileAPI.getProfile, action.userId);
        const status: AxiosResponse = yield call(profileAPI.getStatus, action.userId);
        yield put(setStatus(status.data));
        yield put(setProfileData(profileData));
        yield put(setPreloaderStatus({status: 'succeeded'}));
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export const updateStatus = (status: string) => ({type: 'PROFILE-UPDATE_STATUS', status});

export function* updateStatusWorker(action: ReturnType<typeof updateStatus>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const newStatus: AxiosResponse<ResponseTypeSocNet> = yield call(profileAPI.updateStatus, action.status);
        if (newStatus.data.resultCode === 0) {
            yield put(setStatus(action.status));
            yield put(setPreloaderStatus({status: 'succeeded'}));
        } else {
            yield put(handleServerAppError(newStatus.data));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export const updateProfilePhoto = (photo: File) => ({type: 'PROFILE-UPDATE_PROFILE_PHOTO', photo});

export function* updateProfilePhotoWorker(action: ReturnType<typeof updateProfilePhoto>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const profilePhoto: AxiosResponse<ResponseTypeSocNet<{ photos: PhotoType }>> = yield call(profileAPI.updatePhoto, action.photo);
        if (profilePhoto.data.resultCode === 0) {
            yield put(updatePhoto(profilePhoto.data.data));
            yield put(setPreloaderStatus({status: 'succeeded'}));
        } else {
            yield put(handleServerAppError(profilePhoto.data));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export const updateProfileData = (profileData: ProfilePayloadType) => ({type: 'PROFILE-UPDATE-PROFILE-DATA', profileData});

export function* updateProfileDataWorker(action: ReturnType<typeof updateProfileData>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const response: AxiosResponse<ResponseTypeSocNet> = yield call(profileAPI.updateProfileData, action.profileData);
        if (response.data.resultCode === 0) {
            yield put(saveDataFromForm({data: action.profileData}));
            yield put(setPreloaderStatus({status: 'succeeded'}));
        } else {
            yield put(handleServerAppError(response.data));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export function* getProfileWatcher() {
    yield takeEvery('PROFILE-GET_PROFILE_DATA', getProfileWorker);
    yield takeEvery('PROFILE-UPDATE_STATUS', updateStatusWorker);
    yield takeEvery('PROFILE-UPDATE_PROFILE_PHOTO', updateProfilePhotoWorker);
    yield takeEvery('PROFILE-UPDATE-PROFILE-DATA', updateProfileDataWorker);
}

const slice = createSlice({
    name: 'profile',
    initialState: {
        profile: {
            lookingForAJob: false,
            aboutMe: '',
            lookingForAJobDescription: '',
            fullName: '',
            contacts: {
                github: '',
                vk: '',
                facebook: '',
                instagram: '',
                twitter: '',
                website: '',
                youtube: '',
                mainLink: '',
            } as Contacts,
            photos: {
                small: '',
                large: '',
            } as PhotoType,
        },
        status: '',
    },
    reducers: {
        saveDataFromForm(state, action: PayloadAction<{ data: ProfilePayloadType }>) {
            return {...state, profile: {...action.payload.data, photos: state.profile.photos}};
        },
        setProfileData(state, action: PayloadAction<{ data: ProfileResponse }>) {
            return {...state, profile: action.payload.data};
        },
        setStatus(state, action: PayloadAction<string>) {
            state.status = action.payload;
        },
        updatePhoto(state, action: PayloadAction<{ photos: PhotoType }>) {
            state.profile.photos = action.payload.photos;
        },
    },
});

export const {saveDataFromForm, setProfileData, setStatus, updatePhoto} = slice.actions;

export type ProfilePayloadType = {
    aboutMe: string,
    fullName: string,
    lookingForAJob: boolean,
    lookingForAJobDescription: string,
    contacts: Contacts
}

export const profileReducer = slice.reducer;
