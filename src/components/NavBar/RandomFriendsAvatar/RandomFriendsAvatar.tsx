import React, {useEffect, useState} from 'react';

import {Avatar} from '@material-ui/core';

import {UserType} from '../../../api/usersApi';

type RandomFriendsAvatarPropsType = {
    friends: UserType[]
}

const RandomFriendsAvatar: React.FC<RandomFriendsAvatarPropsType> = ({friends}) => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);
    const [name, setName] = useState('');
    const getRandomAvatar = () => {
        if (friends && friends.length > 3) {
            const index = Math.floor(Math.random() * friends.length - 1) + 1;
            if (friends[index].photos.small) {
                setAvatar(friends[index].photos.small);
            } else {
                setAvatar('');
            }
            setName(friends[index].name);
        }

    };

    useEffect(() => {
        const index = Math.floor(Math.random() * (10 - 5) + 5);
        setTimeout(() => {
            getRandomAvatar();
            setTrigger(trigger + 1);
        }, index * 1500);
    }, [trigger]);

    return (
        <Avatar src={avatar ? avatar : undefined} alt={name} style={{
            width: 50, height: 50,
            transitionDuration: '0.5s',
            transform: trigger % 2 === 0 ? 'rotate3d(0 , 1 , 0,180deg)' : 'rotate3d(0 , 1 , 0,360deg)',
        }}/>
    );
};

export default RandomFriendsAvatar;