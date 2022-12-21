import React, {useEffect} from 'react';
import {Avatar, Box, Button} from '@material-ui/core';
import {Checkbox, CircularProgress, Modal} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WebIcon from '@mui/icons-material/Web';
import TelegramIcon from '@mui/icons-material/Telegram';
import WebAssetIcon from '@mui/icons-material/WebAsset';

import {cleanDataUser, getUserProfileAC} from '../../../../store/reducers/userProfileReducer';
import {useAppDispatch, useAppSelector} from '../../../../store/store';

import style from './UserProfileModal.module.scss';

type UserProfileModalPropsType = {
    userId: number,
    status: string | null,
    children: React.ReactNode,
}

const UserProfileModal: React.FC<UserProfileModalPropsType> = ({userId, status, children}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        dispatch(cleanDataUser());
        setOpen(false);
    };
    const dispatch = useAppDispatch();
    const profile = useAppSelector(state => state.userProfile.profile);
    const isLoading = useAppSelector(state => state.app.status) === 'loading';

    useEffect(() => {
        if (open) {
            dispatch(getUserProfileAC(userId));
        }
    }, [open]);

    const isContacts = () => {
        for (let contact in profile.contacts) {
            if (contact && profile.contacts[contact as keyof typeof profile.contacts]) return true;
        }
    };

    const ContactsElement = isContacts() ?
        <div className={style.contacts}>
            <h3>Contacts:</h3>
            {profile.contacts.github ? <a href={profile.contacts.github} target="_blank" rel="noreferrer"><GitHubIcon fontSize={'medium'} color={'info'}/></a> : null}
            {profile.contacts.twitter ? <a style={{textDecoration: 'none'}} href={profile.contacts.twitter} target="_blank" rel="noreferrer"><TwitterIcon fontSize={'medium'} color={'info'}/></a> : null}
            {profile.contacts.instagram ? <a href={profile.contacts.instagram} target="_blank" rel="noreferrer"><InstagramIcon fontSize={'medium'} color={'info'}/></a> : null}
            {profile.contacts.facebook ? <a href={profile.contacts.facebook} target="_blank" rel="noreferrer"><FacebookIcon fontSize={'medium'} color={'info'}/></a> : null}
            {profile.contacts.youtube ? <a href={profile.contacts.youtube} target="_blank" rel="noreferrer"><YouTubeIcon fontSize={'medium'} color={'info'}/></a> : null}
            {profile.contacts.website ? <a href={profile.contacts.website} target="_blank" rel="noreferrer"><WebIcon fontSize={'medium'} color={'info'}/></a> : null}
            {profile.contacts.vk ? <a href={profile.contacts.vk} target="_blank" rel="noreferrer"><TelegramIcon fontSize={'medium'} color={'info'}/></a> : null}
            {profile.contacts.mainLink ? <a href={profile.contacts.mainLink} target="_blank" rel="noreferrer"><WebAssetIcon fontSize={'medium'} color={'info'}/></a> : null}
        </div>
        : null;

    return (
        <div>
            <Button onClick={handleOpen} variant={'contained'} color={'primary'}>Show More</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={style.userModal}>
                    {isLoading && <CircularProgress className={style.preloader}/>}
                    <div className={style.nameAndAvatar}>
                        <h3>{profile.fullName}</h3>
                        <Avatar
                            alt={profile.fullName}
                            src={profile.photos.small ? profile.photos.small : '/broken-image.jpg'}
                            className={style.avatar}
                        />
                    </div>

                    <div className={style.status}>
                        <p><span className={style.mainText}>Status:</span> {status}</p>
                    </div>

                    <div className={style.lookJob}>
                        <h3>Looking for a job</h3>
                        <Checkbox checked={profile.lookingForAJob} disabled={true}/>
                    </div>

                    {/*<h3>Job description: {profile.lookingForAJobDescription}</h3>*/}

                    <div className={style.jobDescription}>
                        <p><span className={style.mainText}>Job description:</span> {profile.lookingForAJobDescription}</p>
                    </div>


                    {ContactsElement}
                    {children}
                </Box>
            </Modal>
        </div>
    );
};

export default UserProfileModal;