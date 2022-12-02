import React, {ChangeEvent} from 'react';

import {Badge, IconButton} from '@mui/material';

import {PhotoCamera} from '@material-ui/icons';

import {Avatar} from '@material-ui/core';

import {useAppDispatch, useAppSelector} from '../../../store/store';
import {updateProfilePhoto} from '../../../store/reducers/profileReducer';

import style from './BadgeAvatar.module.scss';

const BadgeAvatar: React.FC = () => {
    const userProfileAvatar = useAppSelector(state => state.profile.profile.photos.large);
    const isLoading = useAppSelector(state => state.app.status) === 'loading';
    const dispatch = useAppDispatch();
    const uploadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        e.target.files && dispatch(updateProfilePhoto(e.target.files[0]));
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            badgeContent={
                <label className={style.loadAvatar}>
                    <IconButton disabled={isLoading} aria-label="upload picture" component="label">
                        <input disabled={isLoading} hidden accept="image/*" type="file" className={style.editUserPhoto} onChange={uploadAvatar}/>
                        <PhotoCamera style={{color: '#2196f3'}} fontSize={'large'}/>
                    </IconButton>
                </label>}
        >
            <Avatar
                alt="Personal user avatar"
                src={userProfileAvatar ? userProfileAvatar : '/broken-image.jpg'}
                style={{width: 200, height: 200}}
            />
        </Badge>
    );
};

export default BadgeAvatar;