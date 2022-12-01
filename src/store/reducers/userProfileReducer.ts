import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {AxiosError} from 'axios';

import {Contacts, PhotoType, profileAPI} from '../../api/profileAPI';

import {handleServerNetworkError} from '../../utils-error/error-utls';
import {AppDispatch} from '../store';

import {setPreloaderStatus} from './appReducer';

const startState = {
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
};

export const getUserProfile = createAsyncThunk('user/getUserProfile', async (userId: number, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const userProfile = await profileAPI.getProfile(userId);
        thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
        return userProfile;
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

const slice = createSlice({
    name: 'userProfile',
    initialState: {
        profile: startState,
    },
    reducers: {
        cleanDataUser(state) {
            state.profile = startState;
        },
    },
    extraReducers(builder) {
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            if (action.payload) {
                state.profile = action.payload.data;
            }
        });
    },
});

export const {cleanDataUser} = slice.actions;

export const userProfileReducer = slice.reducer;

export type ActionTypeForUserProfileReducer = ReturnType<typeof cleanDataUser>

