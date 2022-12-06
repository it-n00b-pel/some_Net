import React, {useEffect} from 'react';

import {useAppDispatch, useAppSelector} from '../../store/store';

import {pushMessage, startMessagesListening, stopMessagesListening} from '../../store/reducers/messagesReducer';

import Dialogs from './Dialogs';

const DialogsContainer: React.FC = () => {
    const myId = useAppSelector(state => state.auth.myData.id);
    const messages = useAppSelector(state => state.dialogs.messages);
    const dispatch = useAppDispatch();
    const isReady = 'ready';
    const sendMessage = (message: string) => {
        // message.length && dispatch(sendMessage({message, id: myId, name: login}));
        dispatch(pushMessage(message));
    };
    const scrollDown = () => {
        const dialogs = window.document.getElementById('messages');
        if (dialogs !== null) {
            dialogs.scrollTop = 999;
        }
    };

    useEffect(()=>{

    },[messages])

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