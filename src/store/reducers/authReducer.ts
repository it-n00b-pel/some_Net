import {call, put, takeEvery} from '@redux-saga/core/effects';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosError, AxiosResponse} from 'axios';

import {authAPI, LoginData, MeData} from '../../api/authAPI';

import {handleServerAppError, handleServerNetworkError} from '../../utils-error/error-utils';

import {ResponseTypeSocNet} from '../../api/instance';

import {getCaptchaUrlAC, setInitialized, setPreloaderStatus} from './appReducer';
import {getProfileData} from './profileReducer';
import {getFriends, setFriends} from './usersReducers';

const initialState = {
    myData: {
        id: 0,
        email: '',
        login: '',
    },
    isLogin: false,
};

export const me = () => ({type: 'AUTH-ME'});

export function* meWorker(action: ReturnType<typeof me>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const myData: AxiosResponse<ResponseTypeSocNet<MeData>> = yield call(authAPI.me);
        if (myData.data.resultCode === 0) {
            yield put(setMyData(myData.data.data));
            yield  put(getProfileData(myData.data.data.id));
            yield put(getFriends({count: 100, term: '', page: 1, friend: true}));
            yield put(setPreloaderStatus({status: 'succeeded'}));
        } else {
            yield put(setPreloaderStatus({status: 'failed'}));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));

    } finally {
        yield put(setInitialized({isInitialized: true}));
    }
}

export const login = (loginData: LoginData) => ({type: 'AUTH-LOGIN', loginData});

export function* loginWorker(action: ReturnType<typeof login>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const response: AxiosResponse<ResponseTypeSocNet> = yield call(authAPI.login, action.loginData);
        if (response.data.resultCode === 0) {
            yield put(setPreloaderStatus({status: 'succeeded'}));
            yield put(me());
        } else if (response.data.resultCode === 1) {
            yield put(handleServerAppError(response.data));
        } else if (response.data.resultCode === 10) {
            yield put(handleServerAppError(response.data));
            yield put(getCaptchaUrlAC());
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export const logOut = () => ({type: 'AUTH-LOGOUT'});

export function* logOutWorker(action: ReturnType<typeof logOut>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const logOut: AxiosResponse<ResponseTypeSocNet> = yield call(authAPI.logOut);
        if (logOut.data.resultCode === 0) {
            yield put(setPreloaderStatus({status: 'succeeded'}));
            yield put(log_Out());
            yield put(setFriends({items: [], error: null, totalCount: 0}));
        } else {
            yield put(handleServerAppError(logOut.data));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export function* authWatcher() {
    yield takeEvery('AUTH-ME', meWorker);
    yield takeEvery('AUTH-LOGIN', loginWorker);
    yield takeEvery('AUTH-LOGOUT', logOutWorker);
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLogin(state, action: PayloadAction<{ isLogin: boolean }>) {
            state.isLogin = action.payload.isLogin;
        },
        setMyData(state, action: PayloadAction<MeData>) {
            state.myData = action.payload;
            state.isLogin = true;
        },
        log_Out(state) {
            state.myData.id = 0;
            state.myData.email = '';
            state.myData.login = '';
            state.isLogin = false;
        },
    },
});

export const {setIsLogin, setMyData, log_Out} = slice.actions;

export const authReducer = slice.reducer;