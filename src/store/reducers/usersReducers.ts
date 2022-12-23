import {call, put, takeEvery} from '@redux-saga/core/effects';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosError, AxiosResponse} from 'axios';

import {usersApi, UsersQueryParametersType, UsersResponse} from '../../api/usersApi';

import {handleServerAppError, handleServerNetworkError} from '../../utils-error/error-utils';
import {ResponseTypeSocNet} from '../../api/instance';

import {setPreloaderStatus} from './appReducer';

export const getUsers = (args: UsersQueryParametersType) => ({type: 'USERS-GET_USERS', args});

export function* getUsersWorker(action: ReturnType<typeof getUsers>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const users: AxiosResponse<UsersResponse> = yield call(usersApi.getUsers, action.args);
        yield put(setUsers(users.data));
        yield put(setPreloaderStatus({status: 'succeeded'}));
        if (users.data.error) {
            yield put(handleServerAppError({messages: [users.data.error]} as ResponseTypeSocNet));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export const getFriends = (args: UsersQueryParametersType) => ({type: 'USERS-GET_FRIENDS', args});

export function* getFriendsWorker(action: ReturnType<typeof getFriends>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const friends: AxiosResponse<UsersResponse> = yield call(usersApi.getUsers, action.args);
        yield put(setFriends(friends.data));
        yield put(setPreloaderStatus({status: 'succeeded'}));
        if (friends.data.error) {
            yield put(handleServerAppError({messages: [friends.data.error]} as ResponseTypeSocNet));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export const follow = (userId: number) => ({type: 'USERS-FOLLOW', userId});

export function* followWorker(action: ReturnType<typeof follow>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const response: AxiosResponse<ResponseTypeSocNet> = yield call(usersApi.follow, action.userId);
        if (response.data.resultCode === 0) {
            yield put(follow_unfollow({userId: action.userId}));
            yield put(addNewUser({userId: action.userId}));
            yield put(setPreloaderStatus({status: 'succeeded'}));
        } else {
            yield put(handleServerAppError(response.data));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export const unFollow = (userId: number) => ({type: 'USERS-UNFOLLOW', userId});

export function* unFollowWorker(action: ReturnType<typeof unFollow>) {
    try {
        yield put(setPreloaderStatus({status: 'loading'}));
        const response: AxiosResponse<ResponseTypeSocNet> = yield call(usersApi.unFollow, action.userId);
        if (response.data.resultCode === 0) {
            yield put(follow_unfollow({userId: action.userId}));
            yield put(setPreloaderStatus({status: 'succeeded'}));
        } else {
            yield put(handleServerAppError(response.data));
        }
    } catch (err) {
        yield put(handleServerNetworkError(err as AxiosError));
    }
}

export function* usersWatcher() {
    yield takeEvery('USERS-GET_FRIENDS', getFriendsWorker);
    yield takeEvery('USERS-GET_USERS', getUsersWorker);
    yield takeEvery('USERS-FOLLOW', followWorker);
    yield takeEvery('USERS-UNFOLLOW', unFollowWorker);
}

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
        },
        setUsers(state, action: PayloadAction<UsersResponse>) {
            state.users = action.payload;
        },
    },
});

export const {changeSearchParams, follow_unfollow, addNewUser, setFriends, setUsers} = slice.actions;

export type ActionTypeForUsersReducer =
    ReturnType<typeof changeSearchParams>
    | ReturnType<typeof follow_unfollow>
    | ReturnType<typeof addNewUser>
    | ReturnType<typeof setFriends>

export const usersReducer = slice.reducer;
