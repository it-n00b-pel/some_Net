import {call, put, takeEvery} from '@redux-saga/core/effects';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosResponse} from 'axios';

import {Contacts, PhotoType, profileAPI, ProfileResponse} from '../../api/profileAPI';

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

// export const getUserProfile = createAsyncThunk('user/getUserProfile', async (userId: number, thunkAPI) => {
//     try {
//         thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
//         const userProfile = await profileAPI.getProfile(userId);
//         thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
//         return userProfile;
//     } catch (err) {
//         handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
//     }
// });

export const getUserProfileAC = (userId: number) => ({type: 'PROFILE-GET_PROFILE_DATA', userId});

export function* getUserProfileWorker(action: ReturnType<typeof getUserProfileAC>) {
    yield put(setPreloaderStatus({status: 'loading'}));
    const userProfile: AxiosResponse<ProfileResponse> = yield call(profileAPI.getProfile, action.userId);
    yield put(setUserProfileData({data: userProfile.data}));
    yield put(setPreloaderStatus({status: 'succeeded'}));
    yield userProfile;
}

export function* userProfileWatcher() {
    yield takeEvery('PROFILE-GET_PROFILE_DATA', getUserProfileWorker);
}

const slice = createSlice({
    name: 'userProfile',
    initialState: {
        profile: startState,
    },
    reducers: {
        cleanDataUser(state) {
            state.profile = startState;
        },
        setUserProfileData(state, action: PayloadAction<{ data: ProfileResponse }>) {
            state.profile = action.payload.data;
        }
    },
    // extraReducers(builder) {
    //     builder.addCase(getUserProfile.fulfilled, (state, action) => {
    //         if (action.payload) {
    //             state.profile = action.payload.data;
    //         }
    //     });
    // },
});

export const {cleanDataUser, setUserProfileData} = slice.actions;

export const userProfileReducer = slice.reducer;

export type ActionTypeForUserProfileReducer = ReturnType<typeof cleanDataUser> | ReturnType<typeof getUserProfileAC> | ReturnType<typeof setUserProfileData>

