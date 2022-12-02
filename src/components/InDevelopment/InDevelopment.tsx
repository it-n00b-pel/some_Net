import React from 'react';

import devImg from '../../assets/img/img.png';

import style from './InDevelopment.module.scss';

const InDevelopment: React.FC = () => {
    return (
        <div className={style.developBlock}>
            <h2>Still in development...</h2>
            <img src={devImg} alt="in development"/>
        </div>
    );
};

export default InDevelopment;