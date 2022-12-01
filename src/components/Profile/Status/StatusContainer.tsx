import React, {useEffect, useState} from 'react';

import {useAppDispatch, useAppSelector} from '../../../store/store';
import {updateStatus} from '../../../store/reducers/profileReducer';

import Status from './Status';

const StatusContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const statusFromStore = useAppSelector(state => state.profile.status);
    const isLoading = useAppSelector(state => state.app.status)=='loading';
    let [status, setStatus] = useState(statusFromStore);
    let [editMode, setEditMode] = useState(false);

    const activatedMode = () => {
        setStatus(status);
        setEditMode(true);
    };
    const deactivatedMode = () => {
        setEditMode(false);
        if (statusFromStore !== status) {
            dispatch(updateStatus(status));
        }
    };

    useEffect(() => {
        setStatus(statusFromStore);
    }, [statusFromStore]);

    return (
        <Status status={status}
                editMode={editMode}
                activatedMode={activatedMode}
                deactivatedMode={deactivatedMode}
                setStatus={setStatus}
                isLoading={isLoading}
        />
    );
};

export default StatusContainer;