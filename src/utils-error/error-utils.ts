import {put, takeEvery} from '@redux-saga/core/effects';

import {AxiosError} from 'axios';

import {ResponseTypeSocNet} from '../api/instance';
import {setError, setPreloaderStatus} from '../store/reducers/appReducer';

export const handleServerAppError = <T>(data: ResponseTypeSocNet<T>) => ({type: 'ERROR-APP_ERROR', data});

export function* handleServerAppErrorWorker(action: ReturnType<typeof handleServerAppError>) {
    if (action.data.messages.length) {
        yield put(setError({error: action.data.messages[0]}));
        yield put(setPreloaderStatus({status: 'failed'}));
    }
}

export const handleServerNetworkError = (err: AxiosError) => ({type: 'ERROR-NETWORK_ERROR', err});

export function* handleServerNetworkErrorWorker(action: ReturnType<typeof handleServerNetworkError>) {
    const err = action.err;
    const error = err.response?.data ? (err.response?.data as ({ message: string })).message : err.message + ', more details in the console';
    yield put(setError({error}));
    yield put(setPreloaderStatus({status: 'failed'}));
}

export function* errorWatcher() {
    yield  takeEvery('ERROR-APP_ERROR', handleServerAppErrorWorker)
    yield  takeEvery('ERROR-NETWORK_ERROR', handleServerNetworkErrorWorker)
}