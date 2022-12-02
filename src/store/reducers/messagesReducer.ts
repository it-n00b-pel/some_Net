import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    messages: [
        {
            id: 1,
            name: 'Mark',
            message: 'Hi',
        },
        {
            id: 2,
            name: 'Nik',
            message: 'Alloha',
        },
        {
            id: 1,
            name: 'Tom',
            message: 'Are you here?',
        },
        {
            id: 1,
            name: 'Kate',
            message: 'Call me please',
        },
    ],
};

const slice = createSlice({
    name: 'dialogs',
    initialState,
    reducers: {
        sendMessage(state, action: PayloadAction<{ message: string, id: number, name: string}>) {
            state.messages.push({id: action.payload.id, message: action.payload.message, name :action.payload.name });
        },
    },
});

export const {sendMessage} = slice.actions;

export const dialogsReducer = slice.reducer;

export type DialogsActionType = ReturnType<typeof sendMessage>