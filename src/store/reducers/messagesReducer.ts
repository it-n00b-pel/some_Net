import {AnyAction, createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {ThunkDispatch} from 'redux-thunk';

import {chatAPI} from '../../api/chatAPI';

const initialState = {
    messages: [] as MessageType[],
    status: 'pending' as StatusType,
};

let _newMessageHandler: ((messages: MessageType[]) => void) | null = null;

const newMessageHandlerCreator = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
    if (_newMessageHandler === null) {
        _newMessageHandler = (messages) => {
            dispatch(messagesReceived({messages}));
        };
    }
    return _newMessageHandler;
};

let _statusChangedHandler: ((status: StatusType) => void) | null = null;

const statusChangedHandlerCreator = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
    if (_statusChangedHandler === null) {
        _statusChangedHandler = (status) => {
            dispatch(setStatus({status}));
        };
    }
    return _statusChangedHandler;
};

export const startMessagesListening = createAsyncThunk('dialogs/startMessagesListening', async (arg, thunkAPI) => {
    chatAPI.start();
    chatAPI.subscribe('messages-received', newMessageHandlerCreator(thunkAPI.dispatch));
    chatAPI.subscribe('status-changed', statusChangedHandlerCreator(thunkAPI.dispatch));
});

export const stopMessagesListening = createAsyncThunk('dialogs/stopMessagesListening', async (arg, thunkAPI) => {
    chatAPI.unsubscribe('messages-received', newMessageHandlerCreator(thunkAPI.dispatch));
    chatAPI.unsubscribe('status-changed', statusChangedHandlerCreator(thunkAPI.dispatch));
    chatAPI.stop();
});

export const pushMessage = createAsyncThunk('dialogs/sendMessages', async (message: string) => {
    chatAPI.sendMessage(message);
});

const slice = createSlice({
    name: 'dialogs',
    initialState,
    reducers: {
        messagesReceived(state, action: PayloadAction<{ messages: MessageType[] }>) {
            state.messages = [...state.messages, ...action.payload.messages];
        },
        setStatus(state, action: PayloadAction<{ status: StatusType }>) {
            state.status = action.payload.status;
        },
    },
});

export const {messagesReceived, setStatus} = slice.actions;

export const dialogsReducer = slice.reducer;

export type DialogsActionType = ReturnType<typeof messagesReceived> | ReturnType<typeof setStatus>

export type MessageType = {
    userId: number,
    userName: string,
    message: string,
    photo: string,
}

export type StatusType = 'pending' | 'ready' | 'error'