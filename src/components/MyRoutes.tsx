import React from 'react';

import {Navigate, Route, Routes} from 'react-router-dom';

import {useAppSelector} from '../store/store';

import ProfileContainer from './Profile/ProfileContainer';
import Login from './Login/Login';
import UsersContainer from './Users/UsersContainer';
import RequireAuth from './RequireAuth/RequireAuth';
import NotFoundPage from './404NotFound/NotFoundPage';
import DialogsContainer from './Dialogs/DialogsContainer';
import InDevelopment from './InDevelopment/InDevelopment';


const MyRoutes: React.FC = () => {
    const myId = useAppSelector(state => state.auth.myData.id);

    return (
        <Routes>
            <Route path="/profile/:userId" element={<RequireAuth children={<ProfileContainer/>}/>}/>
            <Route path="/" element={<Navigate to={`/profile/` + myId}/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/dialogs" element={<RequireAuth children={<DialogsContainer/>}/>}/>
            <Route path="/users" element={<UsersContainer/>}/>
            <Route path="/friends" element={<RequireAuth children={<UsersContainer/>}/>}/>
            <Route path="/news" element={<InDevelopment/>}/>
            <Route path="/settings" element={<InDevelopment/>}/>
            <Route path="/music" element={<InDevelopment/>}/>
            <Route path={'*'} element={<NotFoundPage/>}/>
        </Routes>
    );
};

export default MyRoutes;