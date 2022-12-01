import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    isInitialized: false,
    error: null as string | null,
};

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
});

export const appReducer = slice.reducer;
export const {setInitialized, setError, setPreloaderStatus} = slice.actions;

export type ActionTypeForAppReducer =
    ReturnType<typeof setPreloaderStatus>
    | ReturnType<typeof setError>
    | ReturnType<typeof setInitialized>