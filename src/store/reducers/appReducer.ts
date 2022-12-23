import {call, put, takeEvery} from '@redux-saga/core/effects';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosResponse, AxiosError} from 'axios';

import {authAPI} from '../../api/authAPI';

import {handleServerNetworkError} from '../../utils-error/error-utils';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    isInitialized: false,
    error: null as string | null,
    captcha: null as string | null,
};

export const getCaptchaUrlAC = () => ({type: 'APP-GET_CAPTCHA_URL'});

export function* getCaptchaUrlWorker(action: ReturnType<typeof getCaptchaUrlAC>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const captchaUrl: AxiosResponse<{ url: string }> = yield call(authAPI.getCaptchaUrl);
        yield put(setCaptchaUrl(captchaUrl.data));
        yield put(setPreloaderStatus({status: 'succeeded'}));
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export function* getCaptchaWatcher() {
    yield takeEvery('APP-GET_CAPTCHA_URL', getCaptchaUrlWorker);
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setPreloaderStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },
        setInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized;
        },
        setError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },
        setCaptchaUrl(state, action: PayloadAction<{ url: string }>) {
            debugger
            state.captcha = action.payload.url;
        },
    },
});

export const appReducer = slice.reducer;
export const {setInitialized, setError, setPreloaderStatus, setCaptchaUrl} = slice.actions;

export type ActionTypeForAppReducer =
    ReturnType<typeof setPreloaderStatus>
    | ReturnType<typeof setError>
    | ReturnType<typeof setInitialized>
    | ReturnType<typeof setCaptchaUrl>
    | ReturnType<typeof getCaptchaUrlAC>