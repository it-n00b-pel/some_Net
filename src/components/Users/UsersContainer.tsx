import React, {useEffect} from 'react';

import {useLocation} from 'react-router-dom';

import {CircularProgress} from '@mui/material';

import {useAppDispatch, useAppSelector} from '../../store/store';
import {changeSearchParams, follow, getUsers, unFollow} from '../../store/reducers/usersReducers';
import PaginationPage from '../Pagination/PaginationPage';

import p from '../../App.module.scss';

import Users from './UsersList/Users';


const UsersContainer: React.FC = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const searchParams = useAppSelector(state => state.users.searchParams);
    const users = useAppSelector(state => state.users.users);
    const total = Math.ceil(users.totalCount / searchParams.count);
    const isLoading = useAppSelector(state => state.app.status) === 'loading';
    const isInitialized = useAppSelector(state => state.app.isInitialized);

    const clearSearchParams = () => {
        // dispatch(changeSearchParams({params: {term: '', page: 1, count: 10, friend: location.pathname === '/friends/'}}));
    };

    const modifySearchParams = (page: number, count: number, term: string) => {
        if (location.pathname === '/friends/') {
            dispatch(changeSearchParams({params: {page, count, term, friend: true}}));
        } else dispatch(changeSearchParams({params: {page, count, term, friend: false}}));
    };

    const unFollowUser = (userId: number) => {
        dispatch(unFollow(userId));
    };

    const followUser = (userId: number) => {
        dispatch(follow(userId));
    };

    useEffect(() => {
        if (isInitialized) {
            dispatch(getUsers({...searchParams, friend: location.pathname === '/friends/'}));
        }

    }, [searchParams, isInitialized]);

    if (!isInitialized) return <CircularProgress size={60} className={p.preloader}/>;

    return (
        <div>
            <PaginationPage total={total}
                            clearSearchParams={clearSearchParams}
                            pageNumber={searchParams.page}
                            count={searchParams.count}
                            modifySearchParams={modifySearchParams}
                            searchParams={searchParams}
                            isLoading={isLoading}
            />
            <Users users={users.items}
                   followUser={followUser}
                   unFollowUser={unFollowUser}
                   isLoading={isLoading}
            />
        </div>

    );
};

export default UsersContainer;