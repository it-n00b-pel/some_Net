import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosError} from 'axios';

import {authAPI, LoginData} from '../../api/authAPI';

import {handleServerAppError, handleServerNetworkError} from '../../utils-error/error-utls';

import {AppDispatch} from '../store';

import {getCaptchaUrlAC, setInitialized, setPreloaderStatus} from './appReducer';
import {getProfileData} from './profileReducer';
import {getFriends} from './usersReducers';

const initialState = {
    myData: {
        id: 0,
        email: '',
        login: '',
    },
    isLogin: false,
};

export const me = createAsyncThunk('auth/me', async (arg, thunkAPI) => {
    thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
    try {
        const myData = await authAPI.me();
        if (myData.data.resultCode === 0) {
            await thunkAPI.dispatch(getFriends({count: 100, term: '', page: 1, friend: true}));
            await thunkAPI.dispatch(getProfileData(myData.data.data.id));
            thunkAPI.dispatch(setIsLogin({isLogin: true}));
            thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
            return myData;
        } else {
            thunkAPI.dispatch(setPreloaderStatus({status: 'failed'}));
        }
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    } finally {
        thunkAPI.dispatch(setInitialized({isInitialized: true}));
    }
});

export const login = createAsyncThunk('auth/login', async (loginData: LoginData, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const response = await authAPI.login(loginData);
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
            await thunkAPI.dispatch(me());
        } else if (response.data.resultCode === 10) {
            handleServerAppError(response.data, thunkAPI.dispatch as AppDispatch);
            thunkAPI.dispatch(getCaptchaUrlAC());
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch as AppDispatch);
        }
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

export const logOut = createAsyncThunk('auth/logOut', async (arg, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const logOut = await authAPI.logOut();
        if (logOut.data.resultCode === 0) {
            thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
            return logOut;
        } else {
            handleServerAppError(logOut.data, thunkAPI.dispatch as AppDispatch);
        }
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLogin(state, action: PayloadAction<{ isLogin: boolean }>) {
            state.isLogin = action.payload.isLogin;
        },
    },
    extraReducers(builder) {
        builder.addCase(me.fulfilled, (state, action) => {
            if (action.payload) {
                state.myData = action.payload.data.data;
            }
        });
        builder.addCase(logOut.fulfilled, (state, action) => {
            if (action.payload && action.payload.data.resultCode === 0) {
                state.myData.id = 0;
                state.myData.email = '';
                state.myData.login = '';
                state.isLogin = false;
            }
        });
    },
});

export const {setIsLogin} = slice.actions;

export const authReducer = slice.reducer;