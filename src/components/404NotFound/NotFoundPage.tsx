import React from 'react';

import notFound from '../../assets/img/404.png';

import style from  './noPage.module.scss'

const NotFoundPage: React.FC = () => {
    return (
        <div className={style.noPage}>
            <img src={notFound} alt="page not found 404"/>
        </div>
    );
};

export default NotFoundPage;