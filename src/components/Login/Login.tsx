import React from 'react';
import {useFormik} from 'formik';
import {Checkbox, TextField} from '@mui/material';
import {Button} from '@material-ui/core';

import {Navigate} from 'react-router-dom';

import {useAppDispatch, useAppSelector} from '../../store/store';
import {login} from '../../store/reducers/authReducer';

import style from './Login.module.scss';

type FormikErrorType = {
    email?: string,
    password?: string,
    captcha?: string,
}

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const isLogin = useAppSelector(state => state.auth.isLogin);
    const myId = useAppSelector(state => state.auth.myData.id);
    const captchaUrl = useAppSelector(state => state.app.captcha);
    const errors: FormikErrorType = {};

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: true,
            captcha: '',
        },
        validate: values => {
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (values.password.length < 4) {
                errors.password = 'Min 4 characters';
            }
            return errors;
        },
        onSubmit: values => {
            dispatch(login({email: values.email, password: values.password, rememberMe: values.rememberMe, captcha: values.captcha}));
        },
    });

    const captchaUrlBlock = captchaUrl ? <div className={style.captchaBlock}>
        <img src={captchaUrl} alt="captchaUrl"/>
        <TextField label="Captcha" variant="outlined"
                   error={!!formik.errors.captcha}
                   className={style.inputBlock}
                   helperText={formik.touched.captcha && formik.errors.captcha}
                   {...formik.getFieldProps('captcha')}/>
    </div> : null;

    if (isLogin) return <Navigate to={'/profile/'+myId}/>;
    return (
        <div className={style.login}>
            <form onSubmit={formik.handleSubmit}>

                <TextField label="Email" variant="outlined"
                           error={!!formik.errors.email}
                           className={style.inputBlock}
                           helperText={formik.touched.email && formik.errors.email}
                           {...formik.getFieldProps('email')}/>

                <TextField label={'Password'} variant="outlined"
                           type={'password'}
                           className={style.inputBlock}
                           error={!!formik.errors.password}
                           helperText={formik.touched.password && formik.errors.password}
                           {...formik.getFieldProps('password')}
                />

                <div className={style.rememberMe}>
                    <h3>Remember me</h3>
                    <Checkbox checked={formik.values.rememberMe}
                              {...formik.getFieldProps('rememberMe')}
                    />
                </div>

                {captchaUrlBlock}

                <Button type={'submit'}>Login</Button>

                <div className={style.free}>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'} rel="noreferrer"> here
                        </a>
                    </p>
                    <p>Or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </div>
            </form>
        </div>
    );
};

export default Login;