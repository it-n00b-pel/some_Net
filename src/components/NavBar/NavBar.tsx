import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {NavLink} from 'react-router-dom';

import {useAppSelector} from '../../store/store';

import s from './NavBar.module.scss';
import RandomFriendsAvatar from './RandomFriendsAvatar/RandomFriendsAvatar';

const NavBar: React.FC = () => {
    const myId = useAppSelector(state => state.auth.myData.id);
    const friends = useAppSelector(state => state.users.friends.items);

    const FriendBlock = friends && friends.length > 6 ?
        <Paper elevation={22} className={s.friendBlock}>
            <NavLink to={'/friends/'} className={navData => navData.isActive ? s.activeLink : ''}>Friends</NavLink>

            <div className={s.friendAvatars}>
                <RandomFriendsAvatar friends={friends}/>
                <RandomFriendsAvatar friends={friends}/>
                <RandomFriendsAvatar friends={friends}/>
            </div>
        </Paper>
        : null;

    const FriendLink = friends && friends.length <= 6 ? <NavLink to={'/friends/'} className={navData => navData.isActive ? s.activeLink : ''}>Friends</NavLink> : null;

    useEffect(() => {
    }, [friends]);

    return (
        <Box className={s.navigator}>
            <Paper elevation={22}>
                <div className={s.links}>
                    <NavLink to={'/profile/' + myId} className={navData => navData.isActive ? s.activeLink : ''}>My Profile</NavLink>
                    <NavLink to={'/dialogs/'} className={navData => navData.isActive ? s.activeLink : ''}>Messages</NavLink>
                    <NavLink to={'/users/'} className={navData => navData.isActive ? s.activeLink : ''}>Users</NavLink>
                    {FriendLink}
                    <NavLink to={'/news/'} className={navData => navData.isActive ? s.activeLink : ''}>News</NavLink>
                    <NavLink to={'/music/'} className={navData => navData.isActive ? s.activeLink : ''}>Music</NavLink>
                    <NavLink to={'/settings/'} className={navData => navData.isActive ? s.activeLink : ''}>Settings</NavLink>
                </div>
            </Paper>
            {FriendBlock}
        </Box>
    );
};

export default NavBar;