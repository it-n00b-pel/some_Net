import React from 'react';


import {Avatar, Button} from '@material-ui/core';
import {Card} from '@mui/material';
// @ts-ignore
import Tilt from 'react-parallax-tilt';

import {UserType} from '../../../api/usersApi';

import style from './UsersList.module.scss';

import UserProfileModal from './UserProfileModal/UserProfileModal';

type UsersPropsType = {
    users: UserType[],
    followUser: (userId: number) => void,
    unFollowUser: (userId: number) => void,
    isLoading: boolean
}

const Users: React.FC<UsersPropsType> = ({users, followUser, unFollowUser, isLoading}) => {

    const followOrUnfollowButton = (followed: boolean, userId: number) => {
        if (followed) {
            return <Button variant={'contained'}
                           color={'secondary'}
                           disabled={isLoading}
                           onClick={() => unFollowUser(userId)}>UNFOLLOW</Button>;
        } else
            return <Button onClick={() => followUser(userId)}
                           disabled={isLoading}
                           className={style.followBtn}>FOLLOW</Button>;
    };

    const usersList = users && users.map((u) => (
        // @ts-ignore
        <Tilt key={u.id} tiltMaxAngleX={5} tiltMaxAngleY={5} style={{height: '100%'}}>
            <Card  className={style.user}>
                <Avatar key={u.id} alt={u.name}
                        src={u.photos.large ? u.photos.large : ''}
                        className={style.avatar}
                />
                <h3>Name: {u.name}</h3>
                <h3>Status: {u.status}</h3>
                <div className={style.buttons}>
                    {/*<Button variant={'contained'} color={'primary'}>Show more</Button>*/}
                    <UserProfileModal userId={u.id} status={u.status} children={followOrUnfollowButton(u.followed, u.id)}/>
                    {followOrUnfollowButton(u.followed, u.id)}
                </div>

            </Card>
        </Tilt>

    ));

    return (
        <div className={style.usersList}>
            {usersList}


        </div>
    );
};

export default Users;