import React, {useEffect} from 'react';

import {useParams} from 'react-router-dom';

import {useAppDispatch, useAppSelector} from '../../store/store';
import {getProfileData} from '../../store/reducers/profileReducer';

import Profile from './Profile';

const ProfileContainer: React.FC = () => {
    let {userId} = useParams();
    const dispatch = useAppDispatch();

    const profile = useAppSelector(state => state.profile.profile);
    const isLogin = useAppSelector(state => state.auth.isLogin);
    const isInitialized = useAppSelector(state => state.app.isInitialized);

    useEffect(() => {
        isInitialized && isLogin && userId && dispatch(getProfileData(+userId));
    }, [userId]);

    // if (!isInitialized) return <CircularProgress size={60} className={p.preloader}/>;
    //

    if (!userId) return null;

    return (
        <Profile userId={userId} profile={profile}/>
    );
};

export default ProfileContainer;