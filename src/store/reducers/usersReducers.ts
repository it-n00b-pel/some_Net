import {call, put, takeEvery} from '@redux-saga/core/effects';

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosError} from 'axios';

import {usersApi, UsersQueryParametersType, UsersResponse} from '../../api/usersApi';

import {handleServerAppError, handleServerNetworkError} from '../../utils-error/error-utls';
import {AppDispatch} from '../store';
import {ResponseTypeSocNet} from '../../api/instance';
import {setPreloaderStatus} from './appReducer';
import {AxiosResponse} from 'axios';

export const getUsers = createAsyncThunk('users/getUsers', async (args: UsersQueryParametersType, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const users = await usersApi.getUsers(args);
        thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
        if (users.data.error) {
            handleServerAppError({messages: [users.data.error]} as ResponseTypeSocNet, thunkAPI.dispatch as AppDispatch);
        }
        return users;
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

// export const getFriends = createAsyncThunk('users/getFriends', async (args: UsersQueryParametersType, thunkAPI) => {
//     try {
//         thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
//         const friends = await usersApi.getUsers(args);
//         thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
//         if (friends.data.error) {
//             handleServerAppError({messages: [friends.data.error]} as ResponseTypeSocNet, thunkAPI.dispatch as AppDispatch);
//         }
//         return friends;
//     } catch (err) {
//         handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
//     }
// });

export const getFriends = (args: UsersQueryParametersType) => ({type: 'USERS-GET_FRIENDS', args});

export function* getFriendsWorker(action: ReturnType<typeof getFriends>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const friends: AxiosResponse<UsersResponse> = yield call(usersApi.getUsers, action.args);
        yield put(setFriends(friends.data));
        yield put(setPreloaderStatus({status: 'succeeded'}));
        if (friends.data.error) {
            //             handleServerAppError({messages: [friends.data.error]} as ResponseTypeSocNet, thunkAPI.dispatch as AppDispatch);
        }
    } catch (err) {

    }
}

export function* usersWatcher() {
    yield takeEvery('USERS-GET_FRIENDS', getFriendsWorker);
}

export const follow = createAsyncThunk('users/follow', async (userId: number, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const response = await usersApi.follow(userId);
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(follow_unfollow({userId}));
            thunkAPI.dispatch(addNewUser({userId}));
            thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch as AppDispatch);
        }
    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

export const unFollow = createAsyncThunk('users/unFollow', async (userId: number, thunkAPI) => {
    try {
        thunkAPI.dispatch(setPreloaderStatus({status: 'loading'}));
        const response = await usersApi.unFollow(userId);
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(follow_unfollow({userId}));
            thunkAPI.dispatch(setPreloaderStatus({status: 'succeeded'}));
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch as AppDispatch);
        }

    } catch (err) {
        handleServerNetworkError(err as AxiosError, thunkAPI.dispatch as AppDispatch);
    }
});

const slice = createSlice({
    name: 'users',
    initialState: {
        users: {} as UsersResponse,
        friends: {} as UsersResponse,
        searchParams: {
            count: 10,
            page: 1,
            term: '',
            friend: false,
        },
    },
    reducers: {
        changeSearchParams(state, action: PayloadAction<{ params: UsersQueryParametersType }>) {
            state.searchParams = action.payload.params;
        },
        follow_unfollow(state, action: PayloadAction<{ userId: number }>) {
            state.users.items = state.users.items.map(u => u.id === action.payload.userId ? {...u, followed: !u.followed} : u);
            state.friends.items = state.friends.items.filter(u => u.id !== action.payload.userId);
        },
        addNewUser(state, action: PayloadAction<{ userId: number }>) {
            const newUser = state.users.items.find(u => u.id === action.payload.userId);
            newUser && state.friends.items.push(newUser);
        },
        setFriends(state, action: PayloadAction<UsersResponse>) {
            state.friends = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getUsers.fulfilled, (state, action) => {
            if (action.payload) {
                return {...state, users: action.payload.data};
            }
        });
        // builder.addCase(getFriends.fulfilled, (state, action) => {
        //     if (action.payload) {
        //         return {...state, friends: action.payload.data};
        //     }
        // });
        // builder.addCase(logOut.fulfilled, (state, action) => {
        //     state.friends.items = [];
        // });
    },

});

export const {changeSearchParams, follow_unfollow, addNewUser, setFriends} = slice.actions;

export type ActionTypeForUsersReducer =
    ReturnType<typeof changeSearchParams>
    | ReturnType<typeof follow_unfollow>
    | ReturnType<typeof addNewUser>
    | ReturnType<typeof setFriends>

export const usersReducer = slice.reducer;
