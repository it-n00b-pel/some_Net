import {Navigate} from 'react-router-dom';
import React, {ReactNode} from 'react';
import {CircularProgress} from '@mui/material';

import {useAppSelector} from '../../store/store';
import p from '../../App.module.scss';

type RequireAuthPropsType = {
    children: ReactNode
}

const RequireAuth: React.FC<RequireAuthPropsType> = ({children}) => {

    const isLogin = useAppSelector(state => state.auth.isLogin);
    const isInitialized = useAppSelector(state => state.app.isInitialized);
    if (!isInitialized) return <CircularProgress size={60} className={p.preloader}/>;
    if (!isLogin) {
        return <Navigate to={'/login'}/>;
    }

    return <div>{children}</div>;

};

export default RequireAuth;