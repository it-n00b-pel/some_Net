import React from 'react';

import {Route, Routes} from 'react-router-dom';

import MainPageContainer from './MainPage/MainPageContainer';
import ProfileContainer from './Profile/ProfileContainer';
import Login from './Login/Login';
import UsersContainer from './Users/UsersContainer';
import RequireAuth from './RequireAuth/RequireAuth';

const MyRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPageContainer/>}/>
            <Route path="/profile/:userId" element={<RequireAuth children={<ProfileContainer/>}/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/users" element={<UsersContainer/>}/>
            <Route path="/friends" element={<RequireAuth children={<UsersContainer/>}/>}/>
            {/*<Route path="/news" element={<RequireAuth children={<div>nor</div>}/>}/>*/}
        </Routes>
    );
};

export default MyRoutes;