import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosError} from 'axios';

import {authAPI} from '../../api/authAPI';
import {handleServerNetworkError} from '../../utils-error/error-utls';


import {AppDispatch} from '../store';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    isInitialized: false,
    error: null as string | null,
    captcha: null as string | null,
};

export const getCaptchaDataUrl = createAsyncThunk('app/getCaptchaDataUrl', async (arg, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const captchaUrl = await authAPI.getCaptchaUrl();
        thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
        return captchaUrl;
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

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
    },
    extraReducers(builder) {
        builder.addCase(getCaptchaDataUrl.fulfilled, (state, action) => {
            if (action.payload) state.captcha = action.payload.data.url;
        });
    },
});

export const appReducer = slice.reducer;
export const {setInitialized, setError, setPreloaderStatus} = slice.actions;

export type ActionTypeForAppReducer =
    ReturnType<typeof setPreloaderStatus>
    | ReturnType<typeof setError>
    | ReturnType<typeof setInitialized>