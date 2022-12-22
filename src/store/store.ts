import createSagaMiddleware from 'redux-saga';
import {all} from '@redux-saga/core/effects';
import {combineReducers} from 'redux';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import {ActionTypeForAppReducer, appReducer, getCaptchaWatcher} from './reducers/appReducer';
import {authReducer} from './reducers/authReducer';
import {profileReducer} from './reducers/profileReducer';
import {ActionTypeForUsersReducer, usersReducer} from './reducers/usersReducers';
import {ActionTypeForUserProfileReducer, userProfileReducer, userProfileWatcher} from './reducers/userProfileReducer';
import {DialogsActionType, dialogsReducer} from './reducers/messagesReducer';

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    profile: profileReducer,
    users: usersReducer,
    userProfile: userProfileReducer,
    dialogs: dialogsReducer,
});

function* rootWatcher() {
    yield all([userProfileWatcher(), getCaptchaWatcher()]);

}

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).prepend(thunkMiddleware, sagaMiddleware),
});

sagaMiddleware.run(rootWatcher);

type AppActionsType = ActionTypeForAppReducer | ActionTypeForUsersReducer | ActionTypeForUserProfileReducer | DialogsActionType
export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

// @ts-ignore
window.store = store;