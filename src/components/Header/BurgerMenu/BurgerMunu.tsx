import React, {useState} from 'react';
import {Burger} from '@mantine/core';
import {Box, Menu, MenuItem} from '@material-ui/core';

import {NavLink} from 'react-router-dom';

import {SwipeableDrawer} from '@mui/material';

import {useAppSelector} from '../../../store/store';

import style from './BurgerMenu.module.scss';


type Anchor = 'left'

const BurgerMenu: React.FC = () => {
    const [opened, setOpened] = useState(false);
    const myId = useAppSelector(state => state.auth.myData.id);
    const [state, setState] = React.useState({
        left: false,
    });
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const toggleDrawer = (anchor: Anchor, open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event &&
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            if (window.innerWidth <= 768) {
                setState({...state, [anchor]: open});
            }

        };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpened((o) => !o);

    };
    const handleClose = () => {
        setAnchorEl(null);
        setOpened((o) => !o);
    };

    const list = (anchor: Anchor) => (
        <Box
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className={style.lefMenu}

        >
            <div className={style.links}>
                <NavLink to={'/profile/' + myId} className={navData => navData.isActive ? style.activeLink : ''}>My Profile</NavLink>
                <NavLink to={'/dialogs/'} className={navData => navData.isActive ? style.activeLink : ''}>Messages</NavLink>
                <NavLink to={'/users/'} className={navData => navData.isActive ? style.activeLink : ''}>Users</NavLink>
                <NavLink to={'/friends/'} className={navData => navData.isActive ? style.activeLink : ''}>Friends</NavLink>
                <NavLink to={'/news/'} className={navData => navData.isActive ? style.activeLink : ''}>News</NavLink>
                <NavLink to={'/music/'} className={navData => navData.isActive ? style.activeLink : ''}>Music</NavLink>
                <NavLink to={'/settings/'} className={navData => navData.isActive ? style.activeLink : ''}>Settings</NavLink>
            </div>
        </Box>
    );

    return (
        <div>
            <Burger
                opened={opened}
                onClick={handleClick}
                onMouseDown={toggleDrawer('left', true)}
                className={style.trigger}
                color={'#2196f3'}
            />
            <Menu id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onBlur={handleClose}
                  MenuListProps={{
                      'aria-labelledby': 'basic-button',
                  }}
                  className={style.burger}

            >
                <MenuItem><NavLink to={'/profile/' + myId} className={navData => navData.isActive ? style.activeLink : ''}>My Profile</NavLink></MenuItem>
                <MenuItem> <NavLink to={'/dialogs/'} className={navData => navData.isActive ? style.activeLink : ''}>Messages</NavLink></MenuItem>
                <MenuItem><NavLink to={'/users/'} className={navData => navData.isActive ? style.activeLink : ''}>Users</NavLink></MenuItem>
                <MenuItem><NavLink to={'/friends/'} className={navData => navData.isActive ? style.activeLink : ''}>Friends</NavLink></MenuItem>
                <MenuItem><NavLink to={'/news/'} className={navData => navData.isActive ? style.activeLink : ''}>News</NavLink></MenuItem>
                <MenuItem><NavLink to={'/music/'} className={navData => navData.isActive ? style.activeLink : ''}>Music</NavLink></MenuItem>
                <MenuItem><NavLink to={'/settings/'} className={navData => navData.isActive ? style.activeLink : ''}>Settings</NavLink></MenuItem>

            </Menu>

            <SwipeableDrawer
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}
                onOpen={toggleDrawer('left', true)}
                className={style.drawer}
            >
                {list('left')}
            </SwipeableDrawer>

        </div>
    );
};

export default BurgerMenu;