import React, {ChangeEvent} from 'react';
import {IconButton, TextField} from '@mui/material';


import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';

import style from './Status.module.scss';

type StatusPropsType = {
    status: string,
    editMode: boolean,
    deactivatedMode: () => void,
    activatedMode: () => void,
    setStatus: (status: string) => void,
    isLoading: boolean
}

const Status: React.FC<StatusPropsType> = ({status, editMode, deactivatedMode, activatedMode, setStatus, isLoading}) => {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(e.currentTarget.value);
    };

    const textOrInput = !editMode ?
        <h4 className={style.statusText} onDoubleClick={activatedMode}>{status}</h4>
        :
        <div className={style.statusInput}>
            <TextField
                value={status}
                variant={'standard'}
                multiline
                maxRows={10}
                autoFocus
                onChange={onChangeHandler}
                aria-valuemax={30}
                inputProps={{maxLength: 300}}
            />
            <p>{status.length} - 300</p>
        </div>;

    const editOrEnter = <div className={style.editOrEnter}>
        {!editMode ?
            <IconButton size={'small'} disabled={isLoading} onClick={activatedMode}> <BorderColorTwoToneIcon fontSize={'medium'} color={'primary'}/></IconButton>
            :
            <IconButton size={'small'} disabled={isLoading} onClick={deactivatedMode}> <SendTwoToneIcon fontSize={'medium'} color={'info'}/></IconButton>

        }</div>;

    return (
        <div className={style.status}>
            <h3>Status:</h3>
            {textOrInput}
            {editOrEnter}
        </div>

    );
};

export default Status;
;