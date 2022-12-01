import React from 'react';

import {Checkbox} from '@mui/material';

import {ProfileResponse} from '../../api/profileAPI';

import style from './Profile.module.scss';
import StatusContainer from './Status/StatusContainer';
import BadgeAvatar from './BadgeAvatar/BadgeAvatar';
import EditProfileModal from './EditProfileModal/EditProfileModal';

type ProfilePropsType = {
    userId: string,
    profile: ProfileResponse

}

const Profile: React.FC<ProfilePropsType> = ({profile, userId}) => {
    const contacts = profile.contacts;
    const fullName = profile.fullName;

    return (

        <div className={style.profile}>
            <div
                className={style.profilePaper}
               >
                <div className={style.avatarAndStatus}>
                    <div className={style.avatar}>
                        <h2>{fullName}</h2>
                        <BadgeAvatar/>
                    </div>
                    <StatusContainer/>
                </div>

                <div style={{display: 'flex'}}>
                    <h3>Looking for a job:</h3>
                    <Checkbox
                        checked={profile.lookingForAJob}
                        disabled={true}
                        style={{color: 'rgb(0 146 249 / 79%)'}}
                    />
                </div>
                <div className={style.jobDescription}>
                    <h3>Looking for a job Description: </h3>
                    <p>{profile.lookingForAJobDescription}</p>
                </div>

                <div className={style.meInfo}>
                    <h3>About me:</h3>
                    <p>{profile.aboutMe}</p>
                </div>

                <div className={style.contacts}>
                    <h3>Contacts:</h3>
                    <ul>
                        <li><h4>Facebook: </h4>{contacts.facebook && <a href={contacts.facebook}>{contacts.facebook}</a>}</li>
                        <li><h4>GitHub:</h4>{contacts.github && <a href={contacts.github}>{contacts.github}</a>}</li>
                        <li><h4>Instagram:</h4>{contacts.instagram && <a href={contacts.instagram}>{contacts.instagram}</a>}</li>
                        <li><h4>Youtube:</h4>{contacts.youtube && <a href={contacts.youtube}>{contacts.youtube}</a>}</li>
                        <li><h4>MainLink:</h4>{contacts.mainLink && <a href={contacts.mainLink}>{contacts.mainLink}</a>}</li>
                        <li><h4>Website:</h4>{contacts.website && <a href={contacts.website}>{contacts.website}</a>}</li>
                        <li><h4>Twitter:</h4>{contacts.twitter && <a href={contacts.twitter}>{contacts.twitter}</a>}</li>
                        <li><h4>Vk:</h4>{contacts.vk && <a href={contacts.vk}>{contacts.vk}</a>}</li>
                    </ul>

                </div>
                <div style={{textAlign: 'end'}}>
                    <EditProfileModal/>
                </div>

            </div>
        </div>

    );
};

export default Profile;