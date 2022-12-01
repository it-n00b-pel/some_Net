import React from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import {useAppDispatch} from '../../store/store';
import {setError} from '../../store/reducers/appReducer';

type ErrorNotificationPropsType = {
    error: string | null;
}

const ErrorNotification: React.FC<ErrorNotificationPropsType> = ({error}) => {
    const dispatch = useAppDispatch();
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setError({error: null}));
    };

    return (
        <Snackbar open={error !== null} autoHideDuration={3300} onClose={handleClose} anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}>
            <MuiAlert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                😠 {error}
            </MuiAlert>
        </Snackbar>
    );
};

export default ErrorNotification;