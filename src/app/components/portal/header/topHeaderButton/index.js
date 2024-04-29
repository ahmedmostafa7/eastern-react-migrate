import React from 'react';
import { Button } from 'antd';
import style from './style.less';

const topHeaderButton = (props) => {
    const { title, IconComponent, icon, onClick } = props;
    return (
        <Button className={style.button} onClick={onClick}>
            <span>
                {IconComponent && IconComponent}
                {icon && <i className={icon}></i>}
                {' ' + title}
            </span>
        </Button>
    );
};

export default topHeaderButton;