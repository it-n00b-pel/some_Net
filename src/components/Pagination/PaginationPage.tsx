import React, {useEffect, useState} from 'react';
import {Pagination} from '@mantine/core';
import {MenuItem, TextField} from '@mui/material';
import {useDebounce} from 'use-debounce';

import {UsersQueryParametersType} from '../../api/usersApi';

import style from './Pagination.module.scss';

type PaginationPagePropsType = {
    total: number,
    clearSearchParams: () => void,
    count: number,
    pageNumber: number,
    modifySearchParams: (page: number, count: number, term: string) => void,
    searchParams: UsersQueryParametersType,
    isLoading: boolean,
}

const PaginationPage: React.FC<PaginationPagePropsType> = ({total, clearSearchParams, pageNumber, count, modifySearchParams, searchParams, isLoading}) => {
    const [page, setPage] = useState(pageNumber);
    const [pageSize, setPageSize] = useState(count);
    const [name, setName] = useState('');
    const debouncedName = useDebounce(name, 1500);

    const handleChangePage = (page: number) => {
        setPage(page);
        modifySearchParams(page, count, name);
    };

    const handleChangePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(+event.target.value);
        modifySearchParams(page, +event.target.value, name);
    };

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.currentTarget.value);
    };

    useEffect(() => {
        if (searchParams.term !== name) {
            modifySearchParams(1, count, name);
            setPage(1);
        }
        return () => {
            clearSearchParams();
        };

    }, [debouncedName[0]]);
    useEffect(() => {
        setPage(pageNumber);
    }, [pageNumber]);
    return (
        <div className={style.pagination}>
            <TextField variant={'outlined'}
                       size={'small'}
                       placeholder={'User name'}
                       value={name}
                       onChange={handleChangeName}
                       color={'primary'}
                       className={style.nameFilter}
                       disabled={isLoading}
            />

            <TextField
                select
                size={'small'}
                value={pageSize}
                onChange={handleChangePageSize}
                className={style.pageCount}
                disabled={isLoading}
            >
                <MenuItem value={10}>10 /page</MenuItem>
                <MenuItem value={20}>20 /page</MenuItem>
                <MenuItem value={50}>50 /page</MenuItem>
            </TextField>

            <Pagination color={'blue'}
                        size={'sm'}
                        page={page}
                        onChange={handleChangePage}
                        total={total}
                        className={style.page}
                        disabled={isLoading}
            />
        </div>

    );
};

export default PaginationPage;