import {AxiosError} from 'axios';

import {AppDispatch} from '../store/store';
import {ResponseTypeSocNet} from '../api/instance';
import {setError, setPreloaderStatus} from '../store/reducers/appReducer';

export const handleServerAppError = <T>(data: ResponseTypeSocNet<T>, dispatch: AppDispatch) => {
    data.messages.length && dispatch(setError({error: data.messages[0]}));
    dispatch(setPreloaderStatus({status: 'failed'}));
};

export const handleServerNetworkError = (e: AxiosError, dispatch: AppDispatch) => {
    const error = e.response?.data ? (e.response?.data as ({ message: string })).message : e.message + ', more details in the console';
    dispatch(setError({error}));
    // console.log((e.response?.data as ({ message: string })).message);
    dispatch(setPreloaderStatus({status: 'failed'}));
};