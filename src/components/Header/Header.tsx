import * as React from 'react';
import {AppBar, Avatar, Box, Button, ListItemIcon, Menu, MenuItem, Toolbar, Typography} from '@material-ui/core';

import {NavLink} from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import {CircularProgress} from '@mui/material';

import p from './../../App.module.scss';
import s from './Header.module.scss';
import BurgerMenu from './BurgerMenu/BurgerMunu';

type HeaderPropsType = {
    login: string,
    logOut: () => void,
    myId: number,
    isLogin: boolean,
    avatar: string | null,
    isLoading: boolean
}
const appBar: React.CSSProperties = {
    backgroundColor: '#424242',
    borderRadius: '0 0 10px 10px',
    margin: '0 auto',
    height: 70,
};

const Header: React.FC<HeaderPropsType> = ({login, logOut, myId, isLogin, avatar, isLoading}) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onclickLogOutHandler = () => {
        logOut();
        handleClose();
    };

    const rightSide = isLogin ? <>
            <Button id="basic-button"
                    style={{height: 32}}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    disabled={isLoading}>
                <h3>{login}</h3>
                <Avatar src={avatar ? avatar : '/broken-image.jpg'} className={s.avatar}/>
            </Button>

            <Menu anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                      'aria-labelledby': 'basic-button',
                  }}>
                <MenuItem onClick={handleClose}>
                    <NavLink to={'/profile/' + myId} style={{color: 'rgba(0, 0, 0, 0.9)'}}>My Profile</NavLink>
                </MenuItem>
                <MenuItem onClick={onclickLogOutHandler}>
                    <ListItemIcon style={{minWidth: '25px'}}>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
        :
        <NavLink to={'/login'}>Login</NavLink>;

    return (
        <Box className={s.appBar}>
            {isLoading && <CircularProgress size={60} className={p.preloader}/>}
            <AppBar position="sticky" style={appBar}>
                <Toolbar className={s.toolbarHeader}>
                    <Typography variant="h6" className={s.leftSide}>
                        <BurgerMenu/>
                        <NavLink to={'/'} style={{pointerEvents: isLoading ? 'none' : 'auto'}}>some.NET</NavLink>
                    </Typography>

                    <div className={s.profileSetting}>
                        {rightSide}
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    )
        ;
};

export default Header;