import React from 'react';

import Paper from '@mui/material/Paper';

import style from './App.module.scss';
import HeaderContainer from './components/Header/HeaderContainer';
import MyRoutes from './components/MyRoutes';
import NavBar from './components/NavBar/NavBar';


function App() {
    return (
        <div className={style.App}>
            <HeaderContainer/>
            <div className={style.content}>
                <NavBar/>
                <Paper elevation={22} style={{width: '100%', backgroundColor: '#424242', borderRadius: 10}}>
                    <MyRoutes/>
                </Paper>

            </div>
        </div>
    );
}

export default App;
