import React, {useEffect, useState} from 'react';
import {Box, Button} from '@material-ui/core';
import {Checkbox, CircularProgress, Fade, Modal, TextField} from '@mui/material';

import {useFormik} from 'formik';

import {useAppDispatch, useAppSelector} from '../../../store/store';
import {updateProfileData} from '../../../store/reducers/profileReducer';

import s from './EditProfileModal.module.scss';

type FormikErrorType = {
    fullName?: string,
    aboutMe?: string,
    github?: string,
    vk?: string,
    facebook?: string,
    twitter?: string,
    youtube?: string,
    instagram?: string,
    mainLink?: string,
    website?: string
}

const EditProfileModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useAppDispatch();

    const profile = useAppSelector(state => state.profile.profile);
    const isLoading = useAppSelector(state => state.app.status) === 'loading';

    // const validateSocialLinks = (values: any, errors: FormikErrorType) => {
    //     const socialKeys = ['github', 'vk', 'facebook', 'twitter', 'youtube', 'instagram', 'mainLink', 'website'];
    //     for (let i = 0; i < socialKeys.length; i++) {
    //         if ((!/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/.test(values[socialKeys[i]])) && values[socialKeys[i]].length > 0) {
    //             // @ts-ignore
    //             errors[socialKeys[i]] = `Invalid ${socialKeys[i]} URL `;
    //         }
    //     }
    // };

    const formik = useFormik({

        initialValues: {
            fullName: profile.fullName,
            aboutMe: profile.aboutMe,
            lookingForAJob: profile.lookingForAJob,
            lookingForAJobDescription: profile.lookingForAJobDescription,
            github: profile.contacts.github,
            vk: profile.contacts.vk,
            facebook: profile.contacts.facebook,
            twitter: profile.contacts.twitter,
            youtube: profile.contacts.youtube,
            instagram: profile.contacts.instagram,
            mainLink: profile.contacts.mainLink,
            website: profile.contacts.website,

        },
        validate: values => {
            const errors: FormikErrorType = {};
            if (!values.fullName) {
                errors.fullName = 'Required';
            }
            if (!values.aboutMe) {
                errors.aboutMe = 'Required';
            }

            const socialKeys = ['github', 'vk', 'facebook', 'twitter', 'youtube', 'instagram', 'mainLink', 'website'];

            for (let i = 0; i < socialKeys.length; i++) {

                // @ts-ignore
                if ((!/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/.test(values[socialKeys[i]])) && values[socialKeys[i]].length > 0) {
                    // @ts-ignore
                    errors[socialKeys[i]] = `Invalid ${socialKeys[i]} URL `;
                }
            }
            // validateSocialLinks(values, errors);
            return errors;
        },
        onSubmit: values => {
            dispatch(updateProfileData({
                aboutMe: values.aboutMe,
                fullName: values.fullName,
                lookingForAJob: values.lookingForAJob,
                lookingForAJobDescription: values.lookingForAJobDescription,
                contacts: {
                    vk: values.vk,
                    github: values.github,
                    facebook: values.facebook,
                    twitter: values.twitter,
                    youtube: values.youtube,
                    mainLink: values.mainLink,
                    website: values.website,
                    instagram: values.instagram,
                },
            }));
            // handleClose();
        },
    });

    useEffect(() => {
        formik.values.fullName = profile.fullName;
        formik.values.aboutMe = profile.aboutMe;
        formik.values.lookingForAJob = profile.lookingForAJob;
        formik.values.lookingForAJobDescription = profile.lookingForAJobDescription;
        formik.values.vk = profile.contacts.vk;
        formik.values.instagram = profile.contacts.instagram;
        formik.values.github = profile.contacts.github;
        formik.values.facebook = profile.contacts.facebook;
        formik.values.twitter = profile.contacts.twitter;
        formik.values.youtube = profile.contacts.youtube;
        formik.values.mainLink = profile.contacts.mainLink;
        formik.values.website = profile.contacts.website;
    }, [profile]);

    return (
        <div>
            <Button onClick={handleOpen} disabled={isLoading} variant={'contained'} color={'primary'}>Edit Profile</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>

                    <Box
                        className={s.profileModal}>
                        {isLoading && <CircularProgress className={s.preloader}/>}
                        <form onSubmit={formik.handleSubmit}>
                            {/*{isLoading && <CircularProgress size={60} className={'preloader'}/>}*/}
                            <TextField className={s.inputBlock} label="Full Name" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.fullName}
                                       helperText={formik.touched.fullName && formik.errors.fullName}
                                       {...formik.getFieldProps('fullName')}/>
                            <TextField className={s.inputBlock} label="About me" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.aboutMe}
                                       helperText={formik.touched.aboutMe && formik.errors.aboutMe}
                                       {...formik.getFieldProps('aboutMe')}/>
                            <div className={s.lookingForAJob}>
                                <h3>Looking for a job:</h3>
                                <Checkbox
                                    disabled={isLoading}
                                    checked={formik.values.lookingForAJob}
                                    {...formik.getFieldProps('lookingForAJob')}
                                    color="primary"/>
                            </div>
                            <TextField label="Looking for a job description" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       {...formik.getFieldProps('lookingForAJobDescription')}/>
                            <TextField className={s.inputBlock} label="GitHub" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.github}
                                       helperText={formik.touched.github && formik.errors.github}
                                       {...formik.getFieldProps('github')}/>
                            <TextField className={s.inputBlock} label="Facebook" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.facebook}
                                       helperText={formik.touched.facebook && formik.errors.facebook}
                                       {...formik.getFieldProps('facebook')}/>
                            <TextField className={s.inputBlock} label="VK" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.vk}
                                       helperText={formik.touched.vk && formik.errors.vk}
                                       {...formik.getFieldProps('vk')}/>
                            <TextField className={s.inputBlock} label="Instagram" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.instagram}
                                       helperText={formik.touched.instagram && formik.errors.instagram}
                                       {...formik.getFieldProps('instagram')}/>
                            <TextField className={s.inputBlock} label="YouTube" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.youtube}
                                       helperText={formik.touched.youtube && formik.errors.youtube}
                                       {...formik.getFieldProps('youtube')}/>
                            <TextField className={s.inputBlock} label="Twitter" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.twitter}
                                       helperText={formik.touched.twitter && formik.errors.twitter}
                                       {...formik.getFieldProps('twitter')}/>
                            <TextField className={s.inputBlock} label="Main Link" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.mainLink}
                                       helperText={formik.touched.mainLink && formik.errors.mainLink}
                                       {...formik.getFieldProps('mainLink')}/>
                            <TextField className={s.inputBlock} label="Website" variant="outlined" size={'small'}
                                       disabled={isLoading}
                                       error={!!formik.errors.website}
                                       helperText={formik.touched.website && formik.errors.website}
                                       {...formik.getFieldProps('website')}/>

                            <div className={s.btnBlock}>
                                <Button variant={'contained'}
                                        color={'inherit'}
                                        onClick={handleClose}
                                        disabled={isLoading}>Cancel</Button>
                                <Button variant={'contained'}
                                        color={'secondary'}
                                        type={'submit'}
                                        disabled={isLoading}>Send Data</Button>
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};

export default EditProfileModal;