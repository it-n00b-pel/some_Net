import {AnyAction, createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {ThunkDispatch} from 'redux-thunk';

import {chatAPI} from '../../api/chatAPI';

const initialState = {
    messages: [] as MessageType[],
};

let _newMessageHandler: ((messages: MessageType[]) => void) | null = null;

const newMessageHandler = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
    if (_newMessageHandler === null) {
        _newMessageHandler = (messages) => {
            dispatch(messagesReceived({messages}));
        };
    }
    return _newMessageHandler;
};

export const startMessagesListening = createAsyncThunk('dialogs/startMessagesListening', async (arg, thunkAPI) => {
    chatAPI.start();
    chatAPI.subscribe(newMessageHandler(thunkAPI.dispatch));
});

export const stopMessagesListening = createAsyncThunk('dialogs/stopMessagesListening', async (arg, thunkAPI) => {
    chatAPI.unsubscribe(newMessageHandler(thunkAPI.dispatch));
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

    },
});

export const {messagesReceived} = slice.actions;

export const dialogsReducer = slice.reducer;

export type DialogsActionType = ReturnType<typeof messagesReceived>

export type MessageType = {
    userId: number,
    userName: string,
    message: string,
    photo: string,
}