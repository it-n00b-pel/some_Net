import React, {ChangeEvent, useState} from 'react';

import {TextField} from '@mui/material';

import {Button} from '@material-ui/core';

import {MessageType} from '../../store/reducers/messagesReducer';

import style from './Dialogs.module.scss';

type DialogsPropsType = {
    dialogs: MessageType[],
    pushMessage: (message: string) => void,
    myId: number,
    isReady: 'ready' | 'pending',
}

const Dialogs: React.FC<DialogsPropsType> = ({dialogs, pushMessage, myId, isReady}) => {
    const [message, setMessage] = useState('');

    const messages = <div className={style.messages} id="messages">
        {dialogs.map((m, index) =>
            <div key={index} className={`${m.userId === myId ? `${style.myMessage}` : `${style.message}`}`}>
                <p><span><img src={m.photo} alt="" style={{width: 25, height: 25, borderRadius: '50%'}}/>
                    {m.userName}</span> {m.message}</p>
            </div>)}
    </div>;

    const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setMessage(e.currentTarget.value);
    };

    const onClickHandler = () => {
        pushMessage(message);
        setMessage('');
    };

    return (
        <div className={style.dialogBlock}>
            {messages}
            <TextField label="Message"
                       variant="filled" value={message}
                       onChange={onChangeHandler}
                       multiline={true}
                       autoFocus
            />
            <Button disabled={isReady !== 'ready'} variant={'contained'} onClick={onClickHandler} color={'primary'}>Send Message</Button>
        </div>
    );
};

export default Dialogs;