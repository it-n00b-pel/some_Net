import React, {ChangeEvent, useState} from 'react';

import {TextField} from '@mui/material';

import {Button} from '@material-ui/core';

import style from './Dialogs.module.scss';

type DialogsPropsType = {
    dialogs: Array<{ id: number, message: string, name: string }>,
    pushMessage: (message: string) => void,
    myId: number,
}

const Dialogs: React.FC<DialogsPropsType> = ({dialogs, pushMessage, myId}) => {
    const [message, setMessage] = useState('');

    const messages = <div className={style.messages}>
        {dialogs.map(m =>
            <div className={`${m.id === myId ? `${style.myMessage}` : `${style.message}`}`}>
                <p><span>{m.name}</span>: {m.message}</p>
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
            <Button variant={'contained'} onClick={onClickHandler} color={'primary'}>Send Message</Button>
        </div>
    );
};

export default Dialogs;