import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosError} from 'axios';

import {Contacts, PhotoType, profileAPI} from '../../api/profileAPI';

import {AppDispatch} from '../store';
import {handleServerAppError, handleServerNetworkError} from '../../utils-error/error-utls';

import {setPreloaderStatus} from './appReducer';

export const getProfileData = createAsyncThunk('profile/getProfileData', async (userId: number, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const profileData = await profileAPI.getProfile(userId);
        const status = await profileAPI.getStatus(userId);
        thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
        return {profileData, status};
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

export const updateStatus = createAsyncThunk('profile/updateStatus', async (status: string, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const newStatus = await profileAPI.updateStatus(status);
        if (newStatus.data.resultCode === 0) {
            thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
            return newStatus;
        } else {
            handleServerAppError(newStatus.data, thunkAPI.dispatch as AppDispatch);
        }
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

export const updateProfilePhoto = createAsyncThunk('profile/updateProfilePhoto', async (photo: File, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const profilePhoto = await profileAPI.updatePhoto(photo);
        if (profilePhoto.data.resultCode === 0) {
            thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
            return profilePhoto;
        } else {
            handleServerAppError(profilePhoto.data, thunkAPI.dispatch as AppDispatch);
        }
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

export const updateProfileData = createAsyncThunk('profile/updateProfileData', async (profileData: ProfilePayloadType, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const response = await profileAPI.updateProfileData(profileData);
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(saveDataFromForm({data: profileData}));
            thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch as AppDispatch);
        }
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

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
    },
    extraReducers(builder) {
        builder.addCase(getProfileData.fulfilled, (state, action) => {
            if (action.payload) {
                return {...state, status: action.payload.status.data, profile: action.payload.profileData.data};
            }
        });
        builder.addCase(updateStatus.fulfilled, (state, action) => {
            if (action.payload && action.payload.status) {
                return {...state, status: action.meta.arg};
            }
        });
        builder.addCase(updateProfilePhoto.fulfilled, (state, action) => {
            if (action.payload) {
                return {...state, profile: {...state.profile, photos: action.payload.data.data.photos}};
            }
        });

    },
});

export const {saveDataFromForm} = slice.actions;

export type ProfilePayloadType = {
    aboutMe: string,
    fullName: string,
    lookingForAJob: boolean,
    lookingForAJobDescription: string,
    contacts: Contacts
}

export const profileReducer = slice.reducer;
