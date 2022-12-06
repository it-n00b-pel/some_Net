import React, {useEffect} from 'react';

import {useAppDispatch, useAppSelector} from '../../store/store';

import {pushMessage, startMessagesListening, stopMessagesListening} from '../../store/reducers/messagesReducer';

import Dialogs from './Dialogs';

const DialogsContainer: React.FC = () => {
    const myId = useAppSelector(state => state.auth.myData.id);
    const messages = useAppSelector(state => state.dialogs.messages);
    const dispatch = useAppDispatch();
    const isReady = useAppSelector(state => state.dialogs.status);

    const sendMessage = (message: string) => {
        dispatch(pushMessage(message));
    };

    useEffect(() => {
        dispatch(startMessagesListening());
        return () => {
            dispatch(stopMessagesListening());
        };
    }, []);

    return (
        <Dialogs dialogs={messages} pushMessage={sendMessage} myId={myId} isReady={isReady}/>
    );
};

export default DialogsContainer;