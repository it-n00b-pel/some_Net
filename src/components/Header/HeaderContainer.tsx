import React, {useEffect} from 'react';

import {useAppDispatch, useAppSelector} from '../../store/store';
import {logOut, me} from '../../store/reducers/authReducer';
import ErrorNotification from '../ErrorNotification/ErrorNotification';

import Header from './Header';

const HeaderContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const isLogin = useAppSelector(state => state.auth.isLogin);
    const {login, id} = useAppSelector(state => state.auth.myData);
    const avatar = useAppSelector(state => state.profile.profile.photos.small);
    const isLoading = useAppSelector(state => state.app.status) === 'loading';
    const error = useAppSelector(state => state.app.error);
    useEffect(() => {
        if (!isLogin) {
            dispatch(me());
        }
    }, [isLogin]);

    const deregister = () => {
        dispatch(logOut());
    };

    return (
        <>
            <Header login={login}
                    logOut={deregister}
                    myId={id}
                    isLogin={isLogin}
                    avatar={avatar}
                    isLoading={isLoading}
            />

            {error && <ErrorNotification error={error}/>}
        </>
    );
};

export default HeaderContainer;