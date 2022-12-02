import React from 'react';

import {useAppDispatch, useAppSelector} from '../../store/store';

import {sendMessage} from '../../store/reducers/messagesReducer';

import Dialogs from './Dialogs';

const DialogsContainer: React.FC = () => {
    const dialogs = useAppSelector(state => state.dialogs.messages);
    const myId = useAppSelector(state => state.auth.myData.id);
    const login = useAppSelector(state => state.auth.myData.login);
    const dispatch = useAppDispatch();

    const pushMessage = (message: string) => {
        dispatch(sendMessage({message, id: myId, name: login}));
    };

    return (
        <Dialogs dialogs={dialogs} pushMessage={pushMessage} myId={myId}/>
    );
};

export default DialogsContainer;